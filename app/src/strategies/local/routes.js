module.exports = function(app) {

    app.post('/signup',
        (req, res, next) => {
            if(/^MAKEITTEST$/i.test(req.body.code)) {
                next();
            } else {
                res.status(401).send({
                    message: 'Wrong invitation code'
                });
            }
        },
        (req, res) => {
            createUser(req.body.username, req.body.password)
                .then(user => res.send(user))
                .catch(error => {
                    if(error.name === "SequelizeUniqueConstraintError") {
                        res.status(400) && res.send({message: "User name already exists"})
                    } else {
                        console.error(error);
                        res.status(500) && res.send({message: error.name})
                    }
                });
        });

    app.post('/login', function(req, res) {
        if (!req.body) return res.sendStatus(400);
        app.models.user.findOne({
            where: {username: req.body.username}
        }).then( (user) => {
            if(!user || !user.validPassword(req.body.password)) {
                res.status(401);
                res.send({message: "Invalid Credentials"});
            } else {
                res.send({
                    token: app.jwt.sign(user)
                });
            }
        }).catch(error => {
            console.log('error', error);
            res.status(500);
            res.send({error});
        });
    });

    const createUser = (username, password) => {
        let userModel = app.models.user;
        return userModel.create({
            username,
            password
        })
    };
};



/*

  1. test local strategy with callback
    return passport.authenticate('local-signup', (error, user, info) => {
        if (error) return res.status(400).json({ message: info });
        if (user) return res.status(200).json({ message: info });
        return res.status(401).json({ message: info });
    }

  2. Github social auth
    https://mherman.org/blog/social-authentication-in-node-dot-js-with-passport/

*/
