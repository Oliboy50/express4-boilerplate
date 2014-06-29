var session = require('express-session');
var RedisStore = require('connect-redis')(session);


exports.session = function(app) {
    // configure sessions & cookies
    var sessOptions = {
        secret: global.session.secret || "YOU-SHOULD-SET-THIS-SECRET-KEY-IN-CONFIGURATION-FILE",
        cookie: {
            secure: global.environment.https || false, // HTTPS (true or false)
            httpOnly: global.session.cookie.httpOnly || true,
            maxAge: global.session.cookie.maxAge || 900000
        }
    };
    // permanent sessions if Redis is running
    var isRunning = global.redis.isRunning || false;
    if (isRunning) {
        sessOptions.store = new RedisStore({
            host: global.redis.host || 'localhost',
            port: global.redis.port || 6379,
            prefix: global.redis.sessionStore.prefix || 'sess:', // Default prefix of Redis KEYS
            db: global.redis.sessionStore.db || 0
        });
    } else {
        console.log("redis is not running - sessions won't be written to disk");
    }

    app.use(session(sessOptions));
};

