module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
      id: {
          type: Sequelize.STRING(50),
          primaryKey: true,
          allowNull: false,
      },
      password: {
          type: Sequelize.STRING(200),
          allowNull: false,
      },
      refreshToken: {
        type: Sequelize.STRING(200),
        allowNull: false,
    },
  }),

  down: queryInterface => queryInterface.dropTable('users'),
};
