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
exports.create = function(req, res) {

};

/**
 * Show the current
 */
exports.read = function(req, res) {

};

/**
 * Update a
 */
exports.update = function(req, res) {

};

/**
 * Delete an
 */
exports.delete = function(req, res) {

};

/**
 * List of
 */
exports.list = function(req, res) {

};

exports.getRecommendations = function(req, res) {
    if (req.user != null) {
        var userID = parseInt(req.user._id);
        console.log('Inside Get Recommendations' + userID);
        trulo.getClusterRecommendations(function(res) {
            res.send(res);
        });
    } else {
        console.log('Inside Get Recommendations without logged in');
        trulo.getUserRecommendations(function(res) {
            res.send(res);
        });

    }
}