'use strict';

/**
 * Module dependencies.
 */
 var trulo = require('../models/trulo.server.model');
var mongoose = require('mongoose'),
  _ = require('lodash');

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

exports.placeOrder = function(req,res){
	var userID = req.body.userID;
	console.log('Inside place order server controller' +userID);
	trulo.checkOut(userID,function (str) {
		 res.send(str);
	})
};
