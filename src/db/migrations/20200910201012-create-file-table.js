module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('files', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      primaryKey: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    extension: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    mimetype: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    size: {
      type: Sequelize.STRING(50),
      allowNull: false,
    }
  }),

  down: queryInterface => queryInterface.dropTable('files'),
};
