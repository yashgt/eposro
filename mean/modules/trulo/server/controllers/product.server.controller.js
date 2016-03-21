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
 * List of products of a given category
 */
//TODO
exports.list = function (req, res) {
};
exports.search = function (req, res) {
};
exports.getProducts = function (req, res) {
    console.log("Inside products.server.controller to fetch products of catID="+req.query.catID);
  var cat = req.query.catID;
  var page = req.query.lastPage;
  //TODO fetch products from solr
  var products = [];
  for (var j = 1; j < 6; j++) {
    var pdt = {
      _id: j.toString(),
      name: 'Product' + j,
      catID: cat,
        mrp: 20
    };
    products.push(pdt);
  }
    res.send(products);
};
exports.getProductDetails = function(req,res){
    var id = parseInt(req.query.id);
    trulo.getProductDetails(id,function(product){
        res.json(product);
    });
}