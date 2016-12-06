var logTextArea = document.getElementById("logTextArea");
var divOutputArea = document.getElementById("divOutputArea");
var ws;
var pingWorker;
var logCount = 0;

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

    ws.onclose = function(ev){
        if (ev.code !== 1000) {
            logText("WS connection closed, retrying...");
            setTimeout(attemptReconnect, 1000);
        }
               
    };

    //Listen for responses from the server
    ws.onmessage = function (ev) {
        var responseStartTime = performance.now();

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
        var txt = " Server ms: " + (data.serverEndTime - data.serverStartTime).toFixed(2);
        txt += " Client ms: " + (performance.now() - responseStartTime).toFixed(2);
        logText(txt);
    };
}

//Setup web worker to measure net latency
function startPingWorker(){
    if (pingWorker)
        pingWorker.terminate();

    pingWorker = new Worker('js/pingWorker.js');
    pingWorker.onmessage = function(e){
        logText("Ping took: " + e.data + " ms");
    };
}

function logText(text){
    if (++logCount < 1000){
        logTextArea.textContent = text + "\n" + logTextArea.textContent;
    } else {
        logTextArea.textContent = text;
        logCount = 1;
    }
}

function openStream() {
    connect(function() {
        ws.send(JSON.stringify({call: "openDataStream", args: [100]}));
        sessionStorage.setItem("streamOpen", "true");
    });
}

function closeStream() {
    if (ws == null || ws.readyState === ws.CLOSED)
        return;
    ws.send(JSON.stringify({call: "closeDataStream"}));
    sessionStorage.setItem("streamOpen", "false");
}

function attemptReconnect(){
    //Force a refresh in case something was changed on the server
    connect(function(){ document.location.reload(); });
}

startPingWorker();
connect(function(){
    if (sessionStorage.getItem("streamOpen") === "true") 
        openStream(); 
});