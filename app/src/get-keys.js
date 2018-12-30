const fs = require('fs');
const rsaPemToJwk = require('rsa-pem-to-jwk');
const genrsa = require('node-genrsa');

module.exports = new Promise((resolve, reject) => {
  // const privateKey = fs.readFileSync('cert/private.pem', 'utf8');
  // const publicKey = fs.readFileSync('cert/public.pem', 'utf8');
  return genrsa.default({
    bits: 2048,
    exponent: 65537
  }).then(({private, public}) => {
    fs.writeFileSync('cert/auto/private.pem', private)
    fs.writeFileSync('cert/auto/public.pem', public);
    let jwk = rsaPemToJwk(private, {use: 'sig'}, 'public');
    resolve({privateKey: private, publicKey: public, jwk});
  }).catch(err => reject(err));
})
