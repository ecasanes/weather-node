const express = require('express');
const auth = require('../middleware/auth');
// reminder: don't require a different casetype name
const User = require('../models/user');
const {ObjectID} = require('mongodb');

const app = new express.Router();

app.post('/users', async (req, res) => {

    console.log('request: ', req.body);

    try{

        const user = new User(req.body);
        const newUser = await user.save();

        const token = await newUser.generateAuthToken(newUser.id);

        return res.status(201).send({
            user: newUser,
            token
        });

    }catch(error){
        console.log('error: ', error);
        res.status(400).send(error);
    }
    
    // user.save().then((result) => {
    //     console.log('result: ', result);
    //     res.status(201);
    //     res.send(user);
    // }).catch((error) => {
    //     console.log('error: ', error);
    //     res.status(400).send(error);
    // });
    
});

app.post('/users/login', async (req,res) => {

    try{
        // define custom (statics)
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken(user.id)
        
        res.send({
            user,
            token
        });
    }catch(error){
        console.log('error login: ', error);
        res.status(401).send({
            error: {
                message: error.message
            }
        });
    }

});

app.post('/users/logout', auth, async (req, res) => {

    const user = req.user;
    const token = req.token;

    try{
        user.tokens = req.user.tokens.filter((tokenObj) => {
            return token !== tokenObj.token;
        });
        //console.log('user tokens: ', user.tokens);
        await user.save();
        res.send();
    }catch(error){
        res.status(500).send();
    }
    


});

app.post('/users/logout/all', auth, async (req, res) => {

    const user = req.user;
    const token = req.token;

    try{
        user.tokens = [];
        //console.log('user tokens: ', user.tokens);
        await user.save();
        res.send();
    }catch(error){
        res.status(500).send();
    }
    


});

// TODO: enable only for admin roles
// app.get('/users', auth, async (req, res) => {

//     try{
//         const foundUser = await User.find({});
//         return res.send(foundUser);
//     }catch(error){
//         res.status(500).send(error);
//     }
    
// });

app.get('/users/me', auth, async (req, res) => {

    res.send(req.user);
    
});

// TODO: admin only
// app.get('/users/:id', auth, async (req, res) => {

//     const params = req.params;
//     const id = params.id;

//     try{
//         const foundUser = await User.findOne({_id: new ObjectID(id)});
    
//         if(!foundUser){
//             return res.status(404).send();
//         }

//         return res.send(foundUser);
//     }catch(error){
//         res.status(500).send(error);
//     }
    

//     // User.findOne({
//     //     _id: new ObjectID(id)
//     // })
//     // .then((user) => {

//     //     if(!user){
//     //         return res.status(404).send();
//     //     }

//     //     res.send(user);
//     // })
//     // .catch((error) => {
//     //     res.status(500);
//     //     res.send(error);
//     // })

// });

// TODO: admin only
// app.put('/users/:id', auth, async (req, res) => {

//     const updates = Object.keys(req.body);
//     const allowed = ['name', 'email', 'password', 'age'];
//     const isValidOperation = updates.every((update) => {
//         return allowed.includes(update);
//     });

//     if(!isValidOperation){
//         console.log('updates: ', updates);
//         return res.status(400).send({
//             error: 'Invalid update key'
//         })
//     }

//     const _id = req.params.id;

//     try{

//         const user = await User.findById(_id);

//         if(!user){
//             return res.status(404).send();
//         }

//         updates.forEach((updateField) => {
//             user[updateField] = req.body[updateField];
//         });
//         const updatedUser = await user.save();

//         // const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
//         //     // return newly updated user instead of old data
//         //     new: true,
//         //     runValidators: true
//         // });

//         // if(!updatedUser){
//         //     return res.status(404).send();
//         // }

//         return res.send(updatedUser);
//     }catch(error){
//         console.log('error: ', error);
//         res.status(400).send(error);
//     }

// });

app.put('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowed = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowed.includes(update);
    });

    if(!isValidOperation){
        console.log('updates: ', updates);
        return res.status(400).send({
            error: 'Invalid update key'
        })
    }

    const user = req.user;

    try{

        if(!user){
            return res.status(404).send();
        }

        updates.forEach((updateField) => {
            user[updateField] = req.body[updateField];
        });
        const updatedUser = await user.save();

        return res.send(updatedUser);
    }catch(error){
        console.log('error: ', error);
        res.status(400).send(error);
    }

});

// TODO: admin only
// app.delete('/users/:id', auth, async (req, res) => {

//     const _id = req.params.id;

//     try{
//         const deletedUser = await User.findByIdAndDelete(_id);

//         if(!deletedUser){
//             res.status(404).send();
//         }

//         return res.send(deletedUser);
//     }catch(error){
//         res.status(400).send(error);
//     }

// });

app.delete('/users/me', auth, async (req, res) => {

    const user = req.user;

    try{
        await user.remove();
        return res.send(user);
    }catch(error){
        res.status(400).send(error);
    }

});

module.exports = app;