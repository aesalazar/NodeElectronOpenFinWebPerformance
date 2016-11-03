var express = require('express');
var router = express.Router();
var fs = require('fs');

//Install page for OpenFin Application
router.get('/install', function(req, res, next){
    res.sendFile('install.html', { root: 'public' });
});

//Generate app.json dynamically based on calling ip
router.get('/app.json', function(req, res, next) {
    fs.readFile('./public/app.template.json', 'utf8', function(err, data) {
        //Set the json to reference ipaddress and send it back
        let json = data;
        json = json.replace(/<<URL_AND_PORT>>/gi, req.headers.host);
        res.setHeader('Content-type', 'application/json');
        res.send(json);
    });
});

module.exports = router;