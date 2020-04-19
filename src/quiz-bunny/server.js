const uuidv4 = require('uuid/v4');
const words = require('./words').words;
const prompts = require('./prompts').prompts;

function setUpRoutes(server, models, jwtFunctions, database) {
    // simple send files
    server.get('/quiz-bunny', (req, res) => res.sendFile(__dirname + "/index.html"))
    server.get('/quiz-bunny/main.js', (req, res) => res.sendFile(__dirname + "/static/main.js"))
    server.get('/quiz-bunny/styles.css', (req, res) => res.sendFile(__dirname + "/static/styles.css"))

    // a list of games
    var games = []
    let STATES = {
        TYPING: 0,
        VOTING: 1,
        OVER: 2,
        WAITING: 3,
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
            gameCode: gameCode
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
            return {name: player.name, ready: player.ready}
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
                state: game.state
            }
            if (game.state == STATES.TYPING) {
                newGame.submitted = game.answers.some(answer => answer.cookie == cookie)
                newGame.prompt = game.prompts[game.round]
                newGame.players.forEach(player => {
                    var playerWithCookie = game.players.find(p => {
                        return p.name == player.name
                    })
                    if(game.answers.some(answer => answer.cookie == playerWithCookie.cookie)){
                        player.ready = true
                    } else {
                        player.ready = false
                    }
                })
            } else if (game.state == STATES.VOTING) {
                newGame.answers = game.answers.map(answer => answer.text)
                newGame.prompt = game.prompts[game.round]
                var game = findGameByCookie(cookie)
                var player = findPlayerByCookie(game, cookie)
                newGame.voted = player.voted
                newGame.players.forEach(player => {
                    var playerWithCookie = game.players.find(p => {
                        return p.name == player.name
                    })
                    player.ready = playerWithCookie.voted
                })
            } else if (game.state == STATES.WAITING) {
                newGame.answers = game.answers.map(answer => {
                    return { text: answer.text, voteCount: answer.votes.length }
                })
                newGame.prompt = game.prompts[game.round]
                var game = findGameByCookie(cookie)
                var player = findPlayerByCookie(game, cookie)
                newGame.ready = player.ready
            } else if (game.state == STATES.OVER) {
                var scores = game.players.map(player => {
                    return { name: player.name, score: player.score }
                })
                // sort
                scores.sort((a,b) => b.score - a.score); 
                newGame.scores = scores
            }

            return newGame
        }
    }
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    function getRandomPlayer(stack, playersList){
        if(stack.length == 0){
            for(var i = 0; i < playersList.length; i++){
                stack.push(playersList[i])
            }
            shuffle(stack)
        }
        return stack.shift()
    }
    // gets a game prompt
    function getPrompts(playerNames, size) {
        var gamePrompts = []
        var stack = []
        for(var i = 0; i < size; i++){
            var randomIndex = Math.floor(Math.random() * prompts.length)
            var prompt =  prompts[randomIndex]
            while(prompt.includes("@")){
                prompt = prompt.replace("@", getRandomPlayer(stack, playerNames))
            }
            gamePrompts.push(prompt)
        }
        return gamePrompts
    }
    // marks the game as started
    function startGame(cookie) {
        let game = games.find(el => el.host == cookie)
        if (game && game.players.length >= 2) {
            game.gameStarted = true
            var playerNames = game.players.map(player => player.name)
            game.prompts = getPrompts(playerNames, 8)
            game.round = 0;
            game.players.forEach(player => {
                player.score = 0
            })
            game.state = STATES.TYPING
            startRound(game);
            return true
        } else {
            return false
        }
    }
    function startRound(game) {
        // keep track of votes
        game.players.forEach(player => {
            player.voted = false
        })
        game.answers = []
        game.state = STATES.TYPING
    }
    function submitAnswer(cookie, text) {
        let game = findGameByCookie(cookie)
        if (!game.answers.some(answer => answer.cookie == cookie)) {
            game.answers.push({ text: text, cookie: cookie })
        }
        if (game.answers.length == game.players.length) {
            startVoting(game)
        }
    }
    function startVoting(game) {
        game.state = STATES.VOTING
        game.answers.forEach(answer => {
            answer.votes = []
        })
        game.voteCount = 0
    }
    function endVoting(game) {
        game.state = STATES.WAITING
        game.players.forEach(player => {
            player.ready = false
        })
        game.answers.forEach(answer => {
            var player = findPlayerByCookie(game, answer.cookie)
            player.score += answer.votes.length
            // extra points for high scoring answer
            if (answer.votes.length >= 3) {
                player.score += 2
            }
        })
    }
    function endRound(game) {
        game.round += 1
        if (game.round >= game.prompts.length) {
            game.state = STATES.OVER
        } else {
            startRound(game)
        }
    }
    // player with cookie votes for answer 
    function voteFor(cookie, answerIndex) {
        let game = findGameByCookie(cookie)
        let playerWhoVoted = findPlayerByCookie(game, cookie)
        let answer = game.answers[answerIndex]
        // If already voted, or voted for self, ignore
        if (playerWhoVoted.voted || answer.cookie == cookie) {
            return false
        }
        playerWhoVoted.voted = true
        answer.votes.push(playerWhoVoted)
        game.voteCount++
        if (game.voteCount == game.players.length) {
            endVoting(game)
        }
        return true
    }
    function ready(cookie) {
        let game = findGameByCookie(cookie)
        let player = findPlayerByCookie(game, cookie)
        player.ready = true
        if (game.players.every(player => player.ready)) {
            endRound(game)
        }
    }
    // Requested by host once
    server.get('/quiz-bunny/host-game', (req, res, next) => {
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
    server.get('/quiz-bunny/join-game', (req, res, next) => {
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
    server.get('/quiz-bunny/start-game', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie || !startGame(cookie)) {
            res.status(400).send({ message: "you cannot start a game" });
        } else {
            res.status(200).send(getPublicGame(cookie))
        }
    })
    // constantly requested by client while in lobby
    server.get('/quiz-bunny/lobby-status', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            res.status(200).send(getPublicGame(cookie))
        }
    })
    // constantly requested by client while game started
    server.get('/quiz-bunny/game-status', (req, res, next) => {
        // TODO
        let cookie = req.cookies.session;
        if (!cookie) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            var game = findGameByCookie(cookie)
            res.status(200).send(getPublicGame(cookie))
            // if(game.state == STATES.TYPING) {
            // } else if(game.state == STATES.VOTING) {
            // } else if(game.state == STATES.WAITING) {
            // }
        }
    })
    server.get('/quiz-bunny/vote', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie || req.query.index == undefined) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            voteFor(cookie, req.query.index)
            res.status(200).send()
        }
    })
    server.get('/quiz-bunny/submit', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie || req.query.text == undefined) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            submitAnswer(cookie, req.query.text)
            res.status(200).send()
        }
    })
    server.get('/quiz-bunny/ready', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            ready(cookie)
            res.status(200).send()
        }
    })
    server.get('/quiz-bunny/ready', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            ready(cookie)
            res.status(200).send()
        }
    })
    server.get('/quiz-bunny/leave', (req, res, next) => {
        let cookie = req.cookies.session;
        if (!cookie) {
            res.status(400).send({ message: "you are not in a game" });
        } else {
            var game = findGameByCookie(cookie)
            game.players = game.players.filter(player => player.cookie != cookie)
            if(game.players.length == 0){
                games = games.filter(g => g != game)
            }
            res.status(200).send()
        }
    })
}

module.exports = {
    setUpRoutes
};


