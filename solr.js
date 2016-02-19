var solr = require('solr-client');
var client = solr.createClient("127.0.0.1","9393","eposro");

exports.getProducts = function(pname,cb){
    
	var client = solr.createClient("127.0.0.1","9393","eposro");
	var query = client.createQuery()
				.q(pname)
				.dismax();
				
	client.search(query,function(err,obj){
		if(err) 
			console.log(err);
		else
			cb(obj.response.docs);
	});
};
