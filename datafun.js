var MongoClient = require('mongodb').MongoClient; // Driver for connecting to MongoDB
var ObjectID =require('mongodb').ObjectID;
var dbconn ; //DB object
MongoClient.connect('mongodb://localhost:40000/eposro', function(err, db){
	dbconn = db;
});


//Take this to epdb.
exports.getCategories= function(id,cb){
	MongoClient.connect('mongodb://localhost:40000/eposro', function(err, db) {
	if(!err){
		console.log("Connected Successfully");
		//console.log('id :'+id);
		var category = db.collection("category");
		category.find({parent_id:parseInt(id)}).toArray(function(err,res){
			if(!err){
				//console.log(res);
				var cats=[];
				//console.log(res);
				for(var i=0;i<res.length;i++){
					var cat={
						id: res[i]._id,
						title: res[i].name
					};
					cats.push(cat);
				}
				//console.log(cats);
				db.close();
				cb(cats);
			}
			else{
				console.log(err);
			}
		});
	}
    else{
        console.log(err);        
    }
});  
};
