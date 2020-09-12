module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('blacklist', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    token: {
      type: Sequelize.TEXT('medium'),
      allowNull: false,
    }
  }),

  down: queryInterface => queryInterface.dropTable('blacklist'),
};
