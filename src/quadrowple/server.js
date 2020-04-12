const uuidv4 = require('uuid/v4');

function setUpRoutes(server, models, jwtFunctions, database) {

    server.get('/quadrowple', (req, res) => res.sendFile(__dirname + "/index.html"))
    server.get('/quadrowple/main.js', (req, res) => res.sendFile(__dirname + "/static/main.js"))
    server.get('/quadrowple/styles.css', (req, res) => res.sendFile(__dirname + "/static/styles.css"))
    // server.use('/static', express.static(path.join(__dirname, '/static')))

    var games = {}
    var gameList = []
    var id = 0
    server.get('/quadrowple/status', (req, res) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            cookie = uuidv4();
            res.cookie('session', cookie, { expires: new Date(Date.now() + (1000 * 60 * 60)) });
        }
        currentGames = []
        gameList.forEach( game => {
            var diff = new Date() - game.time;
            // Keep games that are recently updated
            if(diff < 1000 * 10) {// 10 seconds with no update
                currentGames.push(game)
            } else { // otherwise don't save it and get rid of game
                game.players.forEach(c => {
                    delete games[c]
                });
            }
        })
        gameList = currentGames
        if (!games[cookie]) {
            var game = gameList.find((el) => el.waiting)
            if (game) { // Start game
                game.players.push(cookie)
                game.waiting = false
                game.board = [[undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined],
                [undefined, undefined, undefined, undefined, undefined, undefined]]
                game.turn = Math.floor(Math.random() * 2)
                games[cookie] = game
            } else { // Create new game, and wait
                game = {
                    waiting: true,
                    players: [cookie],
                    id: id++,
                    time: new Date(),
                }
                gameList.push(game)
                games[cookie] = game
            }
        } else {
            games[cookie].time = new Date()
        }
        res.status(200).send(games[cookie]);
    })

    // returns undefined if game in progress, or index of winner
    function gameOver(game) {
        for (var player = 0; player < 2; player++) {
            // 4 in a row in a column
            for (var col = 0; col < 7; col++) {
                for (var row = 0; row < 2; row++) {
                    if (game.board[col][row] == player &&
                        game.board[col][row + 1] == player &&
                        game.board[col][row + 2] == player &&
                        game.board[col][row + 3] == player) {
                        return player
                    }
                }
            }
            // 4 in a row in a row
            for (var col = 0; col < 3; col++) {
                for (var row = 0; row < 6; row++) {
                    if (game.board[col][row] == player &&
                        game.board[col + 1][row] == player &&
                        game.board[col + 2][row] == player &&
                        game.board[col + 3][row] == player) {
                        return player
                    }
                }
            }
            // Check up right diagonal
            for (var row = 0; row < 2; row++) {
                for (var col = 0; col < 3; col++) {
                    if (game.board[col][row] == player &&
                        game.board[col + 1][row + 1] == player &&
                        game.board[col + 2][row + 2] == player &&
                        game.board[col + 3][row + 3] == player) {
                        return player
                    }
                }
            }
            // Check down right diagonal
            for (var row = 3; row < 6; row++) {
                for (var col = 0; col < 3; col++) {
                    if (game.board[col][row] == player &&
                        game.board[col + 1][row - 1] == player &&
                        game.board[col + 2][row - 2] == player &&
                        game.board[col + 3][row - 3] == player) {
                        return player
                    }
                }
            }
        }
        return undefined
    }

    function sendGame(res, game, cookie){
        var winner = gameOver(game)
        if (winner != undefined) {
            res.status(200).send({ game: game, turn: -1, winner: game.players[winner] == cookie });
        } else {
            res.status(200).send({ game: game, turn: game.players[game.turn] == cookie });
        }
    }
    server.get('/quadrowple/game/:col', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie || !games[cookie]) {
            next()
            return
        }
        var game = games[cookie]
        const { col } = req.params;
        if (game.players[game.turn] == cookie && gameOver(game) == undefined) {
            // Add player's token to column
            for (var row = 0; row < 6; row++) {
                if (game.board[col][row] == undefined) {
                    game.board[col][row] = (game.players.indexOf(cookie))
                    game.turn = (game.turn + 1) % 2
                    break
                }
            }
        }
        sendGame(res, game, cookie)
    })
    server.get('/quadrowple/game', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie || !games[cookie]) {
            res.status(200).send({restart: true});
            return
        }
        var game = games[cookie]
        if(gameOver(game) != undefined){
            delete games[cookie]
        }
        sendGame(res, game, cookie)
    })

    server.get('/quadrowple/new', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie || !games[cookie]) {
            next()
            return
        }
        games[cookie].players.forEach( el =>{
            delete games[el]
        })
    })

}

module.exports = {
    setUpRoutes
};


