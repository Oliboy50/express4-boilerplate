/*
 *
 *   /admin
 * 
 */ 

var express = require('express');
var router = express.Router();
var app = require('../app');
var auth = require('../libs/auth');
var db = require('../models/db');


// admin index
router.get('/', auth.adminRequired, function(req, res) {
    res.render('index', {
        title: __('Admin Home')
    });
});


module.exports = router;