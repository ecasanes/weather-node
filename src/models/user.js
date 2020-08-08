const mongoose = require('mongoose');
const validator = require('validator');
const helpers = require('../utils/helpers');
const auth = require('../utils/auth');
const Task = require('../models/task');
const { Timestamp } = require('mongodb');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // check documentation for validators
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        // custom validators
        validate(value) {
            if(value < 0) {
                throw new Error("Age must be a positive numberr");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim:true,
        validate(value) {
            if(value.toLowerCase().includes("password")){
                throw new Error("Password cannot contain the word 'password'");
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim:true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
});

// virtual property for related collections
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// methods - model methods
userSchema.methods.generateAuthToken = async function(){

    const user = this;
    const token = await auth.generateToken(user._id.toString());

    // save to tokens array
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;

};

userSchema.methods.toJSON = function () {

    const user = this;
    // function provided by mongoose
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    console.log('user object: ', userObject);

    return userObject;

};

// statics - model methods
userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({email});

    if(!user){
        console.log('unable to login - wrong email');
        throw new Error("Unable to login");
    }

    const isMatched = await helpers.bcryptCompare(password, user.password);

    if(!isMatched){
        console.log('unable to login - wrong password');
        throw new Error("Unable to login");
    }

    return user;


};

userSchema.pre('save', async function(next){
    
    const user = this;

    // TODO: always isModified to true
    // TODO: add verification if password already the same as the last query

    if(user.isModified('password')){
        user.password = await helpers.bcryptEncrypt(user.password);
    }

    // called to terminate pre function and proceed next function
    next();

});

// Middleware that delete user tasks when user is removed
userSchema.pre('remove', async function(next) {

    const user = this;
    const tasksDeleted = await Task.deleteMany({owner:user._id});

    next();

});

const User = mongoose.model('User', userSchema);

module.exports = User;