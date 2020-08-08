const jwt = require('jsonwebtoken');

const jwtModule = {};

jwtModule.generateToken = async (id, secret = 'abcdefg', expiresIn = '15 minutes') => {

    // TODO: secret from config
    const token = jwt.sign({_id: id}, secret, {
        expiresIn
    });

    return token;


}

jwtModule.verify = async (token, secret = 'abcdefg') => {

    // TODO: secret from config
    return jwt.verify(token, secret);

}

module.exports = jwtModule;