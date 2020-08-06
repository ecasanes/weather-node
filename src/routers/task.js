const express = require('express');
const Task = require('../models/Task');
const {ObjectID} = require('mongodb');

const app = new express.Router();

app.post('/tasks', async (req, res) => {

    console.log('request: ', req.body);

    try{
        const task = new Task(req.body);
        const newTask = await task.save();
        return res.status(201).send(newTask);
    }catch(error){
        console.log('error: ', error);
        res.status(400).send(error);
    }
    
});

app.get('/tasks', async (req, res) => {
    Task.find({})
        .then((tasks) => {
            res.send(tasks);
        })
        .catch((error) => {
            res.status(500);
            res.send(error);
        })
});

app.get('/tasks/:id', async (req, res) => {

    const params = req.params;
    const id = params.id;

    // we can also use findById(id)

    try{
        const foundTask = await Task.findById({_id: new ObjectID(id)});
    
        if(!foundTask){
            return res.status(404).send();
        }

        res.send(foundTask);
    }catch(error){
        console.log('error: ', error);
        res.status(500).send(error);
    }

});

app.put('/tasks/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowed = ['description', 'completed'];
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
        const updatedTask = await Task.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        });

        if(!updatedTask){
            return res.status(404).send();
        }

        return res.send(updatedTask);
    }catch(error){
        res.status(400).send(error);
    }

});

app.delete('/tasks/:id', async (req, res) => {

    const _id = req.params.id;

    try{
        const deletedTask = await Task.findByIdAndDelete(_id);

        if(!deletedTask){
            res.status(404).send();
        }

        return res.send(deletedTask);
    }catch(error){
        res.status(400).send(error);
    }

});

module.exports = app;