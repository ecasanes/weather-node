const mongoose = require('mongoose');


// for a much more common usecase of validation 
// such as email and social security number
// use npm validator

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

mongoose.connect(connectionURL+'/'+databaseName, {
    useNewUrlParser: true,
    useCreateIndex: true,
    
    // disable usage of deprecated functions
    useFindAndModify: false,
    useUnifiedTopology: true
});
