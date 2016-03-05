'use strict';
var solr = require('solr-client');
/**
 * Module dependencies.
 */
var doSearch = function (client, query, cb) {
  client.search(query, function (err, obj) {
    if (err)
      console.log(err);
    else {
      console.log(obj.response.docs);
      cb(obj.response.docs);
    }
  });
};
exports.getProductsBySearchString = function (pname, cb) {
  var client = solr.createClient('127.0.0.1', '9393', 'eposro');
  var query = client.createQuery()  //  /select
.q(pname).dismax();
};
exports.getProductsByCategory = function (catID, cb) {
  var client = solr.createClient('127.0.0.1', '9393', 'eposro');
  var query = client.createQuery().q({ cats: catID });
  doSearch(client, query, cb);
};