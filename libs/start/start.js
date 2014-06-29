// Init debug
var debug = require('debug')('project');



// Configure App
var app = require('../../app');



// Listen
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});