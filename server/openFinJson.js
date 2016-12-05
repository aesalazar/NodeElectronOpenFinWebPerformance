//Provides a valid json string for starting an OpenFin project.
function createJson(host){
    const json = {
        "devtools_port": 9090,
        "startup_app": {
            "name": "Node Performance Measure",
            "url": "http://" + host + "/",
            "uuid": "NodePerfMeasure",
            "applicationIcon": "http://" + host + "/images/eikos-logo-multi.ico",
            "autoShow": true,
            "defaultWidth": 800,
            "defaultHeight": 600
        },
        "runtime": {
            "arguments": "",
            "version": "stable"
        },
        "shortcut": {
            "company": "Eikos Partners",
            "description": "Latency Measurements of a simple Node.js project",
            "icon": "http://" + host + "/images/eikos-logo-multi.ico",
            "name": "Node Performance Measure"
        }
    };
    return json;
}

module.exports = createJson;