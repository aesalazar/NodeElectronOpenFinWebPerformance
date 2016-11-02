const fs = require('fs');
const http = require('http');
const express = require('express');
const ws = require('ws');

//Port settings
const webPort = 5000;

//Setup the web and websocket servers
const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server: server });

//Expose the public folder
app.use(express.static('public'));

//Install page for OpenFin Application
app.get('/install', function(req, res, next){
    res.sendFile('install.html', { root: 'public' });
});

//Generate app.json dynamically based on calling ip
app.get('/app.json', function(req, res, next) {
    fs.readFile('./public/app.template.json', 'utf8', function(err, data) {
        //Set the json to reference ipaddress and send it back
        let json = data;
        json = json.replace(/<<URL_AND_PORT>>/gi, req.headers.host);
        res.setHeader('Content-type', 'application/json');
        res.send(json);
    });
});

//Set up the websocket listener
wss.on('connection', (ws) => {
    console.log('Connection Established: %s\n', ws.upgradeReq.headers);

    ws.on('message', (raw) => {
        let message;
        try {
            message = JSON.parse(raw);
        } catch (err) {
            return console.error("Error parsing message: %s", raw);
        }

        if (message && message.call) {
            //keep ping request as close to the "metal" as possible
            if (message.call === "ping"){
                ws.send("pong" + message.stamp);
                console.log('received: %s', raw);
                return;
            }
            
            //Process general message
            console.log('received: %s', raw);

            if (!api[message.call])
                return;
                
            let args = message.args || [];
            args.unshift(new Response(ws, message));
            api[message.call].apply(ws, args);
        }
    });

    ws.on('close', (status, clientMsg) => {
        console.log(`Client disconnected (${status}) with message: ${clientMsg}\n`);
    });
});

//Start the server
server.listen(process.env.PORT || webPort, () => {
    console.log("Listening on %j", server.address());
});