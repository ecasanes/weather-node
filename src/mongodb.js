const {MongoClient, ObjectID} = require('mongodb');

const mongodbObj = {};

// full ip address instead of string localhost
// to remove the string localhost bug
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();

MongoClient.connect(connectionURL, {
    useNewUrlParser:true,
}, (error, client) => {
    
    if(error){
        return console.log('unable to connect to database', error);
    }

    console.log('Connected correctly');

    const db = client.db(databaseName);

    mongodbObj.findLast(db);
    

});

mongodbObj._insertOne = () => {
    
    db.collection('users').insertOne({
        name: 'Ernest',
        age: 29
    }, (error, result) => {

        if(error){
            return console.log('unable to insert user');
        }

        console.log('successfully inserted', result.ops);
    });

}

mongodbObj._insertMany = () => {

    db.collection('users').insertMany([
        {
            _id: new ObjectID(),
            name: 'Bella',
            age: 30
        },
        {
            _id: new ObjectID(),
            name: 'Banban',
            age: 20
        }
    ], (error, result) => {

        if(error){
            return console.log("unable to insert documents");
        }

        console.log('insert successful', result.ops);

    });

}

mongodbObj.initTasks = (db) => {

    db.collection('tasks').insertMany([
        {
            description: 'Clean the house',
            completed: true
        },
        {
            description: 'Renew inspection',
            completed: false
        },
        {
            description: 'Pot plants',
            completed: true
        }
    ], (error, result) => {

        if(error){
            return console.log("unable to insert documents");
        }

        console.log('insert successful', result.ops);

    });

}

mongodbObj.objectIDShowcase = () => {

    const id = new ObjectID();

    // binary data
    console.log(id.id);

    // timestamp
    console.log(id.getTimestamp());

    // convert to string representation
    console.log(id.toHexString().length);

}

mongodbObj.findOne = (db) => {

    db.collection('users').findOne({
        _id: new ObjectID("...")
        //name: 'Bella'
    }, (error, result) => {

        if(error){
            return console.log('error find one: ', error);
        }

        console.log('find success: ', result);

    })

}

mongodbObj.find = (db) => {

    db.collection('users').find({
        name: 'Ernest'
    })
        .toArray()
        .then((result) => {
            console.log('result: ', result);
        })
        .catch((error) => {
            console.log('error: ', error);
        });

}

mongodbObj.findLast = (db) => {

    db.collection('users').find({})
        .sort({
            _id:-1
        })
        .limit(1)
        .toArray()
        .then((result) => {
            console.log('last document: ', result);
        })
        .catch((error) => {
            console.log('someting whent wrong with the query: ', error);
        });
    

}

mongodbObj.updateOne = (db) => {

    const updatePromise = db.collection('users').updateOne({
        _id: new ObjectID("")
    }, {
        // update operators
        $set: {
            name: 'Test'
        }
    });

    updatePromise
        .then((result) => {
            console.log('then result: ', result);
        })
        .catch((error) => {
            console.log('error: ', error);
        })
}

mongodbObj.delete = (db) => {

    db.collection('users').deleteMany({
        age: 29
    })
        .then((result) => {
            console.log('result: ', result);
        })
        .catch((error) => {
            console.log('error: ', error);
        })

}