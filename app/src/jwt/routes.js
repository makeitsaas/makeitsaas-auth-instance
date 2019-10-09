const keysHelper = require('./keys-helper');

module.exports = function(app) {
    keysHelper.init().then(({privateKey, publicKey, jwk}) => {
        require('./jwt')(app, privateKey, publicKey);
        app.get('/jwks.json', (req, res) => {res.send({keys: keysHelper.getJwkList()})});
        app.post('/verify', (req, res) => app.jwt.verify(req.body.token, (err, payload) => res.send({err, payload})));
        app.post('/verify-remote', (req, res) => app.jwt.verifyWithRemote(req.body.token, (err, decoded) => res.send({err, decoded})));
    }).catch(err => {
        console.log('initialization error', err);
    });
};
