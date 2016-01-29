var dbfun = require('./dbfun');
var wait= require('wait.for');//aync modules


setTimeout(function(){
	wait.launchFiber(function(){//running async code in sync
		var orders = wait.for(dbfun.getUnProcessedOrders);
		for(var i=0;i<orders.length;i++){
			var customer = wait.for(dbfun.findCustomerById,orders[i].ordered_by);//find the customer who has given the order
			
			var curr_loc=[];//customers current location
			curr_loc.push(customer.current_lon);
			curr_loc.push(customer.current_lat);

			//use current location to find out vendors based on the mode
			var possible_vendors = wait.for(dbfun.getPossibleVen,curr_loc,orders[i].order_mode);
			//find vendor ids
			if(orders[i].order_mode==1){//if it is a home delivery
				for(var j=0;j<possible_vendors.length;j++){
					if(possible_vendors[j].dis>possible_vendors[j].serving_radius||possible_vendors[j].obj.delivery_mode!=1){
						possible_vendors.splice(j,1);
						continue;
					}
				}
			}
			//find vendors and products for the order
			var vids=[];
			var items=[];
			for(var j=0;j<possible_vendors.length;j++){
				vids.push(possible_vendors[j]['obj']['_id']);
			} 
			for(var j=0;j<orders[i].items.length;j++){
				items.push(orders[i].items[j].id);
			}
			
			//from the selected vendors find out the vendor who has all the products from order
			var final_vendor=wait.for(dbfun.findVenWithProd,vids,items);
			if(JSON.stringify(final_vendor)=='[]'){
				console.log("No vendor could be found out for the order");
				console.log(orders[i]);
				break;
			}
			for(var j=0;j<possible_vendors.length;j++){
				if(possible_vendors[j]['obj']['_id']=final_vendor[0]._id){
					console.log("The best vendor for order "+i+" is "+possible_vendors[j].obj.name+"  and he is "+Math.ceil(possible_vendors[j].dis)+" meters away\n");
					break;
				}
			}
		}

	});
},10000);
