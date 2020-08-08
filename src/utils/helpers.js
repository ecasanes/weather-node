const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const helpers = {};

helpers.bcryptEncrypt = async (text, salt = 8) => {

    const hashedPassword = await bcrypt.hash(text, salt);
    return hashedPassword;

}

helpers.bcryptCompare = async (plainPassword, hashedPassword) => {

    return bcrypt.compare(plainPassword, hashedPassword);

}

helpers.cryptoEncrypt = async (text, secret = 'abcdefg', algo = 'sha256') => {

    const hash = crypto.createHmac(algo, secret).update(text).digest('hex');
    return hash;

}

helpers.cryptoCompare = async (plainPassword, hashedPassword) => {

    const plainPasswordHashed = helpers.cryptoEncrypt(plainPassword);
    return hashedPassword === plainPasswordHashed;

}

module.exports = helpers;