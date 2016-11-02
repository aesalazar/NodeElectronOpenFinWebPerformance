var ws;
var log = document.getElementById("logTextArea");
var latencyStartTime;

function connect() {
    //Create the url for the WebSocket
    var hostname = location.hostname;
    var port = location.port.length > 0 ? ":" + location.port : "";

    //Open the connection to the server
    var endpoint = "ws://" + hostname + port + "/";
    ws = new WebSocket(endpoint);

    ws.onopen = function(ev) {
        log.textContent += "WS connection established: " + (ws.readyState === ws.OPEN) + "\n\n";
    }

    //Listen for responses from the server
    ws.onmessage = function (ev) {

    //See if this is a ping response
    if (ev.data.substr(0, 4) === "pong") {
        if (parseInt(ev.data.substr(4)) === latencyStartTime) {
        var currentLatency = new Date().getTime() - latencyStartTime;
        log.textContent += "WS pong received from server: " + currentLatency + "ms\n";
        }

        return;
    }

    //Process general message
    log.textContent += "WS message received from server:\n";
    log.textContent += ev.data;
    };
}

function ping(){
    latencyStartTime = new Date().getTime();
    ws.send(JSON.stringify({ call: "ping", stamp: latencyStartTime })); 
}

function sendMessage() {
    var data = {
        source: "ClientWebSocket Application (client)",
        url: document.URL
    };
    ws.send(JSON.stringify({call: "ping", stamp: latencyStartTime}));
}

//Create the connection
connect();
