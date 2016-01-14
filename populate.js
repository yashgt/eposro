var epdb= require('./epdb');//file conatains all the database operations
var XLSX = require("xlsx");
var wait= require('wait.for');

setTimeout(function(){
	var excel_file = process.argv[2];//read the excel sheet from the commandline args
	var workbook =XLSX.readFile(excel_file);
	var worksheet,current_sheet, data;

	wait.launchFiber(function(){//running the async code in sync
		for(var i = 1;i<workbook.SheetNames.length;i++){//read each worsheet from workbook
			current_sheet = workbook.SheetNames[i];//current sheet name
    		worksheet=workbook.Sheets[current_sheet];

    		data=XLSX.utils.sheet_to_json(worksheet);//read entire data of the worksheet in json format

    		if(JSON.stringify(data)!='[]'){//if worsheet is not empty then get single product from each row
    			var keys = Object.keys(data[0]);//get all the column names of the worksheet
    		
    			//read all the facets like fat%, energy etc
    			var facets=[],j;
        		var facet_index=7;//assuming that facets starts from certain index
       	 		for(j=facet_index;keys[j].search("MRP")==-1;j++){//facets will be there till MRP of cities is not mentioned
            		facets.push(keys[j]);
        		}
        	
        		//find all the cities in which the product is sold
       			var mrp_index=j;//index at which price in each city starts
       			var cities = [];
        		for(var k=mrp_index;k<keys.length;k++){
            		cities.push(keys[k].substring(3,keys[k].length));//first three places contain MRP so neglect it.
        		}
        	
        		var cats=wait.for(epdb.findCategoryId,current_sheet);//categories to which product belongs
        		var last_pdt_id=wait.for(epdb.getLastPdtId);//last entered id in database

        		for(j=0;j<data.length;j++){
        			if(data[j]['_id']=='-'){
        				var product={};//build a single product
        				product['_id']=++last_pdt_id;
        				product.brand=data[j]['Brand'];
        				product.gtin = data[j]['GTIN'];
        				product.pname = data[j]['Title'];
        				product.desc = data[j]['Description'];
        				product.img = data[j]['Image_URL'];
        				product.cats = cats;
        			
        				product.facets={};
        				for(var k =facet_index;k<mrp_index;k++){
            				var temp=keys[k].replace(/" "/g,"_").toLowerCase();
            				if(data[j][keys[k]].match(/^[0-9]+.?[0-9]*$/)!=null){//it contains only number
                				if(data[j][keys[k]].match(/^[0-9]+$/)!=null)
                    				product.facets[temp]=parseInt(data[j][keys[k]].match(/^[0-9]+$/).toString());
                				else
                    				product.facets[temp]=parseFloat(data[j][keys[k]].match(/^[0-9]+.[0-9]+$/).toString());
            				}//end of if statement
            				else{
                				product.facets[temp]={};
                 				if(data[j][keys[k]].search(/\./)==-1)
                    				product.facets[temp]['val']=parseInt(data[j][keys[k]].match(/^[0-9]+/).toString());
                				else
                     				product.facets[temp]['val']=parseFloat(data[j][keys[k]].match(/^[0-9]+.[0-9]+/).toString());
   
                				product.facets[temp]['unit'] =data[j][keys[k]].match(/[a-zA-Z]+$/).toString();
            				}//end of else part
        				}//end of for loop of facets

        				product.price={};
        				product.price.default_mrp=data[j]['MRP'];
       					product.price.mrp=[];
        				temp=0;
        				for(var k= mrp_index;k<keys.length;k++){
                    		product.price.mrp[temp]={};
                    		product.price.mrp[temp].city=wait.for(epdb.findCityId,cities[temp]);
                    		product.price.mrp[temp].mrp=data[j]["MRP"+cities[temp]];
                    		temp++;
                		}//end of for loop for city mrp
                		product.vars=wait.for(epdb.getProductVars,product.pname,product.brand);
                		product.rel_pdts= wait.for(epdb.getRelatedPdts,last_pdt_id);//currently gets random products from DB
             
                		var result=wait.for(epdb.saveProduct,product);
                		//update the workbook with the added product
                		var address_of_cell ="A"+(j+2).toString();
                		workbook.Sheets[current_sheet][address_of_cell].v=(last_pdt_id-1)
                		console.log("Inserted product");
                	}//end of if statement for checking id
        		}//end of forloop for each product
        		var result=wait.for(epdb.writeLastPdtId,last_pdt_id);
    		}//end of if statement
		}//end of main for loop
	XLSX.writeFile(workbook, excel_file);//finally writing the workbook to excel
	});//end of wait-for loop 
},10000);//end of setTimeout function