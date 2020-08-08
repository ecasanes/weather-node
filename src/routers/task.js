const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');
const {ObjectID} = require('mongodb');

const app = new express.Router();

app.post('/tasks', auth, async (req, res) => {

    const user = req.user;

    try{
        const task = new Task({
            ...req.body, 
            owner: user._id
        });
        const newTask = await task.save();
        return res.status(201).send(newTask);
    }catch(error){
        console.log('error: ', error);
        res.status(400).send(error);
    }
    
});

// TODO: admin only
// app.get('/tasks', auth, async (req, res) => {

//     Task.find({})
//         .then((tasks) => {
//             res.send(tasks);
//         })
//         .catch((error) => {
//             res.status(500);
//             res.send(error);
//         })
// });

// GET /tasks?completed=true
// GET /tasks?limit=1&skip=1
// GET /tasks?sortBy=createdAt&order=asc
app.get('/tasks', auth, async (req, res) => {

    const match = {};
    const options = {
        sort: {}
    };

    const allowedSortOrderFields = ['+', '-', 'ascending', 'asc', 'descending', 'desc'];

    const completed = req.query.completed;
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    const sortBy = req.query.sortBy;
    const order = req.query.order;

    if(completed){
        match.completed = completed === 'true';
    }

    if(limit && !isNaN(limit) && limit > 0){
        options.limit = limit;
    }

    if(skip && !isNaN(skip)){
        options.skip = skip;
    }

    if(sortBy && !order){
        options.sort[sortBy] = 1;
    }

    if(sortBy && order && allowedSortOrderFields.includes(order)){
        
        let sortOrder = 1;

        switch(order){
            case '+':
                sortOrder = 1;
                break;
            case '-':
                sortOrder = -1;
                break;
            case 'asc':
                sortOrder = 1;
                break;
            case 'desc':
                sortOrder = -1;
                break;
            case 'ascending':
                sortOrder = 1;
                break;
            case 'descending':
                sortOrder = -1;
                break;
        }
        
        console.log('sortBy: ', sortBy);
        console.log('sort order: ', sortOrder);

        options.sort[sortBy] = sortOrder;

        console.log('sort: ', options);

    }

    try{

        const user = req.user;
        // await user.populate('tasks').execPopulate();
        await user.populate({
            path: 'tasks',
            match,
            options
        }).execPopulate();

        return res.send(user.tasks);
    }catch(error){
        res.status(500).send();
    }
    
});

app.get('/tasks/:id', auth, async (req, res) => {

    const user = req.user;
    const params = req.params;
    const id = params.id;

    try{

        //const foundTask = await Task.findById(id);

        const foundTask = await Task.findOne({_id: id, owner:user._id});

        // populate owner from User data
        // await foundTask.populate('owner').execPopulate();
        // task.owner will be the user object

        if(!foundTask){
            return res.status(404).send();
        }

        res.send(foundTask);
    }catch(error){
        console.log('error: ', error);
        res.status(500).send(error);
    }

});

app.put('/tasks/:id', auth, async (req, res) => {

    const user = req.user;

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
        // const updatedTask = await Task.findByIdAndUpdate(_id, req.body, {
        //     new: true,
        //     runValidators: true
        // });

        // if(!updatedTask){
        //     return res.status(404).send();
        // }

        // return res.send(updatedTask);

        //const task = await Task.findById(_id);
        const task = await Task.findOne({_id, owner:user._id});

        if(!task){
            return res.status(404).send();
        }

        updates.forEach((updateField) => {
            task[updateField] = req.body[updateField];
        });
        const updatedTask = await task.save();

        return res.send(updatedTask);

    }catch(error){
        res.status(400).send(error);
    }

});

app.delete('/tasks/:id', auth, async (req, res) => {

    const user = req.user;
    const _id = req.params.id;

    try{
        
        // const deletedTask = await Task.findByIdAndDelete(_id);
        const deletedTask = await Task.findOneAndDelete({_id, owner:user._id});
        
        if(!deletedTask){
            res.status(404).send();
        }

        return res.send(deletedTask);

    }catch(error){
        res.status(400).send(error);
    }

});

module.exports = app;