'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), _ = require('lodash');
var trulo = require('../models/trulo.server.model');
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
 * List of categories
 */
exports.list = function (req, res) {
  //TODO obtain catID from req.params
  var catID = req.query.catID;
  trulo.getCategories(catID, function (cats) {
    res.json(cats);
  });
};