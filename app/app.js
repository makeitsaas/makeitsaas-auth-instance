require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// **********
var passport = require('passport');
var db = require('../database');

app.post('/login', function(req, res) {
  if (!req.body) return res.sendStatus(400);
  db.users.findByUsername(req.body.username, (err, user) => {
    res.send(user);
  })
});

// **********


// JWT: sign/verify
const jwt = require('jsonwebtoken');

// JWT: get public certificate from remote endpoint
const PUBLIC_JWK_URL = 'http://localhost:3001/jwks.json';
const request = require('request');
const jwkToPem = require('jwk-to-pem')
// const jwksClient = require('jwks-rsa'); => do not use because auth0-oriented and requires extra fields (`kid`)

// ajouter la clé au départ si n'existe pas / via conf env
require('./src/get-keys').then(({privateKey, publicKey, jwk}) => {
  var token = jwt.sign({ user: {uuid: '123412341234-1234-1234-1234-123412341234', roles: ['admin']} }, privateKey, { algorithm: 'RS256'});

  app.get('/', (req, res) => res.send('Hello World!'))
  app.get('/jwks.json', (req, res) => {res.send({keys: [jwk]})})
  app.get('/log-me', (req, res) => res.send({jwt: token}))
  app.get('/verify', (req, res) => jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, payload) => res.send({err, payload})))
  app.get('/verify-remote', (req, res) => jwt.verify(token, getRemoteKey, {}, (err, decoded) => res.send({err, decoded})))
}).catch(err => {
  console.log('initialization error')
  console.log(err)
});

// const verifyWithRemoteKey(token) = new Promise((resolve, reject) => {})
const getRemoteKey = (header, callback) => {
  request(PUBLIC_JWK_URL, { json: true }, (err, res, body) => {
    const remoteJwk = body && body.keys && body.keys[0];
    if (err || !remoteJwk) {
      callback(err);
    } else {
      const key = jwkToPem(remoteJwk);
      callback(null, key);
    }
  });
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
