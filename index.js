const express = require('express');

express()
    .get('/', (req, res, next) => {
    	console.log("request received")
    	res.send("ok")
    })
    .listen(3000)