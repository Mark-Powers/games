function setUpRoutes(server, models, jwtFunctions, database) {
    server.get('/paperflight', (req, res) => res.sendFile(__dirname + "/index.html"))
    server.get('/paperflight/styles.css', (req, res) => res.sendFile(__dirname + "/static/styles.css"))
    server.get('/paperflight/levels.js', (req, res) => res.sendFile(__dirname + "/static/levels.js"))
    server.get('/paperflight/update.js', (req, res) => res.sendFile(__dirname + "/static/update.js"))
    server.get('/paperflight/draw.js', (req, res) => res.sendFile(__dirname + "/static/draw.js"))
}

module.exports = {
    setUpRoutes
};