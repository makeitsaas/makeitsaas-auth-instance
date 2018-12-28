const fs = require('fs');
const rsaPemToJwk = require('rsa-pem-to-jwk');

module.exports = new Promise((resolve, reject) => {
  const privateKey = fs.readFileSync('cert/private.pem', 'utf8');
  const publicKey = fs.readFileSync('cert/public.pem', 'utf8');
  const jwk = rsaPemToJwk(privateKey, {use: 'sig'}, 'public');
  resolve({privateKey, publicKey, jwk});
})
