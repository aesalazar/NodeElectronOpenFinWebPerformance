const express = require('express');
const router = express.Router();
const fs = require('fs');
const electronBuilder = require('./electronBuilder');

//Install page for OpenFin Application
router.get('/install', function(req, res, next){
    res.sendFile('install.html', { root: 'public' });
});

//Install page for Electron Application
router.get('/electron', function(req, res, next){
    electronBuilder()
        .then(e => fs.readFile(e.filePath, (err, data) => {
            res.setHeader('Content-Disposition', `attachment; filename="${e.fileName}"`);
            res.setHeader('Content-type', e.mimeType);
            res.send(data);
        })).catch((error) => {
            console.error(error);
        });
});

//Generate app.json dynamically based on calling ip
router.get('/app.json', function(req, res, next) {
    fs.readFile('./server/template.app.json', 'utf8', function(err, data) {
        //Set the json to reference ipaddress and send it back
        let json = data;
        json = json.replace(/<<URL_AND_PORT>>/gi, req.headers.host);
        res.setHeader('Content-type', 'application/json');
        res.send(json);
    });
});

module.exports = router;