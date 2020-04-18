const path = require('path');
const fs = require('fs');
const express = require('express');

function setUpRoutes(server, models, jwtFunctions, database) {
    // server.get('/cosmic-cargo', (req, res) => res.sendFile(__dirname + "/cosmic-cargo/index.html"))
    server.use('/cosmic-cargo', express.static(__dirname + '/static'))
}

module.exports = {
    setUpRoutes
};
