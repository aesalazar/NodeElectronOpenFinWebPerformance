const http = require('http');
const express = require('express');
const ws = require('ws');

const routes = require('./server/routes');
const api = require('./server/api');
const Response = require('./server/response');

//Port settings
const webPort = 5000;

//Setup the web and websocket servers
const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server: server });

//Expose the public folder
app.use(express.static('public'));

//Bring in the routes
app.use('/', routes);

//Set up the websocket listener
wss.on('connection', (ws) => {
    console.log('Connection Established:');
    console.log(ws.upgradeReq.headers);
    console.log('\n');

    ws.on('message', (raw) => {
        let message;
        
        try {
            message = JSON.parse(raw);
        } catch (err) {
            return console.error("Error parsing message: %s\n", raw);
        }

        if (message && message.call) {
            //keep ping request as close to the "metal" as possible
            if (message.call === "ping"){
                ws.send("pong" + message.stamp);
                return;
            }
            
            //Process general message
            console.log('received: %s\n', raw);

            if (!api[message.call])
                return;
                
            let args = message.args || [];
            args.unshift(new Response(ws, message));
            args.unshift(ws);
            api[message.call](...args);
        }
    });

    ws.on('close', (status, clientMsg) => {
        console.log(`Client disconnected (${status}) with message: ${clientMsg}\n`);
    });
});

//Start the server
server.listen(process.env.PORT || webPort, () => {
    console.log("Listening on %j\n", server.address());
});