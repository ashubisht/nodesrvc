
const express = require('express');
const app = express();
const mongoose = require('mongoose');   

const registration = require('./routes/registration');
const login = require('./routes/login');
const benchmark = require('./routes/benchmark');

mongoose.connect('mongodb://localhost/userMgmt').then(
    ()=>{
        console.log('Connected to Database');
    }
).catch(err => {
    console.log('Error while connecting to database: ', err.message, ' \nStacktrace: ', err);
});

app.use(express.json());
app.use('/register', registration);
app.use('/login', login);
app.use('/benchmark', benchmark );

const port = (process.env.port)?(process.env.port):4000;
app.listen(port, ()=>{
    console.log('Listening on port ', port);
});
