module.exports = function(sequelize, DataTypes) {
    return sequelize.define('accessToken', {
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'access_token',
        indexes: [
            {
                unique: true,
                fields: ['token', 'provider']
            }
        ]
    })
};
