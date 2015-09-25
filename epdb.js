var MongoClient = require('mongodb').MongoClient; // Driver for connecting to MongoDB
var ObjectID =require('mongodb').ObjectID;
var dbConn;
MongoClient.connect('mongodb://localhost:27017/eposroDB', function(err, db) {
	if(!err){
		dbConn = db;
		console.log("Connected Successfully");
	}
});  

exports.addProduct = function(product, cb){
	var collection = dbConn.collection('products');
	collection.insert(product, function(err,result){
		if(!err){
			cb(result);
		}
		else
		{
			console.log(err);
		}
	})
};

exports.getLastID= function(cb){
	var collection=dbConn.collection('IDs');
	collection.findOne(function(err,doc){
		if(!err)
		{
		 	return cb(doc);
		}
	})
};

exports.updateID=function(count,docs,cb){
	var collection=dbConn.collection('IDs');
	collection.update(
		{_id: new ObjectID(docs._id)},
	 	{"$set":{last_entry_id: count}},
        function (err, nupdate){if (!err) {cb(nupdate);dbConn.close();}}
        );
};

