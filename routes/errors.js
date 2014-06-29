/* Error handlers */

module.exports = function(app) {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error(__('Not Found'));
        err.status = 404;
        next(err);
    });


    // development error handler (will print stacktrace)
    if (global.environment.type === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }


    // production error handler (no stacktraces)
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};