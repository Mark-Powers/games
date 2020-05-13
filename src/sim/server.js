function setUpRoutes(server, models, jwtFunctions, database) {
    server.get('/sim', (req, res) => res.sendFile(__dirname + "/index.html"))
    server.get('/sim/styles.css', (req, res) => res.sendFile(__dirname + "/static/styles.css"))
    server.get('/sim/tiles.js', (req, res) => res.sendFile(__dirname + "/static/tiles.js"))
    server.get('/sim/items.js', (req, res) => res.sendFile(__dirname + "/static/items.js"))
}

module.exports = {
    setUpRoutes
};
