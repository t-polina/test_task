const bcrypt = require('bcryptjs');

const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            field: 'id',
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        password: {
            field: 'password',
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        refreshToken: {
            field: 'refreshToken',
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'users',
    });

    User.beforeCreate(user => {
        const hash = bcrypt.hashSync(user.password, saltRounds);
        user.password = hash;
    });


    User.prototype.isValidPassword = function (password) {
        const user = this;
        const compare = bcrypt.compareSync(password, user.password);
        return compare;
    };

    return User;
};
