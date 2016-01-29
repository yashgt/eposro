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
	orders.find({processing_status:0}).toArray(function(err,res){
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

exports.findVenWithProd=function(vids,items,cb){
	var vendors = dbConn.collection("vendors");
		vendors.find({_id:{$in:vids},"products.pid":{$all:items}}).toArray(function(err,res){
		if(!err){
			cb(null,res);
		}
		else{
			console.log(err);
		}
		});
	
}

exports.getPossibleVen = function(loc,mode,cb){
	var vendors = dbConn.collection('vendors');

	vendors.ensureIndex({"address.location":"2dsphere"},function(err,res){
		if(!err){
			var dist;
		if(mode==0){//search within 700 meters distance
			dist=500;
		}
		else{
			dist=1500;
		}
		dbConn.command(
			{
				geoNear:"vendors",
				near:{type:"Point",coordinates:loc},
				maxDistance:700,
				minDistance:0,
				spherical:true
			}
			,function(err,res){
			if(!err){
				cb(null,res.results);
			}
		});

		}
		else{
			console.log(err);
		}
	});
};