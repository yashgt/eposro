var MongoClient = require('mongodb').MongoClient; // Driver for connecting to MongoDB
var ObjectID =require('mongodb').ObjectID;
var dbConn;
MongoClient.connect('mongodb://localhost:30000/eposroDB', function(err, db) {
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
        var query ={};
        var sort =[];
        var operator ={$inc:{"last_entry_id":1}};
        var options ={new:true};
        idcollection.findAndModify(query,sort,operator,options,
        			function(err,doc){
        				if(!err)
        				{
        					id=doc.last_entry_id;
							product._id=id;
							insert_product_internal(pcollection,product,cb);
        					
        				}
        				else
        				{
        					console.log(err);
        				}
        			});
	}
	else//directly insert the product
	{
		insert_product_internal(pcollection,product,cb);
	}
};

function insert_product_internal(collection,product,cb){
	collection.insert(product,function(err,result){
		if(!err){				
			cb(result);
			}
		else{console.log(err);}
		});
}
