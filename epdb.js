var MongoClient = require('mongodb').MongoClient; // Driver for connecting to MongoDB
var ObjectID =require('mongodb').ObjectID;
var dbConn;
MongoClient.connect('mongodb://localhost:27017/eposroDB', function(err, db) {
	if(!err){
		dbConn = db;
		console.log("Connected Successfully");
	}
});  

exports.saveProduct = function(product, cb){
	var pcollection = dbConn.collection('products');
	var idcollection=dbConn.collection('IDs');

	if(product._id===undefined)//read id from database
	{
		idcollection.findOne(function(err,doc){
			if(!err)
			{
				id=doc.last_entry_id+1;
				product._id=id;
				console.log(id);
				pcollection.insert(product,function(err,result){
					if(!err){
						console.log("Hello");
						cb(result);
					}
					else{console.log("You are duffer");}
				});
				idcollection.update(
							{_id: new ObjectID(doc._id)},
	 						{"$set":{last_entry_id: id}},
	 						function (err, nupdate){if (!err) {console.log("updated");}}	
							);
			}
		});
	}
	else//directly insert the product
	{
		collection.insert(product, function(err,result){
		if(!err){cb(result);}
		else{console.log(err);}
		});

	}
};

exports.closeConnection=function()
{
	dbConn.close();
}