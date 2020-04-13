const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const uuidv4 = require('uuid/v4');
const Op = require('sequelize').Op;

const server = express();
server.use(cookieParser())
server.use(bodyParser.json());

function listen(port) {
    server.listen(port, () => console.info(`Listening on port ${port}!`));
}

// Load a game and its routes
function load(gamePath, models, jwtFunctions, database) {
    const game = require(gamePath);
    game.setUpRoutes(server, models, jwtFunctions, database);
}

function setUpRoutes(models, jwtFunctions, database) {
    // Route logger
    server.use(function (req, res, next) {
        console.debug(new Date(), req.method, req.originalUrl);
        next()
    })

    // Static files
    server.get('/', (req, res) => res.sendFile(__dirname + "/index.html"))
    server.get('/highscore.js', (req, res) => res.sendFile(__dirname + "/highscores.js"))
    server.get('/highscores', (req, res) => res.sendFile(__dirname + "/scores.html"))

    // Sets a score
    server.get('/setScore', async (req, res, next) => {
        var results = await models.scores.findAll({
            where: { uuid: { [Op.eq]: req.query.uuid } }
        })
        if(results.length > 0){
            res.status(400).send("uuid already used")
            return
        }
        models.scores.create({
            game: req.query.game,
            username: req.query.username,
            score: req.query.score,
            uuid: req.query.uuid
        })
        res.status(200).send("score saved")
    })

    // Gets all scores, grouped by game
    server.get('/scores', async (req, res, next) => {
        var games = await database.query(`SELECT DISTINCT game FROM scores`, { type: database.QueryTypes.SELECT });
        var scoresByGames = {}
        for (var i = 0; i < games.length; i++) {
            scoresByGames[games[i].game] = await models.scores.findAll({ attributes: ["username", "score", "createdAt"], where: { game: { [Op.eq]: games[i].game } }, order: [['score', 'DESC']], limit: 15 }).map(x => x.get({ plain: true }))
        };
        res.status(200).send(scoresByGames);
    })
    
    // Gets a unique ID
    server.get('/uuid', async (req, res) => {
        var uuid;
        while (true) {
            uuid = uuidv4()
            var result = await database.query(`SELECT uuid FROM scores where uuid = '${uuid}'`, { type: database.QueryTypes.SELECT });
            if (result.length == 0) {
                break;
            }
        }
        res.status(200).send(uuid)
    })
}

module.exports = {
    listen,
    setUpRoutes,
    load
};


