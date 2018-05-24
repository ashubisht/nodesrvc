
const mongoose = require('mongoose');

async function createUser(user){
    const result = await user.save();
    console.log(result);
    return result;
};

async function findUser(user, UserClass){
    console.log('Trying to find user ', user);
    const result = await UserClass.findOne({username: user.username});
    console.log('Result received')
    return result;
}

module.exports.createUser = createUser;
module.exports.findUser = findUser;
