const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load the config and configurable parameteres
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
const dbCreds = config.database
const secret = config.jwt_secret;

// An object to help sign and verify jwt cookies
const jwtFunctions = {
  sign: function (message) {
    return jwt.sign({ value: message }, secret);
  },
  verify: function (token) {
    return jwt.verify(token, secret).value;
  }
}

// Create the database object
const database = new Sequelize(dbCreds.database, undefined, undefined, {
  logging(str) {
    console.debug(`DB:${str}`);
  },
  dialectOptions: {
    charset: 'utf8mb4',
    multipleStatements: true,
  },
  storage: './database.sqlite',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});
// Connect to database
database.authenticate().then(() => {
  console.debug(`database connection successful`);
}, (e) => console.log(e));

// Create a sync helper function for the database
async function sync(alter, force, callback) {
  await database.sync({ alter, force, logging: console.log });
}

// Create ORM models and sync database
const models = {
  "scores": database.define('score', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    score: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    game: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    uuid: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}
sync();

// Set up main routes
const server = require('./server');
server.setUpRoutes(models, jwtFunctions, database);

// Load routes for each game
server.load("./ur/server", models, jwtFunctions, database)
server.load("./quadrowple/server", models, jwtFunctions, database)
server.load("./snake/server", models, jwtFunctions, database)
server.load("./stacker/server", models, jwtFunctions, database)
server.load("./pinball/server", models, jwtFunctions, database)
server.load("./math/server", models, jwtFunctions, database)
server.load("./cosmic-cargo/server", models, jwtFunctions, database)
server.load("./pp/server", models, jwtFunctions, database)

// Start the server
server.listen(config.port);
