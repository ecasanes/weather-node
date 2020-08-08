const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
});

// for schema change, drop the database

taskSchema.pre('save', async function(next){
    const task = this;

    next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;