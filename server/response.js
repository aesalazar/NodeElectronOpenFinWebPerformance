//Provides a Response object that can send message back to the client with request id
const ws = require('ws');

function Response(socket, request) {
    this.socket = socket;
    this.request = request;
}

Response.prototype.send = function() {
    if (this.socket.readyState === this.socket.OPEN) {
        const json = JSON.stringify({
            id: this.request.id,
            args: [...arguments]
        });

        this.socket.send(json);
    }
};

module.exports = Response;