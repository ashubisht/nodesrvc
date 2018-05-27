
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
    const user = userModel.buildUser(req.body);
    console.log("User prepared: ", user);
    return saveUser(res, user); //Validate when to use then or return
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
        res.writeHead(200, { 'Connection': 'close' });
        res.end("File write complete");
    });
    
    return req.pipe(busboy);

    // readFileAndSendToSave(req, res, busboy); //Call this function either here or in event
    
});

function fileUploadListener(fieldname, file, filename, encoding, mimetype){
    var saveTo = "F:\\"+ filename; // To be present in config file
    console.log('Uploading to ', saveTo);
    file.pipe(fs.createWriteStream(saveTo));
}

async function readFileAndSendToSave(req, res, busboy){
    await req.pipe(busboy);
    var user = {};
    await fs.readFile("F:\\fil.txt", 'utf8', function(err, content){ //Ti be loaded from config file
        console.log(content);
        user = content;
    });
    return saveUser(res, user); //Validate then vs return
}

async function saveUser(res, user){
    await hash.hashPassword(user.password).then((result)=>{
        console.log('Result: '+ result);
        user.password = result;
    }).catch(err => {
        console.log('Error in hashing the password. ', err.message);
        return res.status(500).send('Internal error occurred while saving the user');
    });

    persistUser.createUser(user).then(
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

    console.log('Password hashed sucessfully. New user object: '+ user);    
}


module.exports = router;
