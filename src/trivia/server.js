const uuidv4 = require('uuid/v4');
const words = require('./words').words;
const prompts = require('./prompts').prompts;

function setUpRoutes(server, models, jwtFunctions, database) {
    // simple send files
    server.get('/trivia', (req, res) => res.sendFile(__dirname + "/index.html"))
    server.get('/trivia/main.js', (req, res) => res.sendFile(__dirname + "/static/main.js"))
    server.get('/trivia/styles.css', (req, res) => res.sendFile(__dirname + "/static/styles.css"))
    server.get('/trivia/sound-effects', (req, res) => res.sendFile(__dirname + "/sound-effects.html"))
    server.get('/trivia/', (req, res) => res.sendFile(__dirname + "/static/styles.css"))

    // a list of games
    var games = []
    let STATES = {
        GUESSING: 0,
        WAITING: 1,
        OVER: 2
    }

    // generates a game code
    function generateGameCode() {
        // let words = ["cat", "dog"];
        var index = Math.floor(Math.random() * words.length)
        // ensure no duplicate game code
        while (games.find(el => el.gameCode == words[index].toLowerCase())) {
            var index = Math.floor(Math.random() * words.length)
        }
        return words[index].toLowerCase()
    }
    // gets a new game object
    function getNewGame(hostCookie, hostName) {
        let gameCode = generateGameCode();
        return {
            host: hostCookie,
            players: [{ cookie: hostCookie, name: hostName }],
            questions: [],
            gameCode: gameCode,
            buzzes: []
        }
    }
    // adds a player to a game object
    function addToGame(gameCode, playerCookie, playerName) {
        let game = games.find(el => el.gameCode == gameCode)
        if (game) {
            game.players.push({ cookie: playerCookie, name: playerName })
            return true
        }
        return false
    }
    function findGameByCookie(cookie) {
        return games.find(el => el.players.some(player => player.cookie == cookie))
    }
    function findPlayerByCookie(game, cookie) {
        return game.players.find(player => player.cookie == cookie)
    }
    function getPlayerNames(players) {
        // return players.map(player => player.name)
        return players.map(player => {
            return { name: player.name, score: player.score }
        })
    }
    // Turn the game into a public game object (no cookies, etc.)
    function getPublicGame(cookie) {
        var game = findGameByCookie(cookie)
        if (!game) {
            return { message: "no game active" }
        } else {
            let isHost = cookie == game.host
            let username = game.players.find(player => player.cookie == cookie).name
            let players = getPlayerNames(game.players)
            // console.log(players)
            var newGame = {
                host: isHost,
                players: players,
                name: username,
                gameCode: game.gameCode,
                gameStarted: game.gameStarted,
                state: game.state,
                round: game.round,
                questions: game.questions,
                buzzes: game.buzzes
            }
            if(game.state == STATES.WAITING){
                newGame.players = getPlayerNames(game.players.filter(player => player.cookie != game.host))
            } else if(game.state == STATES.OVER){
                newGame.players = getPlayerNames(game.players.filter(player => player.cookie != game.host))
                var winningScore = Math.max.apply(Math, game.players.map(player => player.score))
                var winningPlayers = game.players.filter(player => player.score == winningScore)
                newGame.winner = winningPlayers.map(player => player.name).join(", ")
                // console.log(newGame)
            }

            return newGame
        }
    }
    // marks the game as started
    function startGame(cookie) {
        let game = games.find(el => el.host == cookie)
        if (game && game.players.length >= 2) {
            game.gameStarted = true
            game.round = 0;
            game.players.forEach(player => {
                player.score = 0
            })
            game.state = STATES.GUESSING
            return true
        } else {
            return false
        }
    }
    function endRound(game) {
        game.state = STATES.GUESSING
        game.buzzes = []
        game.round += 1
        if (game.round >= game.questions.length) {
            game.state = STATES.OVER
        }
    }
    function endQuestion(game){
        game.state = STATES.WAITING
    }
    // give points to player 
    function giveScore(game, index, score) {
        let player = game.players[index]
        player.score += score
    }
    // Requested by host once
    server.get('/trivia/host-game', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            cookie = uuidv4();
            res.cookie('session', cookie, { expires: new Date(Date.now() + (1000 * 60 * 60)) });
        }
        let username = req.query.name
        var game = getNewGame(cookie, username)
        games.push(game)
        res.status(200).send(getPublicGame(cookie))
    })
    // Requested by players joining from game code
    server.get('/trivia/join-game', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            cookie = uuidv4();
            res.cookie('session', cookie, { expires: new Date(Date.now() + (1000 * 60 * 60)) });
        }
        let username = req.query.name
        let code = req.query.code
        if (addToGame(code, cookie, username)) {
            res.status(200).send(getPublicGame(cookie))
        } else {
            res.status(200).send({ message: "Invalid game code" })
        }
    })
    // starts the game
    server.get('/trivia/start-game', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie || !startGame(cookie)) {
            res.status(400).send({ message: "you cannot start a game" });
        } else {
            res.status(200).send(getPublicGame(cookie))
        }
    })
    // constantly requested by client while in lobby
    server.get('/trivia/lobby-status', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            res.status(200).send(getPublicGame(cookie))
        }
    })
    // constantly requested by client while game started
    server.get('/trivia/game-status', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            var game = findGameByCookie(cookie)
            res.status(200).send(getPublicGame(cookie))
        }
    })
    server.get('/trivia/giveScore', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie || req.query.index == undefined || req.query.points == undefined) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            var game = findGameByCookie(cookie)
            giveScore(game, req.query.index, Number(req.query.points))
            res.status(200).send()
        }
    })
    server.get('/trivia/submit', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie || req.query.text == undefined) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            var game = findGameByCookie(cookie)
            console.log(game.hostCookie, cookie)
            if(game.host != cookie){
                res.status(400).send({ message: "you are not host" });
            }
            game.questions.push(req.query.text)
            res.status(200).send()
        }
    })
    server.get('/trivia/endRound', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            endRound()
            res.status(400).send({ message: "you are not in a game" });
        } else {
            var game = findGameByCookie(cookie)
            endRound(game)
            res.status(200).send()
        }
    })
    server.get('/trivia/endQuestion', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            endRound()
            res.status(400).send({ message: "you are not in a game" });
        } else {
            var game = findGameByCookie(cookie)
            endQuestion(game)
            res.status(200).send()
        }
    })
    server.get('/trivia/buzz', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            endRound()
            res.status(400).send({ message: "you are not in a game" });
        } else {
            var game = findGameByCookie(cookie)
            var player = findPlayerByCookie(game, cookie)
            game.buzzes.push(player.name)
            res.status(200).send()
        }
    })
}

module.exports = {
    setUpRoutes
};


