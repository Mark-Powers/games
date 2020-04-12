const server = require('./server');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');


const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));

const dbCreds = config.database;
const secret = config.jwt_secret;

const jwtFunctions = {
  sign: function (message) {
    return jwt.sign({ value: message }, secret);
  },
  verify: function (token) {
    return jwt.verify(token, secret).value;
  }
}

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

database.authenticate().then(() => {
  console.debug(`database connection successful: ${dbCreds.database}`);
}, (e) => console.log(e));

async function sync(alter, force, callback) {
  await database.sync({ alter, force, logging: console.log });
}

function setUpModels() {
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
      }
    })
  }
  return models;
}

const models = setUpModels();
sync();

server.setUpRoutes(models, jwtFunctions, database);
server.load("./ur/server", models, jwtFunctions, database)
server.load("./quadrowple/server", models, jwtFunctions, database)
server.load("./snake/server", models, jwtFunctions, database)
server.load("./stacker/server", models, jwtFunctions, database)
server.load("./pinball/server", models, jwtFunctions, database)
server.load("./math/server", models, jwtFunctions, database)
server.load("./pp/server", models, jwtFunctions, database)
server.listen(config.port);

