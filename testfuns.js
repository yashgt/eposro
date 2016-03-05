var epdb=require('./epdb');
setTimeout(function(){
	epdb.addToCart(1,3,"goa",function(str){
		console.log(str);
	});
},3000);