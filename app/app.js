require('dotenv').config();
const app = require('express')();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const passport = require('passport');

app.config = require('../config');
app.db = require('../database');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

require('../database/orm')().then(models => {
    app.models = models;
    require('./src/strategies/local/routes')(app);
    require('./src/strategies/github/routes')(app);
    require('./src/jwt/routes')(app);
});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
