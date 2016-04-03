'use strict';
var solr = require('solr-client');
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
  var query = client.createQuery()  //  /select
.q(pname).dismax();
};
exports.getProductsByCategory = function (catID, cb) {
  var query = client.createQuery().q({ cats: catID });
  doSearch(client, query, cb);
};