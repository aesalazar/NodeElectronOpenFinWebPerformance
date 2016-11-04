var logTextArea = document.getElementById("logTextArea");
var divOutputArea = document.getElementById("divOutputArea");
var latencyStartTime;
var currentLatency;
var latencySetInterval;
var ws;
var pingWorker;

function connect(callback) {
    if (ws != null && ws.readyState === ws.OPEN) {
        if (callback != null)
            callback();
        return;
    }
    
    //Create the url for the WebSocket
    var hostname = location.hostname;
    var port = location.port.length > 0 ? ":" + location.port : "";

    //Open the connection to the server
    var endpoint = "ws://" + hostname + port + "/";
    ws = new WebSocket(endpoint);

    ws.onopen = function(ev) {
        logText("WS connection established: " + (ws.readyState === ws.OPEN));    
        if (callback != null)
            callback();
    };

    //Listen for responses from the server
    ws.onmessage = function (ev) {
        var responseStartTime = new Date().getTime();

        //Process data message
        var data = JSON.parse(ev.data).args[0];

        //Show the data as rendered objects to consume some time
        while (divOutputArea.hasChildNodes()) 
            divOutputArea.removeChild(divOutputArea.lastChild);

        var objs = data.data;
        for(var i = 0; i < objs.length; i++){
            var obj = objs[i];
            var div = document.createElement("div");
            var flds = Object.keys(obj);

            //Create a div for the each field and its value
            for(var j = 0; j < flds.length; j++){
                var fld = flds[j];
                
                var span = document.createElement("span");
                span.innerText = fld + ": ";
                div.appendChild(span);

                var input = document.createElement("input");
                input.type = "text";
                input.value = obj[fld];
                input.style.width = "100px";
                div.appendChild(input);
            }

            //Append object div to main
            divOutputArea.appendChild(div);
        }

        //Update the log
        var txt = " Server Time= " + (data.serverEndTime - data.serverStartTime);
        txt += "; Client Time = " + (new Date().getTime() - responseStartTime);
        logText(txt);
    };
}

//Setup web worker to measure net latency
function startPingWorker(){
    pingWorker = new Worker('js/pingWorker.js');
    pingWorker.onmessage = function(e){
        logText("WS pong received from server: " + e.data + "ms");
    };
}

function logText(text){
    logTextArea.textContent = text + "\n" + logTextArea.textContent;
}

function openStream() {
    connect(function() {
        ws.send(JSON.stringify({call: "openDataStream", args: [100]}));
    });
}

function closeStream() {
    if (ws == null || ws.readyState === ws.CLOSED)
        return;
    clearInterval(latencySetInterval);    
    ws.send(JSON.stringify({call: "closeDataStream"}));
}

//Create the connections
startPingWorker();
connect();
