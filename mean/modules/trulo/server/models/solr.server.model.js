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
        var product = [];
        for(var i = 0; i < obj.response.docs.length; i++ ){
            product.push({
                pname : obj.response.docs[i].pname,
                _id : obj.response.docs[i]._id,
                frontImg : obj.response.docs[i]["img.front"],
                default_mrp : obj.response.docs[i].default_mrp
            }) 
        }
        //console.log(product)
        cb(product);
    }
  });
};
exports.getProductsBySearchString = function (pname, lastPage, cb) {
    var query = client.createQuery().q(pname).dismax().start(4*lastPage).rows(4);
    doSearch(client, query, cb);
};

exports.getProductsByCategory = function (catID, lastPage, level, brand, cb) {
    console.log("In solr.server.model catid = "+catID);
  
    console.log("Filtering for brand "+brand.length);
    
    if( level == 0){
        var query = client.createQuery()
                    .q({ 'cats.0': catID })
                    .start(4*lastPage)
                    .rows(4);
        //for(var i = 0; i < brand.length; i++)
        if( brand == '*')
            query.matchFilter('brand',brand);
        else{
            var fq = '';
            fq = brand.join(' OR ');  
            console.log("fq = "+fq);
            query.matchFilter('brand',fq);
        }
    }
    else if( level == 1){
        var query = client.createQuery()
                    .q({ 'cats.1': catID })
                    .start(4*lastPage)
                    .rows(4);
    }
    else if( level == 2){
        var query = client.createQuery()
                    .q({ 'cats.2': catID })
                    .start(4*lastPage)
                    .rows(4);
    }
    console.log(query);
    //start()  : number of leading documents to skip
    //rows() : number of documents to return after start
    doSearch(client, query, cb);
};
exports.getBrands = function(catID, level, cb){
    
    console.log("Searching brands for "+catID);
    if( level == 0){
        console.log("Searching cats.0 for "+catID);
        var query = client.createQuery().q({ 'cats.0': catID }).facet({'field':'brand','mincount':1});
    }
    else if( level == 1){
        console.log("Searching cats.1 for "+catID);
        var query = client.createQuery().q({ 'cats.1': catID }).facet({'field':'brand','mincount':1});
    }
    else if( level == 2){
        console.log("Searching cats.2 for "+catID);
        var query = client.createQuery().q({ 'cats.2': catID }).facet({'field':'brand','mincount':1});
    }
    
    client.search(query, function (err, obj) {
        if (err)
          console.log(err);
        else {
          //console.log(obj.facet_counts.facet_fields.brand);
            var result = obj.facet_counts.facet_fields.brand;
            var brands = [];
            for(var i = 0; i < result.length; i=i+2){
                brands.push({title:result[i],count:result[i+1]});
            }
          cb(brands);
        }
    });
}
exports.getFacets = function(catID, level, cb){
    var query = client.createQuery().q({ 'cats.1': catID }).q({'cats.1':catID}).fl('facets*');
    doSearch(client, query, cb);
}