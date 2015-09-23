var MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB
var dbConn;
MongoClient.connect('mongodb://localhost:27017/eposrodb', function(err, db) {
	if(!err){
		dbConn = db;
	}
	
});  

exports.addProduct = function(product, cb){
	var collection = dbConn.collection('products');
	collection.insert(product, function(err,result){
		if(!err){
			cb(result);
		}
	})
};

