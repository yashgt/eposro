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
    var catID = req.query.catID;
    var lastPage = req.query.lastPage;
    var level = req.query.level;
    var brand = req.query.brand;
    if( brand != '*')
       brand = brand.split(',');
    
    console.log(req.query);
    console.log("On server Brand arrays is..");
    console.log(brand);
    console.log(typeof(brand))
    //console.log("Inside products.server.controller to fetch products of catID="+req.query.catID+" level = "+level+" brand="+brand);
    
    solr.getProductsByCategory(catID, lastPage, level, brand, function(productsResponse){
        //console.log("Image "+productsResponse[0].pname);
        res.send(productsResponse);
    });
};
exports.searchProduct = function(req, res){
    var pname = req.query.name;
    var lastPage = req.query.page;
    console.log("On server searching for "+pname);
    solr.getProductsBySearchString(pname, lastPage, function(response){
        console.log("Received response in product.server.controller");
        res.send(response);
    });
}
exports.getProductDetails = function(req,res){
    var id = parseInt(req.query.id);
    trulo.getProductDetails(id,function(product){
        res.json(product);
    });
}