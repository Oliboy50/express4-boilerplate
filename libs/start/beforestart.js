var events = require('events');
var eventEmitter = new events.EventEmitter();
var redis = require('./checkredis');

var stuffs = 0; // Number of stuffs to do before starting app
var startCounter = 0; // Number of times 'start' has been emitted

// START HANDLER
eventEmitter.on('start', function() {
    if (startCounter === stuffs) {
        // Can start app
        require('./start');
    }
    startCounter++;
});


/* STUFFS */
// REDIS CHECK
if (global.redis.checkRedisState) {
    stuffs++;
    redis.check(eventEmitter); // get Redis' state then emit 'start'
}


/* START */
eventEmitter.emit('start');