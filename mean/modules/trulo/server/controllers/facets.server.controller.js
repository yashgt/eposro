'use strict';

var solr = require('../models/solr.server.model');
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

exports.getBrands = function(req,res){
    //console.log("In facet controller getting brands");
    solr.getBrands(req.query.catID,req.query.level,function(response){
        res.send(response);
    });
};
exports.getFacets = function(req,res){
    console.log("In facet controller getting facets");
    solr.getFacets(req.query.catID,req.query.level,function(response){
        res.send(response);
    });
}