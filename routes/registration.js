
const Joi =  require('joi');
const express = require('express');
const router = express.Router();

const validator = require('../validators/registrationValidator');
//const persistUser = require('../persistence/user_dao');
const userModel = require('../schema/registerUserSchema');

router.get('/', (req, res)=>{
    res.status(200).send('Use the post request to create a user');
});

router.post('/user', (req, res)=>{
    const result = validator.validate(req.body);
    if(result.error){
        console.log('Validation error: ', result.error);
        return res.status(400).send(`Invalid request send to register the user:  ${req.body}`);
    }
    console.log('Valdiation successful');
    console.log('Logger body: ', req.body);
    const user = userModel.buildUser(req.body);

    createUser(user).then(
        () =>{
            console.log('Success received from mongo save');
            return res.status(200).send('Successfully saved user '+ user);
        }
    ).catch(
        err=>{
            console.log('Error received from aync save method while saving users: '+ err);
            return res.status(400).send('Error in saving user');
        }
    )
});

async function createUser(user){
    const result = await user.save();
    console.log(result);
    response = "Successfully saved user: " + user;
}

module.exports = router;
