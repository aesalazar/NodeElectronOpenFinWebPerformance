var express = require('express');
var router = express.Router();
var fs = require('fs');
var electronBuilder = require('./electronBuilder');

//Install page for OpenFin Application
router.get('/install', function(req, res, next){
    res.sendFile('install.html', { root: 'public' });
});

//Install page for Electron Application
router.get('/electron', function(req, res, next){
    electronBuilder()
        .then(args => {
            const filePath = args[0];
            const data = fs.readFile(filePath, () => {
                if(filePath.substr(filePath.length - 3) === "exe")
                    res.setHeader('Content-type', 'application/exe, application/octet-stream');
                else if (filePath.substr(filePath.length - 3) === "dmg")
                    res.setHeader('Content-type', 'application/dmg, application/octet-stream');
                else if (filePath.substr(filePath.length - 8) === "AppImage")
                    res.setHeader('Content-type', 'application/x-executable, application/octet-stream');
                else
                    console.warn(`Unsupported file type '${filePath}'; Content-Type will be omitted from response`);
                
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