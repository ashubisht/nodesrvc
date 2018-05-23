
const Joi = require('joi');

const schema = {
    username: Joi.string().min(5).max(15).required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30),
    middleName: Joi.string().max(30),
};

function validate(requestBody){
    return Joi.validate(requestBody, schema);
}

module.exports.validate = validate;