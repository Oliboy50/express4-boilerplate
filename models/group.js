var i18n = require('i18n');



/* Group */
module.exports = function(schema) {
    
    // Schema
    Group = schema.define('Group', {
        name: String,
        authority: {type: Number, index: true}
    });
    
    // Validations
    Group.validatesPresenceOf('name', 'authority');
    Group.validatesUniquenessOf('name', {message: i18n.__("This name already exists")});
    Group.validatesNumericalityOf('authority', {int: true});
    
    // Helpers
    
    // Return Model
    return Group;
};

