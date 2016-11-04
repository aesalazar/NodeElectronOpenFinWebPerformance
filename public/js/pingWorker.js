var latencyStartTime;

//Create the url for the WebSocket
var hostname = location.hostname;
var port = location.port.length > 0 ? ":" + location.port : "";

//Open the connection to the server
var endpoint = "ws://" + hostname + port + "/";
var ws = new WebSocket(endpoint);

//Listen for responses from the server
ws.onmessage = function (ev) {
    
    //See if this is a ping response
    if (ev.data.substr(0, 4) !== "pong") 
        return;
    
    if (ev.data.substr(4) === latencyStartTime.toString()) {
        currentLatency = (performance.now() - latencyStartTime).toFixed(4);
        postMessage(currentLatency);    
    }    
};

function ping(){
    latencyStartTime = performance.now().toString();
    ws.send(JSON.stringify({ call: "ping", stamp: latencyStartTime.toString() }));
}

setInterval(ping, 2000);
