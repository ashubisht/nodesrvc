
const mongoose = require('mongoose');

const UserScehma = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    middleName: {
        type: String,
        minlength: 3,
        maxlength: 30
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        unique: true
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique : true
    },
    password: {
        type: String,
        required: true,
        minlength: 5 //maxlength not specified as passwords may become big after hashing
    },
    registered_date: {type: Date, default: Date.now}
});

const User = mongoose.model('User', UserScehma ); // 'User' is name of collection in DB while User (without quotes) is to be used in node

function buildUser(userVo){
    return new User({
        firstName: userVo.firstName,
        middleName: userVo.middleName,
        lastName: userVo.lastName,
        email: userVo.emailAddress,
        username: userVo.username,
        password: userVo.password
    });
}

module.exports.buildUser = buildUser;
module.exports.UserClass = User;
