const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const Op = require('sequelize').Op;

const server = express();
server.use(cookieParser())
server.use(bodyParser.json());

function listen(port) {
    server.listen(port, () => console.info(`Listening on port ${port}!`));
}

function load(gamePath, models, jwtFunctions, database) {
    const game = require(gamePath);
    game.setUpRoutes(server, models, jwtFunctions, database);
}

function setUpRoutes(models, jwtFunctions, database) {
    server.use(function (req, res, next) {
        console.debug(new Date(), req.method, req.originalUrl);
        next()
    })

    server.get('/', (req, res) => res.sendFile(__dirname + "/index.html"))
    server.get('/setScore', (req, res, next) => {
        let game = req.query.game
        let username = req.query.username
        let score = req.query.score
        console.log(game, username, score)
        models.scores.create({ 
            game: req.query.game, 
            username: req.query.username, 
            score: req.query.score 
        })
        res.status(200)
    })
    server.get('/scores', async (req, res, next) => {
        var games = await database.query(`SELECT DISTINCT game FROM scores`, { type: database.QueryTypes.SELECT });
        var scoresByGames = {}
        for(var i = 0; i < games.length; i++){
            scoresByGames[games[i].game] = await models.scores.findAll({ atttributes: ["username", "score", "createdAt"], where : {game: {[Op.eq]: games[i].game}}, order: [['score', 'DESC']], limit: 15}).map(x => x.get({ plain: true }))
        };
        res.status(200).send(scoresByGames);
    })
    server.get('/highscore.js', (req, res) => res.sendFile(__dirname + "/highscores.js"))
    server.get('/highscores', (req, res) => res.sendFile(__dirname + "/scores.html"))
}

module.exports = {
    listen,
    setUpRoutes,
    load
};


