module.exports = function(app) {
    const passportGithub = require('./github')(app);
    if(passportGithub) {
        app.get('/oauth/github', passportGithub.authenticate('github', { scope: [ 'user:email' ] }));

        app.get('/oauth/github/callback',
            passportGithub.authenticate('github', { session:false }),
            function(req, res) {
                // Successful authentication
                res.json(req.user);
            });
    } else {
        console.log('github strategy not configured');
    }
};