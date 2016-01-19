var dbfun = require('./dbfun');
var wait= require('wait.for');


setTimeout(function(){
	wait.launchFiber(function(){//running async code in sync
		var orders = wait.for(dbfun.getUnProcessedOrders);
		for(var i=0;i<orders.length;i++){
			var customer = wait.for(dbfun.findCustomerById,orders[i].ordered_by);//find the customer who has given the order
			var curr_loc=[];//customers current location
			curr_loc.push(customer.current_lon);
			curr_loc.push(customer.current_lat);
			var possible_vendors= wait.for(dbfun.getVendorsFromLoc,curr_loc);		
		}

	});
},10000);
