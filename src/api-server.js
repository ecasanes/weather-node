const express = require('express');
// require a file
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

// middleware should be above all app.use
// app.use((req, res, next) => {

// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get('*', (req, res) => {
    res.sendStatus(405);
    res.send({
        code: 405,
        message: 'Method not allowed'
    })
});

app.post('*', (req, res) => {
    res.sendStatus(405);
    res.send({
        code: 405,
        message: 'Method not allowed'
    })
});

app.listen(port, () => {
    console.log('server is up on port: ', port);
});

