const path = require('path');
const fs = require('fs');

function setUpRoutes(server, models, jwtFunctions, database) {
    server.get('/snake', (req, res) => res.sendFile(__dirname + "/index.html"))
    server.get('/snake/styles.css', (req, res) => res.sendFile(__dirname + "/static/styles.css"))
}

module.exports = {
    setUpRoutes
};
