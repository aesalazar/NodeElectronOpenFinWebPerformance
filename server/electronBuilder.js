const packagejson = require("../package.json");
const builder = require("electron-builder");

const mimes = new Map();
mimes.set("exe", "exe");
mimes.set("dmg", "dmg");
mimes.set("zip", "zip");
mimes.set("AppImage", "x-executable");

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
    return new Promise((resolve, reject) => {
        builder
            .build({ projectDir: "./", devMetadata, appMetadata })
            .then(args => {
                const filePath = args[0];
                const fileName = filePath.substr(filePath.replace(/\\/g,"/").lastIndexOf("/") + 1);
                const ext = fileName.substr(fileName.lastIndexOf(".") + 1);

                let mimeType;
                if (mimes.has(ext))
                    mimeType = `application/${mimes.get(ext)}, application/octet-stream`;
                else
                    console.warn(`Unsupported file type '${ext}' in file '${filePath}'; mime type will be null`);
                
                resolve({fileName, filePath, mimeType});

            }).catch((error) => {
                console.error(error);
            });
    });
}

module.exports = buildPromise;