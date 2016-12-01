const BigNumber = require('bignumber.js');
const present = require('present');

//Main api logic to managing and updating connections
const channels = new Map();
const streamRate = 200;
let streamInterval;

function openDataStream(websocket, response, count){
    //Make sure there is not already a stream open
    removeChannel(websocket);

    //Create channel
    channels.set(websocket, (data) => {
        const serverStartTime = present();
       
        //Add new data
        const dataSet = [];
        for(let i = 0; i < count; i++) {
            const n = randomInt(50, 100);

            dataSet.push({ 
                id: i,
                stringId: randomString(randomInt(5,10)),
                nValue: n,
                fibonacciSum: sumArray(fibonacci(n)).toString()
            });
        }

        //Send it back to the client
        response.send({
            data: dataSet,
            serverStartTime,
            serverEndTime: present()
        });
    });    

    //Start the stream if not yet
    startStreamer(count);
}

function closeDataStream(websocket, response){
    removeChannel(websocket);
}

//Clear any instance of the socket from the channels map
function removeChannel(websocket) {
    if (!channels.get(websocket)) 
        return;

    clearInterval(channels.get(websocket));
    channels.delete(websocket);
}

//Start data stream - if already started and called again it will clear the interval and restart
function startStreamer(dataCount){
    clearInterval(streamInterval);

    //restart
    streamInterval = setInterval(function() {
        //Call the channels
        for(const channel of channels){
            channel[1]();
        }
    }, streamRate);
}

//Provide some random string data based on length
function randomString(length)
{
    let str = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i = 0; i < length; i++)
        str += chars.charAt(Math.floor(Math.random() * chars.length));

    return str;
}

//Provides a random number between the min and max values
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Provide a fibonacci number based on n
function fibonacci(n) {
    let fibs = [0, 1];

    for (let i = 2; i <= n; i++)
        fibs.push(fibs[i - 1] + fibs[i - 2]);

    return fibs;
}

//Sum an array of numbers and returns BigNumber
function sumArray(arr){
    let num = new BigNumber(0);

    //toString will suppress errors when num >15 sig-figs; technically this could truncate/round
    for(let val of arr)
        num = num.add(val.toString());
    
    return num;
}

module.exports = {
    openDataStream,
    closeDataStream
};