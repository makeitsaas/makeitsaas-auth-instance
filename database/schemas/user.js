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
            //allowNull: false
        },
        password: {
            type: DataTypes.STRING
        },
        display_name: {
            type: DataTypes.STRING(255)
        },
        verified: {
            type: DataTypes.BOOLEAN
        },
    }, {
        tableName: 'user',
        indexes: [
            {
                //unique: true,
                fields: ['username']
            }
        ],
        hooks: {
            beforeCreate: async function(user) {
                const salt = await bcrypt.genSalt(10); //whatever number you want
                if(user.password) {
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async function() {

            }
        }
    });

    User.createFromResourceOwner = function(ownerId, providerCode, displayName) {
        return User.create({display_name: displayName || 'Display Name', verified: true}).then(user => {
            return sequelize.models.oauthResourceOwner.create({
                user_id: user.id,
                owner_id: ownerId,
                provider_code: providerCode,
            }).then(() => {
                return user;
            })
        })
    };

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
    User.prototype.getPublicInfos = function() {
        return {
            id: this.id,
            username: this.username,
            displayName: this.display_name,
            verified: this.verified
        }
    };

    return User;
};
