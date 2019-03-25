module.exports = function(app) {
    const passportGithub = require('./github')(app);
    if(passportGithub) {
        app.get('/oauth/github', passportGithub.authenticate('github', { scope: [ 'user:email' ] }));

        app.get('/oauth/github/callback',
            passportGithub.authenticate('github', { session:false }),
            function(error, req, res, next) {
                //if(error.name === 'InternalOAuthError') {
                if(error.message === 'Failed to fetch user profile') {
                    res.status(400).json({ message: 'Invalid oauth code' });
                } else {
                    res.status(500).json(error);
                }

            },
            function(req, res) {
                // Successful authentication
                res.json({
                    token: app.jwt.sign(req.user)
                });
            });
    } else {
        console.log('github strategy not configured');
    }
};
