const path = require('path');
const fs = require('fs');
const express = require('express');

function setUpRoutes(server, models, jwtFunctions, database) {
    server.get('/math', (req, res) => res.sendFile(__dirname + "/index.html"))
    server.get('/math/styles.css', (req, res) => res.sendFile(__dirname + "/static/styles.css"))
    server.use('/math/static', express.static(__dirname + '/static'))
}

module.exports = {
    setUpRoutes
};
