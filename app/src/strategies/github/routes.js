module.exports = function(app) {
    const passportGithub = require('./github')(app);

    app.get('/oauth/github', passportGithub.authenticate('github', { scope: [ 'user:email' ] }));

    app.get('/oauth/github/callback',
        passportGithub.authenticate('github', { session:false }),
        function(req, res) {
            // Successful authentication
            res.json(req.user);
        });
};