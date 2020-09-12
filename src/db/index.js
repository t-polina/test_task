const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const config = require(`../config/db.config.json`);

const db = { models: {} };

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config
});

const modelsPath = `${__dirname}/models`;

fs.readdirSync(modelsPath).forEach(file => {
  const model = require(path.join(modelsPath, file))(sequelize, DataTypes)
  db.models[model.name] = model;
});

Object.keys(db.models).forEach(modelName => {
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
