// This is the express() configuration file, the whole web application start at ./bin/www


/* Requires */
var path = require('path');
var express = require('express');
var app = express();
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var i18n = require('./libs/i18n'); // custom i18n wrapper
var security = require('./libs/security'); // custom security wrapper
var sessions = require('./libs/sessions'); // custom session wrapper
var auth = require('./libs/auth'); // custom authentication wrapper


/* Express environment */
app.set('env', global.environment.type || 'production');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', global.views.engine || 'jade');


/* Middlewares */
app.use(logger('dev')); // https://github.com/expressjs/morgan
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
sessions.session(app);
if (global.security.helmet)
    security.helmet(app);
if (global.security.csrf)
    security.csrf(app); // Catch error403 if invalid token
app.use(i18n);
auth.setup(app); // Set passport module


/* Routes */
app.use('/', require('./routes/root'));
app.use('/admin', require('./routes/admin'));
app.use('/admin/db', require('./routes/admin-db'));
require('./routes/errors')(app); // Catch error404 and Send errors





module.exports = app;