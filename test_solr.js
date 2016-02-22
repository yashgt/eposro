var solr=require('./solr');
solr.getProducts('vannila cone',function(documents){
	console.log(documents);
});