const packagejson = require("../package.json");
const builder = require("electron-builder");
const Platform = builder.Platform;

function buildPromise(){
    //Development package.json, see https://goo.gl/5jVxoO
    const devMetadata  = packagejson.electronBuilder;

    //Application package.json
    const appMetadata = {
        name: packagejson.name,
        version: packagejson.version,
        description: packagejson.description,
        author: packagejson.author,
        productName: packagejson.productName
    };

    //Send back promise
    return builder.build({
        targets: Platform.WINDOWS.createTarget(),
        projectDir: "./",
        devMetadata,
        appMetadata
    });

}

module.exports = { 
    buildPromise,
    outputPath : packagejson.electronBuilder.directories.output
};