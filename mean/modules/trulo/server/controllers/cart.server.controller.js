'use strict';
var trulo = require('../models/trulo.server.model');
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');
//var trulo = require('../../client/services/trulo.client.service.js');
/**
 * Create a
 */
exports.create = function(req, res) {};
/**
 * Show the current
 */
exports.read = function(req, res) {};
/**
 * Update a
 */
exports.update = function(req, res) {};
/**
 * Delete an
 */
exports.delete = function(req, res) {};
/**
 * List of
 */
exports.list = function(req, res) {};
exports.addToCart = function(req, res) {

    if (req.user != null) {
        var pdtID = parseInt(req.body.pdtID);
        var userID = parseInt(req.user._id);
        var city = req.body.city;
        //set session variable with city
        //req.session.city = city;//somehwhat like this?
        trulo.addToCart(userID, pdtID, city, function(str) {
            res.send(str);
        });
    } else {
        res.send('null');
    }
};
exports.removeFromCart = function(req, res) {
    if (req.user != null) {
        var pdtID = parseInt(req.body.pdtID);
        var userID =parseInt(req.user._id);
        var city = req.body.city;
        trulo.removeFromCart(userID, pdtID, function(str) {
            res.send(str);
        });
    } else {
        res.send('null');
    }

};
exports.fetchCart = function(req, res) {
    if (req.user != null) {
        var userID = parseInt(req.user._id);
        trulo.fetchCart(userID, function(cart) {
            console.log("Sending res = " + cart);
            if (cart == null)
                res.send('null');
            else
                res.send(cart);
        });
    } else {
        res.send('null');
    }
};

exports.removeProductDirectly = function(req, res) {
    if (req.user != null) {
        var pdtID = parseInt(req.body.pdtID);
        var userID = parseInt(req.user._id);
        var city = req.body.city;
        trulo.removeProductDirectly(userID, pdtID, function(str) {
            res.send(str);
        });
    }
    else{
        res.send('null');
    }
}