var Schema = require('jugglingdb').Schema;
var schema = new Schema('mysql', global.mysql.connection || {});


// Get models
var User = require('./user')(schema);
var Group = require('./group')(schema);




// Define Relationships
User.hasAndBelongsToMany('groups');
Group.hasAndBelongsToMany('users');




// Exports schema & models
module.exports = {
    schema: schema,
    User: User,
    Group: Group
};