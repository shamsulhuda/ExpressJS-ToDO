const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Get router
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');

// express app initialization
const app = express();
dotenv.config();
app.use(express.json());

// Database connect with mongoose
const username = 'shamsulhuda';
const password = '92xxEt5giBzpxpgr';
const cluster = 'cluster0.abrghjl';
const dbname = 'test';

mongoose
    .connect(
        `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log('Connection Success!');
    })
    .catch((err) => console.log(err));

// application route
app.use('/todo', todoHandler);
app.use('/user', userHandler);

// default error handler

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
}
app.use(errorHandler);

app.listen(3000, () => {
    console.log('app listening at port 3000');
});
