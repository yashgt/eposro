var MongoClient = require('mongodb').MongoClient; // Driver for connecting to MongoDB
var ObjectID =require('mongodb').ObjectID;
var dbConn;

MongoClient.connect('mongodb://localhost:27017/eposro', function(err, db) {
	if(!err){
		dbConn = db;
		console.log("Connected Successfully");
	}
    else{
        console.log(err);        
    }
});  

exports.getUnProcessedOrders = function(cb){//finds all the orders that are yet to be processed
	var orders = dbConn.collection('orders');
	orders.find({processing_status:"not processed"}).toArray(function(err,res){
		if(!err){
			cb(null,res);
		}
		else{console.log(err);}
	});
};

exports.findCustomerById=function(cid,cb){
	var users = dbConn.collection('users');
    users.findOne({_id:cid},function(err,res){
    	if(!err){
    		cb(null,res);
    	}
    	else{console.log(err);}
    });
};

exports.getVendorsFromLoc=function(loc,cb){
	var vendors = dbConn.collection('vendors');
	vendors.findOne(
		{
			address:
			{
				$near:
				{
					$geometry:
					{
						type:"Point",
						coordinates:loc
					},
					spherical: true,
					$minDistance:0,
					$maxDistance:500
				}
			}
		},
		function(err,result){
		   	if(!err){
		   		cb(null,result);
		   		result.forEach(function(doc){
		   	       console.log(doc._id);//giving mongo error
		   		});
		   	}
		   	else{console.log(err)}
		   }
	);

};
