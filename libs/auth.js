
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var db = require('../models/db');


// Use this to require simple authentication on any route
exports.userRequired = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

// Use this to require admin authentication on any route
exports.adminRequired = function(req, res, next) {
    if (req.isAuthenticated()) {
        var currentUser = db.User(req.user);
        currentUser.groups(function(err, groups) {
            if (err)
                return next(new Error(err));
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].authority >= 9) {
                    console.log(groups[i].authority);
                    return next();
                }
            }
            // Don't have enough authority to go there
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
};





// Passport setup
exports.setup = function(app) {

    // Passport session setup
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        db.User.find(id, function(err, user) {
            done(err, user);
        });
    });


    // Passport authentication strategy
    passport.use('local-login', new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass the entire request to the callback
    },
    function(req, login, password, done) {
        // execute at next loop
        process.nextTick(function() {
            db.User.findOne({where: {login: login}}, function(err, user) {
                if (err)
                    return done(new Error(err));
                if (!user) {
                    req.flash('message', __('This login does not exist'));
                    return done(null, false);
                }
                if (!user.isActivated()) {
                    req.flash('message', __('Your user account is disabled'));
                    return done(null, false);
                }
                user.checkPassword(password, function(err, valid) {
                    if (err)
                        return done(new Error(err));
                    if (!valid) {
                        req.flash('message', __('Invalid password'));
                        return done(null, false);
                    }
                    else
                        return done(null, user);
                });
            });
        });
    }));


    // Passport registration strategy
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass the entire request to the callback
    },
    function(req, login, password, done) {
        if (!req.body.nickname) {
            req.flash('message', __('Pseudo must be set'));
            return done(null, false);
        }
        // execute at next loop
        process.nextTick(function() {
            // Find existing user
            db.User.findOne({where: {
                    or: [
                        {login: login},
                        {nickname: req.body.nickname}
                    ]
                }}, function(err, user) {
                if (err)
                    return done(new Error(err));
                // check if there's already a user with that email
                if (user) {
                    if (user.login === login) {
                        req.flash('message', __('This login already exists'));
                        return done(null, false);
                    }
                    else {
                        req.flash('message', __('This nickname already exists'));
                        return done(null, false);
                    }
                } else {
                    // there is no user with this login or nickname
                    // hash password & try to save the new user
                    var newUser = new db.User;
                    newUser.login = login;
                    newUser.password = password;
                    newUser.nickname = req.body.nickname;

                    // Try to validate user before hashing password
                    newUser.isValid(function(valid) {
                        if (valid) {
                            hashAndSave(newUser);
                        } else {
                            var message = "";
                            for (var i in newUser.errors) {
                                // Get only object own properties -> errors messages
                                if (newUser.errors.hasOwnProperty(i)) {
                                    message = newUser.errors[i]; // Get only one error message
                                    break;
                                }
                            }
                            req.flash('message', message);
                            return done(null, false);
                        }
                    });

                    function hashAndSave(newUser) {
                        newUser.hashPassword(password, function(err, hash) {
                            if (err)
                                return done(new Error(err));
                            newUser.password = hash;
                            // Find user group
                            db.Group.findOne({where: {authority: 1}}, function(err, userGroup) {
                                if (err)
                                    return done(new Error(err));
                                if (!userGroup) {
                                    var error = new Error(__("a group with authority=1 must be defined in configuration file"));
                                    error.status = 404;
                                    return done(error);
                                }
                                newUser.save(addUserToGroup(newUser, userGroup));
                            });
                        });
                    }

                    function addUserToGroup(newUser, userGroup) {
                        return function(err) {
                            if (err)
                                return done(new Error(err));

                            newUser.groups.add(userGroup, function(err) {
                                if (err)
                                    return done(new Error(err));
                                else
                                    return done(null, newUser);
                            });
                        };
                    }

                }
            });
        });
    }));




    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash()); // use connect-flash for flash messages stored in session
};
exports.passport = passport;
