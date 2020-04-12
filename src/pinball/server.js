function setUpRoutes(server, models, jwtFunctions, database) {
    server.get('/pinball', (req, res) => res.sendFile(__dirname + "/index.html"))
    server.get('/pinball/styles.css', (req, res) => res.sendFile(__dirname + "/static/styles.css"))
}

module.exports = {
    setUpRoutes
};
