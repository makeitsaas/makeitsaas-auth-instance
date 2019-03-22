const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        password: DataTypes.STRING
    }, {
        tableName: 'user',
        indexes: [
            {
                unique: true,
                fields: ['username']
            }
        ],
        hooks: {
            beforeCreate: async function(user) {
                const salt = await bcrypt.genSalt(10); //whatever number you want
                user.password = await bcrypt.hash(user.password, salt);
            },
            beforeUpdate: async function() {

            }
        }
    });

    User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };
    User.prototype.generateHash = function(password) {
        return bcrypt.hash(password, bcrypt.genSaltSync(10));
    };
    User.prototype.updatePassword = function(password) {
        this.password = this.generateHash(newPassword);
        // do persist
    };

    return User;
};
