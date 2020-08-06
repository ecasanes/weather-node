const express = require('express');
const User = require('../models/User');
const {ObjectID} = require('mongodb');

const app = new express.Router();

app.post('/users', async (req, res) => {

    console.log('request: ', req.body);

    try{
        const user = new User(req.body);
        const newUser = await user.save();
        return res.status(201).send(newUser);
    }catch(error){
        //console.log('error: ', error);
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

app.get('/users', async (req, res) => {

    try{
        const foundUser = await User.find({});
        return res.send(foundUser);
    }catch(error){
        res.status(500).send(error);
    }
    
});

app.get('/users/:id', async (req, res) => {

    const params = req.params;
    const id = params.id;

    try{
        const foundUser = await User.findOne({_id: new ObjectID(id)});
    
        if(!foundUser){
            return res.status(404).send();
        }

        return res.send(foundUser);
    }catch(error){
        res.status(500).send(error);
    }
    

    // User.findOne({
    //     _id: new ObjectID(id)
    // })
    // .then((user) => {

    //     if(!user){
    //         return res.status(404).send();
    //     }

    //     res.send(user);
    // })
    // .catch((error) => {
    //     res.status(500);
    //     res.send(error);
    // })

});

app.put('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowed = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return update.includes(allowed);
    });

    if(!isValidOperation){
        return res.status(400).send({
            error: 'Invalid update key'
        })
    }

    const _id = req.params.id;

    try{
        const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
            // return newly updated user instead of old data
            new: true,
            runValidators: true
        });

        if(!updatedUser){
            return res.status(404).send();
        }

        return res.send(updatedUser);
    }catch(error){
        res.status(400).send(error);
    }

});

app.delete('/users/:id', async (req, res) => {

    const _id = req.params.id;

    try{
        const deletedUser = await User.findByIdAndDelete(_id);

        if(!deletedUser){
            res.status(404).send();
        }

        return res.send(deletedUser);
    }catch(error){
        res.status(400).send(error);
    }

});

module.exports = app;