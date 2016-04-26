var epdb=require('./mean/modules/trulo/server/models/trulo.server.model');
setTimeout(function(){
	epdb.removeFromStock(7,1,function(res){
		console.log(res);
	});
},3000);