module.exports = function(sequelize, DataTypes) {
    const OAuthResourceOwner = sequelize.define('oauthResourceOwner', {
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        owner_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        provider_code: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'oauth_resource_owner',
        indexes: [
            {
                unique: true,
                fields: ['owner_id', 'provider_code']
            }
        ]
    });

    OAuthResourceOwner.isOwnerRegistered = function(ownerId, providerCode) {
        return OAuthResourceOwner.findOne({
            where: {
                owner_id: ownerId,
                provider_code: providerCode,
            }
        }).then(ownerInfo => {
            if(ownerInfo) {
                return sequelize.models.user.findByPk(ownerInfo.user_id);
            } else {
                return;
            }
        })
    };

    return OAuthResourceOwner;
};
