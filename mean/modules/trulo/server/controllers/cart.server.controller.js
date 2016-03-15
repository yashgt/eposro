'use strict';
var trulo = require('../models/trulo.server.model');
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), _ = require('lodash');
//var trulo = require('../../client/services/trulo.client.service.js');
/**
 * Create a 
 */
exports.create = function (req, res) {
};
/**
 * Show the current 
 */
exports.read = function (req, res) {
};
/**
 * Update a 
 */
exports.update = function (req, res) {
};
/**
 * Delete an 
 */
exports.delete = function (req, res) {
};
/**
 * List of 
 */
exports.list = function (req, res) {
};
exports.addToCart = function (req, res) {
  var pdtID = parseInt(req.body.pdtID);
  var userID = req.body.userID;
  var city = req.body.city;
  //set session variable with city
  //req.session.city = city;//somehwhat like this?
  trulo.addToCart(userID, pdtID, city, function (str) {
    res.send(str);
  });
};
exports.removeFromCart = function (req, res) {
  var pdtID = parseInt(req.body.pdtID);
  var userID = req.body.userID;
  var city = req.body.city;
  trulo.removeFromCart(userID, pdtID, function (str) {
    res.send(str);
  });
};
exports.fetchCart = function (req, res) {
  var userID = req.body.userID;
  trulo.fetchCart(userID, function (cart) {
      console.log("Sending res = "+cart);
      if( cart == null)
          res.send('null');
      else
          res.send(cart);
  });
};