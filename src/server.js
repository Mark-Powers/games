const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const request = require('request');
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');

const path = require('path');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));

const server = express();
server.use(cookieParser())
server.use(bodyParser.json());
//server.use(bodyParser.urlencoded({ extended: true }));

function listen(port) {
    server.listen(port, () => console.info(`Listening on port ${port}!`));
}

function load(gamePath, models, jwtFunctions, database){
    const game = require(gamePath);
    game.setUpRoutes(server, models, jwtFunctions, database);
}

function setUpRoutes(models, jwtFunctions, database) {
    server.use(function (req, res, next) {
        console.debug(new Date(), req.method, req.originalUrl);
        next()
    })

    server.get('/', (req, res) => res.sendFile(__dirname + "/index.html"))
}

module.exports = {
    listen,
    setUpRoutes,
    load
};


