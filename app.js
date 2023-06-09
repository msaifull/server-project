const logger = require('morgan');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');


const usersRouter = require('./app/api/v1/users/router');

const app = express();

const versionV1 =  '/api/v1'

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    res.json({ message: "welcome to api semina"})
});
app.use(`${versionV1}`, usersRouter);

module.exports = app;
