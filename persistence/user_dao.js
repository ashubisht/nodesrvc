
const mongoose = require('mongoose');
const userModel = require('../schema/UserSchema');

async function createUser(user, isUpload){
    if(isUpload && isUpload===true){
        return await batchInsertUser(user);
    }else{
        return await insertSingleUser(user);
    }
};

async function insertSingleUser(user){
    console.log('DAO layer. Saving single user to DB');
    const result = await user.save();
    console.log(result);
    return result;
}

async function findUser(user, UserClass){
    console.log('Trying to find user ', user);
    const result = await UserClass.findOne({username: user.username});
    console.log('Result received')
    return result;
}

async function batchInsertUser(userList){
    console.log('DAO layer. Saving user list to DB');
    return userModel.UserClass.collection.insertMany(userList); //Return promise
}

module.exports.createUser = createUser;
module.exports.findUser = findUser;
module.exports.batchInsertUser = batchInsertUser;
