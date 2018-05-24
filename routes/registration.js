
const Joi =  require('joi');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

const validator = require('../validators/registrationValidator');
const persistUser = require('../persistence/user_dao');
const userModel = require('../schema/UserSchema');
const hash = require('../utility/hash');

router.get('/', (req, res)=>{
    res.status(200).send('Use the post request to create a user');
});

router.post('/user', (req, res)=>{
    const result = validator.validate(req.body);
    if(result.error){
        console.log('Validation error: ', result.error);
        return res.status(400).send(`Invalid request send to register the user:  ${req.body}`);
    }
    console.log('Validation successful');
    console.log('Logger body: ', req.body);
    const user = userModel.buildUser(req.body);

    saveUser(req, res, user);
});


async function saveUser(req, res, user){
    await hash.hashPassword(user.password).then((result)=>{
        console.log('Result: '+ result);
        user.password = result;
    }).catch(err => {
        console.log('Error in hashing the password');
        res.status(500).send('Internal error occurred while saving the user');
    });

    persistUser.createUser(user).then(
        ()=>{
                console.log('Success received from mongo save');
                // return res.status(200).send('Successfully saved user '+ _.pick(user,['username', 'email', 'firstName',
                //                             'middleName', 'lastName']));
                return res.status(200).send('Successfully saved user '+ user);
        }
    ).catch(
        err=>{
            console.log('Error received from aync save method while saving users: '+ err);
            return res.status(400).send('Error in saving user');
        }
    );

    console.log('Password hashed sucessfully. New user object: '+ user);    
}


module.exports = router;
