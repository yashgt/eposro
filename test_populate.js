var epdb = require('epdb');

var cnt = 1000;


setTimeout(function() {
	for(i=0; i <= cnt ; i++){
		var p = { //TODO team to fill the object
			
		};
		epdb.addProduct(p, function(pdt){
			console.log("Added %j", pdt);
		});
	}
}, 5000); //Wait for 5 sec for connection to be established with DB




