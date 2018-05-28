
const Joi =  require('joi');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Busboy = require('busboy');
const fs = require('fs');

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
        console.log('Validation error: ', result.error.message);
        return res.status(400).send(`Invalid request send to register the user:  ${req.body.username}`);
    }
    console.log('Validation successful');
    console.log('Logger body: ', req.body);
    return saveUser(res, req.body   , false); //Validate when to use then or return
});

//Can be replicated by postman client
router.get('/user/upload', function (req, res) {
    res.send('<html><head></head><body>\
               <form method="POST" enctype="multipart/form-data">\
                <input type="text" name="textfield"><br />\
                <input type="file" name="filefield"><br />\
                <input type="submit">\
              </form>\
            </body></html>');
  res.end();
});

router.post('/user/upload', (req, res)=>{
    var busboy = new Busboy({headers: req.headers});
    console.log('Busboy instantiated: ');
    busboy.on('file', fileUploadListener);
    busboy.on('finish', ()=>{
        console.log('File uploaded successfully');
        /* res.writeHead(200, { 'Connection': 'close' });
        res.end("File write complete"); */
    });
    /* busboy.on('error', ()=>{
        console.log('Error while uploading file ');
        return res.status(500).send('Error in uploading file');
    }); */

    //req.pipe(busboy);
    
    return readFileAndSendToSave(req, res, busboy); //Call this function either here or in event
    
});

function fileUploadListener(fieldname, file, filename, encoding, mimetype){
    var saveTo = "F:\\"+ filename; // To be present in config file
    console.log('Uploading to ', saveTo);
    file.pipe(fs.createWriteStream(saveTo));
}

async function readFileAndSendToSave(req, res, busboy){
    try{
        await req.pipe(busboy);
        await fs.readFile("F:\\fil.txt", 'utf8', function(err, content){ //Ti be loaded from config file
            console.log(content);
            return saveUser(res, JSON.parse(content), true);
        });
    }catch(err){
        console.log('Error while piping the file or reading the file: ', err.message);
        return res.status(500).send('Internal error while saving the user');
    }
    
} 

async function saveUser(res, jsonUser, isUpload){
    
    var user = [];

    console.log('Value of isUpload ', isUpload);

    if(isUpload && isUpload===true){
        console.log('Is upload is true and now will push element to array');
        var multiUser = [];
        jsonUser.forEach(element => {
            multiUser.push(userModel.buildUser(element));
        });
        user = multiUser;
    }else{
        console.log('Is upload is false and now will push element to array');
        const singleUser = userModel.buildUser(jsonUser);
        console.log("User prepared: ", singleUser.username);
        user.push(singleUser);
    }


    console.log('Registration.js user array created: ' , user);

    for(var element of user){
        console.log('In registration js, invoking hash password utility for element: ', element.password);
        await hash.hashPassword(element.password).then((result)=>{
            console.log('Result: '+ result);
            element.password = result;
        }).catch(err => {
            console.log('Error in hashing the password. ', err.message);
            return res.status(500).send('Internal error occurred while saving the user');
        });
    }

    if(isUpload !==true){
        console.log('Is upload is not true, convering array to object');
        user = user.pop(); //Replace array with json object
    }

    persistUser.createUser(user, isUpload).then(
        ()=>{
                console.log('Success received from mongo save');
                // return res.status(200).send('Successfully saved user '+ _.pick(user,['username', 'email', 'firstName',
                //                             'middleName', 'lastName'])); //Check why lodash pick is not returning text but unparsed object
                return res.status(200).send('Successfully saved user '+ user);
        }
    ).catch(
        err=>{
            console.log('Error received from aync save method while saving users: '+ err);
            return res.status(400).send('Error in saving user');
        }
    );   
}


module.exports = router;
