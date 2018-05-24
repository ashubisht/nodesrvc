
const Joi = require('joi');

const schema = {
    username: Joi.string().min(5).max(15).required(),
    password: Joi.string().min(6).max(20).required()
};

function validate(loginRequest){
    return Joi.validate(loginRequest, schema);
}

module.exports.validate = validate;
