require('dotenv').config();
const app = require('express')();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const passport = require('passport');

app.config = require('../config');
app.db = require('../database');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(function(req, res, next) {
    // CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const initDb = () => {
    return require('mysql2/promise').createConnection({
        host     : process.env.DB_HOSTNAME,
        user     : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD
    }).then((connection) => {
        connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE};`);
    });
}

const initORM = () => {
    require('../database/orm')().then(models => {
        app.models = models;
        require('./src/strategies/local/routes')(app);
        require('./src/strategies/github/routes')(app);
        require('./src/jwt/routes')(app);
        app.get('/users/:id', (req, res) => {
            app.models.user.findByPk(req.params.id).then(user => {
                if(!user) {
                    res.status(404).send({message: 'User does not exist'});
                } else {
                    res.send(user.getPublicInfos());
                }
            });
        });
        app.get('/resources_owners/:id', (req, res) => {
            app.models.oauthResourceOwner.isOwnerRegistered(req.params.id, 'github').then(resourceOwner => {
                //console.log(token.getUser);
                res.send(resourceOwner);
            }).catch(err => {
                console.log('error', err);
                res.status(500).send(err.message)
            });
        });
        app.get('/mock-github-callback/:owner_id', (req, res) => {
            app.models.user.createFromResourceOwner(req.params.owner_id, 'github', 'Duwab').then(user => {
                //console.log(token.getUser);
                res.send(app.jwt.sign(user));
            }).catch(err => {
                console.log('error', err);
                res.status(500).send(err.message)
            });
        });
    });
}

initDb().then(initORM);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
