var dbfun = require('./dbfun');
var wait= require('wait.for');//aync modules


setTimeout(function(){
	wait.launchFiber(function(){//running async code in sync
		var orders = wait.for(dbfun.getUnProcessedOrders);
		for(var i=0;i<orders.length;i++){
			var customer = wait.for(dbfun.findCustomerById,orders[i].ordered_by);//find the customer who has given the order
			
			//find customers current location
			var curr_loc=[];
			curr_loc.push(customer.current_lon);
			curr_loc.push(customer.current_lat);

			//find items in the order
			var items=[];
			for(var j=0;j<orders[i].items.length;j++){
				items.push(orders[i].items[j].id);
			}
			
			//get users max walk distance
			var max_walk_dist=customer.max_walk_dist;

			var final_vendors=[];
			if(orders[i].order_mode==0){
				final_vendors=wait.for(dbfun.getPickUpVendors,curr_loc,items,max_walk_dist);
				if(JSON.stringify(final_vendors)!='[]'){
				console.log("\n\nThe Pick Up order "+i+" can be picked up from following vendors ");
				for(var j=0;j<final_vendors.length;j++){
					console.log(final_vendors[j].name+" distance = "+Math.ceil(final_vendors[j].distance));
				}
				}
				else{
					console.log("\n\norder "+i+" cannot be serviced");
				}
			}
			else{
				final_vendors=wait.for(dbfun.getHomeDelVen,curr_loc,items);
				if(JSON.stringify(final_vendors)!='[]'){
				console.log("\n\nThe Home delivery order "+i+" will be served by follwing vendor ");
				console.log(final_vendors[0].name+" distance = "+Math.ceil(final_vendors[0].distance));
				}
				else{
					console.log("\n\norder "+i+" cannot be serviced");
				}
			}
		}

	});
},10000);


//