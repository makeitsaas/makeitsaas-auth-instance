const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

//const User = require('../models/user');
const githubConfig = require('./config');
//const init = require('./init');


passport.use(new GitHubStrategy(githubConfig,
    function(accessToken, refreshToken, profile, done) {
        done(null, {accessToken, refreshToken, profile})
        /*var searchQuery = {
            name: profile.displayName
        };

        var updates = {
            name: profile.displayName,
            someID: profile.id
        };

        var options = {
            upsert: true
        };

        // update the user if s/he exists or add a new user
        User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
            if(err) {
                return done(err);
            } else {
                return done(null, user);
            }
        });*/
    }

));

// serialize user into the session
//init();


module.exports = passport;
