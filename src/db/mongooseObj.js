const mongooseObj = {};

mongooseObj.setupUserModel = () => {

}

mongooseObj.insertNewUser = () => {

    // insert
    const me = new User({
        name: 'Ernest', 
        age: 'hello'
    });

    // save
    me.save()
        .then((result) => {
            console.log('result: ', result);
        })
        .catch((error) => {
            console.log('error: ', error);
        });

}

mongooseObj.insertNewTask = () => {

    const newTask = new Task({
        description: 'Clean the house', 
        completed: false
    });
    
    newTask.save()
        .then((result) => {
            console.log('result: ', result);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
    
    

}




