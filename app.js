const cluster = require('cluster');

if (cluster.isMaster){
    const os = require('os');
    const numCPUs = os.cpus().length;
    const timeouts = [];

    //Setup event handlers for the cluster
    cluster.on('fork', (worker) => {
        timeouts[worker.id] = setTimeout(() => console.log(`Worker ${worker.id} has timed out.`), 5000);
    });
    cluster.on('listening', (worker, address) => {
        console.log(`Worker ${worker.id} is listening on process ${process.pid}.`);
        clearTimeout(timeouts[worker.id]);
    });

    cluster.on('disconnect', (worker) => {
        console.log(`Worker ${worker.id} has disconnected.`);
    });

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.id} is now online.`);
    });

    cluster.on('exit', (worker, code, signal) => {
        clearTimeout(timeouts[worker.id]);
        if (signal) {
            console.log(`worker was killed by signal: ${signal}`);
        } else if (code !== 0) {
            console.log(`worker exited with error code: ${code}`);
        } else {
            console.log('worker success!');
        }
    });

    // Fork workers
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();  
    }

} else {
    //This is a worker
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

            //Process message
            console.log('worker %s received: %s\n', cluster.worker.id, raw);
            
            if (message && message.call) {
                //keep ping request as close to the "metal" as possible (should be a separate server in production)
                if (message.call === "ping"){
                    ws.send("pong" + message.stamp);
                    return;
                }

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
}