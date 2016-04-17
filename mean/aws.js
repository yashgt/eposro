amazon = require('amazon-product-api');
var querystring = require('querystring');
var http = require('http');

var client = amazon.createClient({
  //awsId: "AKIAIBQR5J5HERZBV6NQ",  awsSecret: "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"
  awsId: "AKIAJ6JDU7Q7Q3MNCE7A", awsSecret: "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" //Team Trulo
});

var lookup = function(code){
client.itemLookup({
  idType: 'EAN',
  itemId: code 
  ,includeReviewsSummary: false
  ,rensponseGroup: "EditorialReview,ItemAttributes,Images"
  ,truncateReviewsAt:1
}).then(function(results) {
  console.log(JSON.stringify(results));
}).catch(function(err) {
  console.log(JSON.stringify(err));
});
};

var codes = [ '8901180100042', '8901860630616', '8903896011711', '8906046410006','8906046410037' ];

codes.forEach( lookup );



