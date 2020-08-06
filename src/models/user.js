const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
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
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    }
});

module.exports = User;