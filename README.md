# Performance Measurements in Node.js, OpenFin, Electron, and Web
Demostrates the ability of a single node.js server with a single code-based to be ran in OpenFin and Electron desktop applications as well as any web browser simultaneously.  It is also the demo application referenced in the blog post here:

* <a href="http://www.eikospartners.com/blog/measuring-application-performance-nodejs-web-openfin" target="_blank">Measuring application performance in Node.js, Web and OpenFin</a>

Application screenshots:

<div style="text-align: center;">
    <h2>OpenFin</h2>
    <a href="public/images/OpenFinScreeny.gif" target="_blank">
        <img src="public/images/OpenFinScreeny.gif" alt="OpenFin Screen Shot" height="300" >
    </a>
    <h2>Electron</h2>
    <a href="public/images/ElectronScreeny.gif" target="_blank">
        <img src="public/images/ElectronScreeny.gif" alt="Electron Screen Shot" height="300" >
    </a>
    <h2>Web Browser</h2>
    <a href="public/images/WebScreeny.gif" target="_blank">
        <img src="public/images/WebScreeny.gif" alt="OpenFin Screen Shot" height="300" >
    </a>    
</div>

The purpose of this project is to perform some simple time calculations for an application measuring client, server, and network latency.  A data stream is opened by the client via web-sockets on which the server sends updates at regular intervals.  The updates on the server and the client are both intentionally time consuming to generate viable measurements (milliseconds). 

It is created using the chromium-based OpenFin API and open source Electron API both of which use pure HTML5.  Since it is JavaScript and CSS it can also be ran in any modern web browser with 99% code reuse.

This was built in Visual Studios Code but can be ran like any other node project.  It is using node.js version 6 and the client requires support for Web Workers and the performance.now() function.  To start remember to first run 

`npm install` 

to get needed dependencies and then 

`npm start`

to start the server.  If running in VS Code the launch.json file is already configure so simply press F5.

Once started, it will create an HTTP and WebSocket server listening on port:

```javascript
//Port settings
const webPort = 5000;
```

For OpenFin and Electron installations, navigate to `http://www.localhost.com:5000/install`, click the Download buttons and follow the instructions to complete installation.

For the web version, simply navigate to `http://www.localhost.com:5000/`.  This will show the same single page seen in the desktop versions.

In each application click the Open Data Stream button to begin generating time measurements.

Additional resources:

* <a href="https://www.eikospartners.com/" target="_blank">Eikos Partners Homepage</a>
* <a href="https://openfin.co/" target="_blank">OpenFin Homepage</a>
* <a href="https://openfin.co/developers/documentation-2/" target="_blank">OpenFin Developers Documentation</a>
* <a href="http://electron.atom.io/" target="_blank">Electron Homepage</a>
* <a href="http://electron.atom.io/docs/" target="_blank">Electron Developers Documentation</a>
