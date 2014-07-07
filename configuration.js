/* 
 * This file is executed just once when process starts.
 * It initializes some global configuration vars needed through the application.
 * 
 */



global.environment = {
    type: 'development', // must be 'development' or 'production'
    https: false
};


global.i18n = {
    supportedLanguages: ['en'],
    defaultLanguage: 'en',
    cookieName: 'locale'
};


global.views = {
    engine: 'jade'
};


global.security = {
    // if csrf: true, you must put the following in each <form> of views (e.g. jade) :
    // input(type="hidden", name="_csrf", value="#{csrftoken}")
    csrf: true,
    helmet: true // go to ./libs/security.js to configure what helmet will do
};


global.session = {
    secret: 'artfAF58af6a8F864UIAFalufoha5468a4f3546aAFA',
    cookie: {
        httpOnly: true,
        maxAge: 900000
    }
};


global.redis = {
    checkRedisState: true, // check if Redis is running before starting app (will set isRunning value)
    isRunning: false, // Dynamic => will be true if Redis is running
    host: 'localhost',
    port: 6379,
    sessionStore: {
        // You may want to persist sessions on your hard drive by setting up an auto SAVE in your redis configuration file
        db: 0,
        prefix: 'sess:'
    }
};


global.mysql = {
    connection: {
        // to (re)create database/tables from ./models/schema.js (will lose existing data): /admin/db/migrate?force=true
        // to update it (won't lose existing data): /admin/db/update
        database: 'express4_boilerplate',
        username: 'root',
        password: '',
        charset: 'UTF8_GENERAL_CI',
        debug: false
    },
    authentication: {
        // to set your admin account: /admin/db/set-authentication
        // (must be done after tables were created (i.e. see above))
        // don't forget to uncomment auth.adminRequired in each route of ./routes/admin-db.js
        // after you've set your admin account
        groups: [
            {
                // => use auth.adminRequired middleware on route to check if logged user is admin
                name: 'admins',
                authority: 9 // 9 means CAN DO EVERYTHING
            },
            {
                // => use auth.userRequired middleware on route to check if user is logged
                name: 'users',
                authority: 1 // 1 means simple USER
            }
        ],
        adminUser: {
            login: 'admin',
            password: 'admin',
            activated: true,
            nickname: 'The Administrator'
        }
    }
};

