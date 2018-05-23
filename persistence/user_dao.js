
const mongoose = require('mongoose');

const usermodel = require('../schema/registerUserSchema');

async function createUser(user){
    const result = await user.save();
    console.log(result);
    return result;
};

module.exports.createUser = createUser;
