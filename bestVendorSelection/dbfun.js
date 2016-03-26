var MongoClient = require('mongodb').MongoClient; // Driver for connecting to MongoDB
var ObjectID =require('mongodb').ObjectID;
var dbConn;

MongoClient.connect('mongodb://localhost:40000/eposro', function(err, db) {
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


exports.getPickUpVendors = function(loc,items,maxdist,cb){
   var vendors=dbConn.collection('vendors');
   vendors.aggregate([
   	{$geoNear:
   		{ near:{type:"Point",coordinates:loc}, 
   		  distanceField:"distance", 
   		  maxDistance:maxdist, 
   		  spherical:true
   		}
   	},
   	{$match:{"products.pid":{$all:items}}},
   	{$sort:{distance:1}}
   	],function(err,res){
   		if(!err){
   			cb(null,res);
   		}
   		else{
   			console.log(err);
   		}
   	});
};

exports.getHomeDelVen = function(loc,items,cb){
	var vendors = dbConn.collection('vendors');
	vendors.aggregate([
   	{$geoNear:
   		{ 
   			near:{type:"Point",coordinates:loc}, 
   		  	distanceField:"distance", 
   		  	maxDistance:3000,
   		  	query:{delivery_mode:1}, 
   		  	spherical:true
   		}
   	},
   	{$project:
   		{
   			_id:1,
   			name:1,
   			products:1,
   			delivery_mode:1,
   			address:1,
   			id:1,
   			distance:1,
   			"cmpval":{$cmp:['$distance','$serving_radius']}
   		}
   	},
   	{$match:{$and:[{"products.pid":{$all:items}},{"cmpval":-1}]}},
   	{$sort:{distance:1}},
   	],function(err,res){
   		if(!err){
   			cb(null,res);
   		}
   		else
   			{console.log(err);}
   	});


};