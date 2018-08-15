
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

router.get('/getDataAfterTen', (req, res)=>{
	return getDataAfterTimeOut(res);
})

router.get('/doLongOprnAsync', async (req,res)=>{
	return longAsyncOprn(res);
})

router.get('/doLongOprnAsync2', async (req,res)=>{
	const time = await longAsyncOprn2(res);
	res.send("Operation completed in "+ time + " millis");
})

router.get('/doLongOprnAsyncCallback', async (req,res)=>{
	return longAsyncOprnCallb(res);
})

router.get('/corruptOprn', (req,res)=>{
	const fs = require('fs');
	const stream = fs.createReadStream('does-not-exist.txt');
})





async function longAsyncOprn(res){
	const date = Date.now();
	longLoop();
	const time = Date.now() - date;
	return res.send(`Operation comepleted in ${time} millis`);
}

async function longAsyncOprn2(res){
	return new Promise((resolve, reject)=>{
		const date = Date.now();
		for(var i =0; i<10000000000; i++){
		}
		const time = Date.now() - date;
		resolve(time);
	})
}

async function longAsyncOprnCallb(res){
	const date = Date.now();
	setTimeout(()=>{
		console.log("Data received");
		const time = Date.now() - date;
		res.send(`Operation completed in ${time/1000} seconds`);
	},0);
}

async function longLoop(){
	for(var i =0; i<10000000000; i++){
	}
}

async function getDataAfterTimeOut(res){
	const date = Date.now();
	await setTimeout(async() => {
		await console.log("Doing some operation");
		console.log("Data received");
		const time = Date.now() - date;
		res.send(`Operation completed in ${time/1000} seconds`)
	}, 10000);
}


module.exports = router;