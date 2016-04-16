'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    mobilenumField: 'mobileNumber',
    passwordField: 'password'
  },
  function (mobile, password, done) {
    User.findOne({
      mobileNumber: mobile
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid mobile number or password'
        });
      }
      console.log(user);
      return done(null, user);
    });
  }));
};
