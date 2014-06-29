/*
 *
 *   /
 * 
 */ 

var express = require('express');
var router = express.Router();
var db = require('../models/db');
var auth = require('../libs/auth');





/* Specific PUBLIC routes */

// index
router.get('/', function(req, res) {
    res.render('index', {
        title: __('Home')
    });
});





/* Common PUBLIC routes */

// Set language from user choice (using cookie)
router.get('/set-language/:loc', function(req, res) {
    var supportedLanguages = global.i18n.supportedLanguages || ['en'];
    if (supportedLanguages.indexOf(req.params.loc) !== -1)
        res.cookie(global.i18n.cookieName || 'locale', req.params.loc);
    res.redirect('back'); // Redirect to Referer if set in request Headers else redirect to '/'
});

// Connection handler
router.get('/login', function(req, res) {
    res.render('login', {
        title: __('Login Form'),
        message: req.flash('message')
    });
}).post('/login', function(req, res, next) {
    auth.passport.authenticate('local-login', function(err, user, info) {
        if (err)
            return next(err);
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err)
                return next(err);
            req.flash('message', 'Successfuly logged in');
            return res.redirect('back');
        });
    })(req, res, next);
});

// Registration handler
router.get('/signup', function(req, res) {
    res.render('signup', {
        title: __('Signup Form'),
        message: req.flash('message')
    });
}).post('/signup', function(req, res, next) {
    auth.passport.authenticate('local-signup', function(err, user, info) {
        if (err)
            return next(err);
        if (!user) {
            return res.redirect('/signup');
        }
        req.logIn(user, function(err) {
            if (err)
                return next(err);
            req.flash('message', __('Successfuly registered & logged in'));
            return res.redirect('back');
        });
    })(req, res, next);
});

// Disconnection handler
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('back');
});







module.exports = router;