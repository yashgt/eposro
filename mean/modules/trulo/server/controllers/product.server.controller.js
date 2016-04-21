'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), _ = require('lodash');
var trulo = require('../models/trulo.server.model');
var solr = require('../models/solr.server.model');
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
 * List of products of a given category
 */
//TODO
exports.list = function (req, res) {
};
exports.search = function (req, res) {
};
exports.getProducts = function (req, res) {
    console.log("Inside products.server.controller to fetch products of catID="+req.query.catID);
    var catID = req.query.catID;
    var lastPage = req.query.lastPage;
    solr.getProductsByCategory(catID, lastPage, function(productsResponse){
        res.send(productsResponse);
    });
};
exports.searchProduct = function(req, res){
    var pname = req.query.name;
    solr.getProductsBySearchString(pname, function(response){
        
    });
}
exports.getProductDetails = function(req,res){
    var id = parseInt(req.query.id);
    trulo.getProductDetails(id,function(product){
        res.json(product);
    });
}