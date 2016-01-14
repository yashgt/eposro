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

exports.saveProduct = function(product, cb){
	var pcollection = dbConn.collection('products');
	var idcollection=dbConn.collection('IDs');

	if(product._id===undefined)//read id from database
	{
        var query ={};
        var sort =[];
        var operator ={$inc:{"last_pdt_id":1}};
        var options ={new:true};
        idcollection.findAndModify(query,sort,operator,options,
        			function(err,doc){
        				if(!err)
        				{
        					id=doc.last_pdt_id;
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
			cb(null,result);
			}
		else{console.log(err);}
		});
}


exports.findCategoryId =function(cat,cb){
	var category = dbConn.collection('category');
	category.find({"name":cat}).toArray(function(err,result){
		if(!err){	
			var cids=[];
			for(var i=0;i<result.length;i++){
				cids.push(result[i]._id);
			}
			cb(null,cids);
		}
		else{
			console.log(err);
		}
	});
};

exports.findCityId = function(city,cb){
	var cities= dbConn.collection('cities');
	cities.findOne({"city":city.toLowerCase()},function(err,result){
		if(!err){
			cb(null,result._id);
		}
		else{
			console.log(err);
		}
	});
};

exports.getLastPdtId= function(cb){
	var IDs = dbConn.collection('IDs');
	IDs.findOne(function(err,res){
		if(!err){
			cb(null,res.last_pdt_id);
		}else{console.log(err);}
	});
};

exports.getProductVars = function(pname,brand,cb){
	var pcollection = dbConn.collection('products');
	pcollection.find({"pname":pname,"brand":brand}).toArray(function(err,result){
		if(!err){
			//build a pseudo product
			var vars=[];
			for(var i=0;i<result.length;i++){
				var product ={};
				product.vid = result[i]._id;
				product.vname = result[i].pname;
				product.facets =result[i].facets;
				vars.push(product);
			}
			cb(null,vars);
		}
		else{console.log(err);}
	});
};

exports.getRelatedPdts = function(last_pdt_id,cb){
	var pcollection = dbConn.collection('products');
	//generate random 2 products
	var rand = Math.floor(Math.random()*last_pdt_id),srand;
	var relPdts=[];
	pcollection.findOne({_id:rand},function(err,result){
		if(!err){
			if(result!=null){
			var pdt={};
			pdt.id=result._id;
			pdt.pname=result.pname;
			pdt.img=result.img;
			relPdts.push(pdt);
			}
			srand = Math.floor(Math.random()*last_pdt_id);
			pcollection.findOne({_id:srand},function(err,result){
			if(!err){
				if(result!=null){
					pdt={};
					pdt.id=result._id;
					pdt.pname=result.pname;
					pdt.img=result.img;
					relPdts.push(pdt);
					}
				cb(null,relPdts);
				}
				else{console.log(err);}
				});
		}else{console.log(err);}
	});
};

exports.writeLastPdtId = function(last_id,cb){
	var IDs = dbConn.collection('IDs');
	IDs.findOne(function(err,res){
		if(!err){
			IDs.update({_id:res._id},{ $set: { "last_pdt_id":last_id}},function(err,res){
				if(!err){
					cb(null,res);
				}
				else{console.log(err);}
			});
		}
		else{console.log(err);}
	});
};