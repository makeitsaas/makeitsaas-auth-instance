const jwt = require('jsonwebtoken');
const {getRemoteKey} = require('./jwt-remote');
// const jwksClient = require('jwks-rsa'); => do not use because auth0-oriented and requires extra fields (`kid`)

module.exports = function(app, privateKey, publicKey) {
    app.jwt = {
        sign: (user) => {
            return jwt.sign(
                { user: {id: user.id, displayName: 'Some user', roles: []} },
                privateKey,
                {
                    algorithm: 'RS256',
                    expiresIn: '365 days'
                }
            );
        },
        verify: (token, callback) => {
            jwt.verify(token, publicKey, { algorithms: ['RS256'] }, callback);
        },
        verifyWithRemote: (token, callback) => {
            jwt.verify(token, getRemoteKey, {}, callback);
        }
    }
};