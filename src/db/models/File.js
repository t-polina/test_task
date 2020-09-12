module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    id: {
      field: 'id',
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      field: 'title',
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    extension: {
      field: 'extension',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    mimetype:{
      field: 'mimeType',
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    size:{
      field: 'size',
      type: DataTypes.STRING(50),
      allowNull: false,
    }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
    tableName: 'files',
  });


  return File;
};
