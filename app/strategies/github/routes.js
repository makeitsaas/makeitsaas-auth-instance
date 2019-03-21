const passportGithub = require('./github');

module.exports = function(app) {
    app.get('/auth/github', passportGithub.authenticate('github', { scope: [ 'user:email' ] }));

    app.get('/auth/github/callback',
        passportGithub.authenticate('github', { session:false }),
        function(req, res) {
            // Successful authentication
            res.json(req.user);
        });
};