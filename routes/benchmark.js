
const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
	res.send(`
		<h1>Benchmarking page</h1>	
	`);
});

router.get('/getDataQuick', (req, res) =>{
    res.send("Here's some quick data without async");
});

router.get('/getDataAfterTwo', (req, res)=>{
	return getDataAfterTimeOut(res);
})

router.get('/doLongOprnAsync', async (req,res)=>{
	return await longAsyncOprn(res);
})

router.get('/corruptOprn', (req,res)=>{
	const fs = require('fs');
	const stream = fs.createReadStream('does-not-exist.txt');
})

async function longAsyncOprn(res){
	const date = Date.now();
	await longLoop();
	const time = Date.now() - date;
	res.send("Operation completed in ", time, " millis");
}

async function longLoop(){
	for(var i =0; i<100000000; i++){
		for(var j=0; j<100000; j++){

		}
	}
}

async function getDataAfterTimeOut(res){
	const date = Date.now();
	await setTimeout(() => {
		console.log("Doing some operation");
	}, 2000);
	console.log("Data received");
	const time = Date.now() - date;
	res.send("Operation completed in ", time, " millis");
}


module.exports = router;