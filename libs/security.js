var helmet = require('helmet');
var csrf = require('csurf');


exports.helmet = function(app) {
    // configure helmet (HTTP Headers)
    app.use(helmet.xframe());
    app.use(helmet.iexss());
    app.use(helmet.contentTypeOptions());
    app.use(helmet.cacheControl());
    app.use(helmet.hidePoweredBy());

};
exports.csrf = function(app) {
    // Now we must put the following in each <form> -> input(type="hidden", name="_csrf", value="#{csrftoken}")
    // If the token is different or undefined -> an error 403 will be sent
    app.use(csrf());
    app.use(function(req, res, next) {
        res.locals.csrftoken = req.csrfToken();
        next();
    });

};

