const express = require('express');
const router = express.Router();
const fs = require('fs');
const electronBuilder = require('./electronBuilder');

const mimes = new Map();
mimes.set("exe", "exe");
mimes.set("dmg", "dmg");
mimes.set("zip", "zip");
mimes.set("AppImage", "x-executable");

//Install page for OpenFin Application
router.get('/install', function(req, res, next){
    res.sendFile('install.html', { root: 'public' });
});

//Install page for Electron Application
router.get('/electron', function(req, res, next){
    electronBuilder()
        .then(args => {
            const filePath = args[0];
            fs.readFile(filePath, (err, data) => {
                const ext = filePath.substr(filePath.lastIndexOf(".") + 1);
                
                if (mimes.has(ext))
                    res.setHeader('Content-type', `application/${mimes.get(ext)}, application/octet-stream`);
                else
                    console.warn(`Unsupported file type '${ext}' in file '${filePath}'; Content-Type will be omitted from response`);
                
                const filename = filePath.substr(filePath.replace(/\\/g,"/").lastIndexOf("/") + 1);
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.send(data);
            });
        }).catch((error) => {
            console.error(error);
        });
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