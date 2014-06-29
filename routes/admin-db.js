/*
 *
 *   /admin/db
 * 
 */

var express = require('express');
var router = express.Router();
var app = require('../app');
var db = require('../models/db');


// Smoothly update database from schema.js (won't drop existing tables)
router.get('/update'/*, auth.adminRequired*/, function(req, res, next) {
    db.schema.isActual(function(err, actual) {
        if (err)
            return next(new Error(err));
        if (actual) {
            var error = new Error(__("Database schema is already up-to-date"));
            error.status = 404;
            return next(error);
        } else {
            db.schema.autoupdate();
            res.send(200);
        }
    });
});


// Recreate database from schema.js (means drop existing tables)
router.get('/migrate'/*, auth.adminRequired*/, function(req, res, next) {
    db.schema.isActual(function(err, actual) {
        if (err)
            return next(new Error(err));
        if (actual && !req.query.force) { // Migration can be forced using /migrate?force=true
            var error = new Error(__("Database schema is already up-to-date"));
            error.status = 404;
            return next(error);
        } else {
            db.schema.automigrate();
            res.send(200);
        }
    });
});


// Set default authentication handler
router.get('/set-authentication'/*, auth.adminRequired*/, function(req, res, next) {
    if (!global.mysql.authentication.groups) {
        var error = new Error(__("global.mysql.authentication.groups must be defined in configuration.js"));
        error.status = 404;
        return next(error);
    }
    if (!global.mysql.authentication.adminUser) {
        var error = new Error(__("global.mysql.authentication.adminUser must be defined in configuration.js"));
        error.status = 404;
        return next(error);
    }

    var groups = global.mysql.authentication.groups;
    db.Group.all(createIfNotExists);

    function createIfNotExists(err, results) {
        if (err)
            return next(new Error(err));

        var missingGroups = findMissing(groups, results);

        db.Group.create(missingGroups, createAdminUser);
    }

    function findMissing(groups, results) {
        return groups.reduce(function(ret, group, i) {
            for (var j = 0; j < results.length; j++) {
                if (results[i].name === group.name) {
                    return ret;
                }
            }
            ret.push(group);
            return ret;
        }, []);
    }

    function createAdminUser(err) {
        if (err)
            return next(new Error(err));
        var adminUser = db.User(global.mysql.authentication.adminUser);
        // Hash password
        adminUser.hashPassword(adminUser.password, function(err, hash) {
            if (err)
                return done(new Error(err));
            adminUser.password = hash;
            // Find admin group
            db.Group.findOne({where: {authority: 9}}, function(err, result) {
                if (err)
                    return next(new Error(err));

                if (!result) {
                    var error = new Error(__("a group with authority=9 must be defined in configuration file"));
                    error.status = 404;
                    return next(error);
                }
                // Save user then add him to admin group
                adminUser.save(addUserToGroup(adminUser, result));
            });
        });
    }

    function addUserToGroup(adminUser, result) {
        return function(err) {
            if (err)
                return next(new Error(err));

            adminUser.groups.add(result, userAddedToGroup);
        };
    }

    function userAddedToGroup(err) {
        if (err)
            return next(new Error(err));

        res.send(200);
    }
});




module.exports = router;