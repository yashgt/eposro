'use strict';
var solr = require('solr-client');
var path = require('path');
var config = require(path.resolve('./config/config'));;
var client = solr.createClient(config.solr.uri,config.solr.port,config.solr.core);

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
  var query = client.createQuery().q(pname).dismax();
};

exports.getProductsByCategory = function (catID, lastPage, cb) {
    
    var query = client.createQuery().q({ 'cats.0': catID }).start(4*lastPage).rows(4);
    //start()  : number of leading documents to skip
    //rows() : number of documents to return after start
    doSearch(client, query, cb);
};