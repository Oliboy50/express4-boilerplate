// Check if redis is running or not
exports.check = function(eventEmitter) {
    var redis = require("connect-redis/node_modules/redis");
    var client = redis.createClient(global.redis.port || 6379, global.redis.host || 'localhost');

    client.on('error', function() {
        client.quit();
        global.redis.isRunning = false;
        eventEmitter.emit('start');
    });

    client.on('ready', function() {
        client.quit();
        global.redis.isRunning = true;
        eventEmitter.emit('start');
    });
};