const packagejson = require("../package.json");
const builder = require("electron-builder");
const Platform = builder.Platform;

//Development package.json, see https://goo.gl/5jVxoO
const devMetadata  = packagejson.electronBuilder;

function buildPromise(){
    //Application package.json
    const appMetadata = {
        name: packagejson.name,
        version: packagejson.version,
        description: packagejson.description,
        author: packagejson.author,
        productName: packagejson.productName
    };

    //Build for the current target and send back promise
    return builder.build({
        projectDir: "./",
        devMetadata,
        appMetadata
    });

}

module.exports = buildPromise;