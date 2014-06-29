var bcrypt = require('bcrypt-nodejs');
var helpers = require('../libs/helpers');
var i18n = require('i18n');


/* User */
module.exports = function(schema) {

    // Schema
    var User = schema.define('User', {
        login: {type: String, index: true},
        password: String,
        activated: {type: Boolean, default: true},
        nickname: {type: String, index: true},
        created: {type: Date, dataType: 'datetime', default: helpers.getDateTime},
        modified: {type: Date, dataType: 'datetime', default: helpers.getDateTime}
    });

    // Validations 
    // (Model validation messages will only be set in global.i18n.defaultLanguage locale, you'll have to copy/paste them in other locale files)
    User.validatesPresenceOf('login', 'password', 'nickname');
    User.validatesUniquenessOf('login', {message: i18n.__("This login already exists")});
    User.validatesLengthOf('password', {min: 5, message: {min: i18n.__("This password is too short")}});
    User.validatesUniquenessOf('nickname', {message: i18n.__("This nickname already exists")});

    // Helpers
    User.prototype.isActivated = function() {
        return this.activated;
    };
    User.prototype.hashPassword = function(password, cb) {
        bcrypt.genSalt(7, function(err, salt) {
            if (err)
                cb(new Error(err));
            bcrypt.hash(password, salt, null, cb);
        });
    };
    User.prototype.checkPassword = function(password, cb) {
        bcrypt.compare(password, this.password, cb);
    };

    // Return Model
    return User;
};
