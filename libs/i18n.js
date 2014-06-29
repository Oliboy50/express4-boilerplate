var i18n = require('i18n');
var path = require('path');


// i18n configuration
i18n.configure({
    locales: global.i18n.supportedLanguages || ['en'],
    cookie: global.i18n.cookieName || 'locale',
    defaultLocale: global.i18n.defaultLanguage || 'en',
    directory: path.resolve(__dirname, '../locales')
});

module.exports = function(req, res, next) {
    // set locale from cookie if defined,
    // else from header Accept-Languages if defined,
    // else from defaultLanguage config
    i18n.init(req, res);
    
    // get currentLocale in views
    res.locals.currentLocale = i18n.getLocale(req);
    
    // set response's i18n methods in global scope
    // this is just because I prefer to see __() instead of res.__() in my controllers
    global.__ = res.__;
    global.__n = res.__n;
    
    next();
};