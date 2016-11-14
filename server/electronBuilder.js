const packagejson = require("../package.json");
const builder = require("electron-builder");

//Development package.json, see https://goo.gl/5jVxoO
const devMetadata  = packagejson.electronBuilder;

//Application package.json
const appMetadata = {
    name: packagejson.name,
    version: packagejson.version,
    description: packagejson.description,
    author: packagejson.author
};

function buildPromise(){
    //Build for the current target and send back promise
    return builder.build({
        projectDir: "./",
        devMetadata,
        appMetadata
    });

}

module.exports = buildPromise;