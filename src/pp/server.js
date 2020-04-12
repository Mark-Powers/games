const express = require('express');

function setUpRoutes(server, models, jwtFunctions, database) {
    // server.get('/pp', (req, res) => res.sendFile(__dirname + "/static/index.html"))
    server.use('/pp', express.static(__dirname + "/static"))
}

module.exports = {
    setUpRoutes
};
