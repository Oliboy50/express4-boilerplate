// Some helper methods

var moment = require('moment');


// check if a is defined and typeof boolean
exports.isBool = function(a){
    return (a !== undefined && typeof a === "boolean") ? true : false;
};

// get actual datetime
exports.getDateTime = function(){
    return moment().format("YYYY-MM-DD HH:mm:ss");
};