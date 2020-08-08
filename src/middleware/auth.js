const authUtil = require('../utils/auth');
const User = require('../models/user');

const auth = async (req, res, next) => {

    const authHeaders = req.header('Authorization');

    console.log('AUth headers: ', authHeaders);

    if(!authHeaders){
        console.log('no auth headers');
        return res.status(401).send({
            error: 'Please authenticate'
        });
    }

    const headerParts = authHeaders.split(' ');

    if(headerParts.length < 2){
        return res.status(401).send({
            error: 'Please authenticate'
        });
    }

    const bearer = headerParts[0];
    const token = headerParts[1];

    if(bearer !== 'Bearer'){
        return res.status(401).send({
            error: 'Please authenticate'
        });
    }


    try{    

        const validToken = await authUtil.verify(token);

        if(!validToken){
            throw new Error();
        }

        const user = await User.findOne({_id: validToken._id,'tokens.token':token});

        if(!user){
            throw new Error();
        }

        // pass to succeeding route handlers the already queried user
        req.user = user;
        req.token = token;

        next();

    }catch(error){

        // TODO: What about expired token
        const errorName = error.name; // e.g. TokenExpiredError

        console.log('error name: ', errorName);
        console.log('error: ', error);

        res.status(401).send({
            error: 'Please authenticate'
        });
    }
}

module.exports = auth;