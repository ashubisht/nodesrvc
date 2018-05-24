
const bcrypt = require('bcrypt');

async function hashPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password ', hashPassword);
    return hashPassword;
}

async function validatePassword(request, store){
    return bcrypt.compare(request, store);
}

module.exports.hashPassword = hashPassword;
module.exports.validatePassword = validatePassword;
