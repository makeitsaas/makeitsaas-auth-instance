const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

module.exports = app => {
    console.log(app.config.oauthProviders.github.getConfig());
    passport.use(new GitHubStrategy(app.config.oauthProviders.github.getConfig(),
        (accessToken, refreshToken, profile, next) => {
            console.log('[OAuth] Github response ******************************');
            console.log('accessToken', accessToken);
            console.log('refreshToken', refreshToken);
            console.log(profile);
            console.log('[OAuth] Github response end***************************');

            const githubId = profile && profile.id;

            // si token
            //   chopper l'email côté github
            //   regarder si user avec githubId comme String(providerId)
            //   si aucun et mais un avec l'email, alors ajouter ça à cet utilisateur
            //   si aucun et aucun avec l'email, alors créer un user, vérifié, avec les informations du profile
            app.models.accessToken.create({
                user_id: 3,
                token: accessToken,
                provider: app.config.oauthProviders.github.code
            }).then(storedToken => {
                next(null, storedToken);
            }).catch(err => {
                next(err);
            });
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

    return passport;
};

/*
Get user github email
curl -H "Authorization: token OAUTH-TOKEN" https://api.github.com/user/emails
[
  {
    "email": "email2@host",
    "primary": false,
    "verified": true,
    "visibility": null
  },
  {
    "email": "GithubUsername@users.noreply.github.com",
    "primary": false,
    "verified": true,
    "visibility": null
  },
  {
    "email": "email1@host",
    "primary": true,
    "verified": true,
    "visibility": "private"
  },
  ...
]
 */

const example = {
    "accessToken": "...",
    "profile": {
        "id": "2005188",
        "displayName": "Antoine D.",
        "username": "Duwab",
        "profileUrl": "https://github.com/Duwab",
        "photos": [
            {
                "value": "https://avatars2.githubusercontent.com/u/2005188?v=4"
            }
        ],
        "provider": "github",
        "_raw": "{\"login\":\"Duwab\",\"id\":2005188,\"node_id\":\"MDQ6VXNlcjIwMDUxODg=\",\"avatar_url\":\"https://avatars2.githubusercontent.com/u/2005188?v=4\",\"gravatar_id\":\"\",\"url\":\"https://api.github.com/users/Duwab\",\"html_url\":\"https://github.com/Duwab\",\"followers_url\":\"https://api.github.com/users/Duwab/followers\",\"following_url\":\"https://api.github.com/users/Duwab/following{/other_user}\",\"gists_url\":\"https://api.github.com/users/Duwab/gists{/gist_id}\",\"starred_url\":\"https://api.github.com/users/Duwab/starred{/owner}{/repo}\",\"subscriptions_url\":\"https://api.github.com/users/Duwab/subscriptions\",\"organizations_url\":\"https://api.github.com/users/Duwab/orgs\",\"repos_url\":\"https://api.github.com/users/Duwab/repos\",\"events_url\":\"https://api.github.com/users/Duwab/events{/privacy}\",\"received_events_url\":\"https://api.github.com/users/Duwab/received_events\",\"type\":\"User\",\"site_admin\":false,\"name\":\"Antoine D.\",\"company\":\"Entrepreneur\",\"blog\":\"https://twitter.com/Antoine_Duwab\",\"location\":\"Paris\",\"email\":null,\"hireable\":null,\"bio\":null,\"public_repos\":21,\"public_gists\":0,\"followers\":8,\"following\":17,\"created_at\":\"2012-07-19T12:55:24Z\",\"updated_at\":\"2019-03-21T12:05:14Z\"}",
        "_json": {
            "login": "Duwab",
            "id": 2005188,
            "node_id": "MDQ6VXNlcjIwMDUxODg=",
            "avatar_url": "https://avatars2.githubusercontent.com/u/2005188?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/Duwab",
            "html_url": "https://github.com/Duwab",
            "followers_url": "https://api.github.com/users/Duwab/followers",
            "following_url": "https://api.github.com/users/Duwab/following{/other_user}",
            "gists_url": "https://api.github.com/users/Duwab/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/Duwab/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/Duwab/subscriptions",
            "organizations_url": "https://api.github.com/users/Duwab/orgs",
            "repos_url": "https://api.github.com/users/Duwab/repos",
            "events_url": "https://api.github.com/users/Duwab/events{/privacy}",
            "received_events_url": "https://api.github.com/users/Duwab/received_events",
            "type": "User",
            "site_admin": false,
            "name": "Antoine D.",
            "company": "Entrepreneur",
            "blog": "https://twitter.com/Antoine_Duwab",
            "location": "Paris",
            "email": null,
            "hireable": null,
            "bio": null,
            "public_repos": 21,
            "public_gists": 0,
            "followers": 8,
            "following": 17,
            "created_at": "2012-07-19T12:55:24Z",
            "updated_at": "2019-03-21T12:05:14Z"
        }
    }
};