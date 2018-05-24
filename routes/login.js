
const express = require('express');
const router = express.Router();

const validator = require('../validators/loginvalidator');
const userSchema = require('../schema/UserSchema');
const hash = require('../utility/hash');
const userLookup = require('../persistence/user_dao');

router.get('/', (req,res)=>{
    res.send('Use post request to login to service');
});

router.post('/', (req, res) =>{
    const validationResult = validator.validate(req.body);
    if(validationResult.error){
        console.log('Validation error occurred ', error);
        return res.status(400).send('Invalid login request request: '+ req.body);
    }

    //const user = userModel.buildUser(); //Only required for saving. Model is needed for persistence and not for search
    const UserClass = userSchema.UserClass;

    findUser(req.body, res, UserClass);

});

async function findUser(user, res, UserClass){
    
    var userStored = {};

    await userLookup.findUser(user, UserClass).then(
        (result) => {
            console.log('Successfully received response at service layer ', result);
            if(!result){
                return res.status(400).send('No such user found');
            }
            console.log('Successfully found a user: ', user.username);
            userStored = result;
        }
    ).catch(err =>{
        console.log('Error received while finding the user ', err);
        return res.status(500).send('Error in finding the user');
    });

    //Assumed user found else will not reach this flow
    hash.validatePassword(user.password, userStored.password).then(
        (result)=>{ // can also user resolve, reject and then add valid conditions ?
            console.log('Result for bcrypt compare ', result);
            if(result && result === true){                
                return res.status(200).send('Successful login');
            }else{
                console.log('Invalid password for user ', user.username);
                return res.status(400).send('Invalid login request request: '+ user.username);
            }
            
        }
    ).catch(err =>{
        console.log('Error in validating password for user ', user.username);
        return res.status(400).send('Invalid login request request: '+ user.username);
    });
    
}

module.exports = router;
