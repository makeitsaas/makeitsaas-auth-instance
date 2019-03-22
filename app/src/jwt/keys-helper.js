const fs = require('fs');
const rsaPemToJwk = require('rsa-pem-to-jwk');
const rsaGenerator = require('node-genrsa');

module.exports = new Promise((resolve, reject) => {
    // const privateKey = fs.readFileSync('cert/private.pem', 'utf8');
    // const publicKey = fs.readFileSync('cert/public.pem', 'utf8');
    return rsaGenerator.default({
        bits: 2048,
        exponent: 65537
    }).then(rsaKey => {
        fs.writeFileSync('cert/auto/private.pem', rsaKey.private);
        fs.writeFileSync('cert/auto/public.pem', rsaKey.public);
        let jwk = rsaPemToJwk(rsaKey.private, {use: 'sig'}, 'public');
        resolve({privateKey: rsaKey.private, publicKey: rsaKey.public, jwk});
    }).catch(err => reject(err));
});
