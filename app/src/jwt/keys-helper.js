const fs = require('fs');
const rsaPemToJwk = require('rsa-pem-to-jwk');
const rsaGenerator = require('node-genrsa');

const KEYS_RELATIVE_PATH = `cert/auto`;

module.exports = {
    init: () => new Promise((resolve, reject) => {
        const keyId = generateKeyId();
        return generateRsaKey().then(rsaKey => {
            fs.writeFileSync(`${KEYS_RELATIVE_PATH}/private-${keyId}.pem`, rsaKey.private);
            fs.writeFileSync(`${KEYS_RELATIVE_PATH}/public-${keyId}.pem`, rsaKey.public);

            let jwk = rsaPemToJwk(rsaKey.private, {use: 'sig'}, 'public');

            resolve({privateKey: rsaKey.private, publicKey: rsaKey.public, jwk});
        }).catch(err => reject(err));
    }),
    getJwkList: () => {
        return getPrivateKeysPath()
            .map(privateKeyPath => fs.readFileSync(`${privateKeyPath}`, 'utf8'))
            .map(privateKey => rsaPemToJwk(privateKey, {use: 'sig'}, 'public'));
    }
};

const generateKeyId = () => {
    let id = 0,
        exists = true;

    while (exists) {
        try {
            const privateExists = fs.existsSync(`cert/auto/private-${id}.pem`);
            const publicExists = fs.existsSync(`cert/auto/public-${id}.pem`);
            if (privateExists || publicExists) {
                // there already is a certificate with this id
                id++;
            } else {
                return id;
            }
        } catch (err) {
            console.error(err);
            return id;
        }
    }
};

const generateRsaKey = () => {
    return rsaGenerator.default({
        bits: 2048,
        exponent: 65537
    });
};

const getPrivateKeysPath = () => {
    return fs.readdirSync(KEYS_RELATIVE_PATH)
        .filter(filePath => /^private/.test(filePath))
        .map(privateKeyFileName => `${KEYS_RELATIVE_PATH}/${privateKeyFileName}`);
};
