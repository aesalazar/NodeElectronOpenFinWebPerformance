# Performance Measurements in Node.js, Web, and OpenFin
Demo application referenced in the blog post <u>SOON</u> to be found here:

* <a href="http://www.eikospartners.com/blog/" target="_blank">Performance Measurements in Node.js, Web and OpenFin</a>

Application screenshots:

<div style="text-align: center;">
    <h2>OpenFin ScreenShot:</h2>
    <a href="public/images/OpenFinScreeny.gif" target="_blank">
        <img src="public/images/OpenFinScreeny.gif" alt="OpenFin Screen Shot" height="300" >
    </a>
    <h2>Web Browser ScreenShot:</h2>
    <a href="public/images/WebScreeny.gif" target="_blank">
        <img src="public/images/WebScreeny.gif" alt="OpenFin Screen Shot" height="320" >
    </a>    
</div>

The purpose of this project is to perform some simple time calculations for an application measuring client, server, and network latency.  A data stream is opened by the client via web-sockets on which the server sends updates at regular intervals.  The updates on the server and the client are both intentially time consuming in order to generate viable measurements (milliseconds). 

It is created using the chromium-based OpenFin API written in pure HTML5.  Since it is JavaScript and CSS it can also be ran in any modern web browser with 99% code reuse.

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

For OpenFin, navigate to `http://www.localhost.com:5000/install`, click the Download button and follow the instructions to complete installation.

For the web version, simply navigate to `http://www.localhost.com:5000/`.  This will show the same single page seen in the OpenFin version.

In either application click the Open Data Stream button to begin generating time measurements.

Additional resources:

* <a href="https://www.eikospartners.com/" target="_blank">Eikos Partners Homepage</a>
* <a href="https://openfin.co/" target="_blank">OpenFin Homepage</a>
* <a href="https://openfin.co/developers/documentation-2/" target="_blank">OpenFin Developers Documentation</a>