const PUBLIC_JWK_URL = `http://localhost:${process.env.PORT}/jwks.json`;
const request = require('request');
const jwkToPem = require('jwk-to-pem');

module.exports = {
    getRemoteKey: (header, callback) => {   // JWT: get public certificate from remote endpoint
        request(PUBLIC_JWK_URL, { json: true }, (err, res, body) => {
            const remoteJwk = body && body.keys && body.keys[0];
            if (err || !remoteJwk) {
                callback(err);
            } else {
                const key = jwkToPem(remoteJwk);
                callback(null, key);
            }
        });
    }
};