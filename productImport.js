var trulo = require('./mean/modules/trulo/server/models/trulo.server.model');
var wait = require('wait.for');
var wget = require('wget-improved');

setTimeout(function() {
    wait.launchFiber(function() {
        var products = wait.for(trulo.getProductsNotAdded);
        for (var i = 0; i < products.length; i++) {
            var product = {};
            //console.log(products[i]);
            product._id= wait.for(trulo.getUniquePdtId);
            product.gtin = products[i].gtin;
            product.pname = products[i].name;
            product.brand = products[i].brand;
            product.desc = products[i].description;
            product.company_id = wait.for(trulo.getCompanyId, products[i].company_detail.gcp, products[i].company_detail.name);
            console.log(product.company_id);
            product.img = wait.for(download_imgs, products[i].images, product._id);
            product.cats=[];
            product.cats.push(wait.for(trulo.findCategoryId,products[i].category)[0]);
            product.cats.push(wait.for(trulo.findCategoryId,products[i].sub_category)[0]);
            product.price={};
            product.price.default_mrp=products[i].mrp_info[0].mrp;
            product.price.mrp=[];
            product.price.mrp.push({"city":4,"mrp":product.price.default_mrp});
            product.facets=[];
            if(products[i].attributes.nutritional_information!=undefined){
            	var energy=products[i].attributes.nutritional_information.energy;
            	if(energy.length!=0){
            		energy=energy.substring(0,energy.length-5);
            		var facet={};
            		energy=parseFloat(energy);
            		if(energy<250){
            			facet.energy="0%-25%";
            		}
            		else if(energy<500){
            			facet.energy="25%-50%";
            		}
            		else if(energy<750){
            			facet.energy="50%-75%";
            		}
            		else{
            			facet.energy="75%-100%"
            		}
            		product.facets.push(facet);
            	}
            	var cholesterol=products[i].attributes.nutritional_information.cholesterol;
            	if(cholesterol!=undefined && cholesterol.length!=0){
            		cholesterol=parseFloat(cholesterol.substring(0,cholesterol.length-3));
            		var facet={};
            		if(cholesterol<25){
            			facet.cholesterol="0%-25%";
            		}
            		else if(cholesterol<50){
            			facet.cholesterol="25%-50%";
            		}
            		else if(cholesterol<75){
            			facet.cholesterol="50%-75%";
            		}
            		else{
            			facet.cholesterol="75%-100%";
            		}
            		product.facets.push(facet);
            	}
            	var fats =products[i].attributes.nutritional_information.total_fat.value;
            	if(fats!=undefined){
            		fats=parseFloat(fats.substring(0,fats.length-2));
            		var facet={};
            		if(fats<25){
            			facet.fat="0%-25%";
            		}
            		else if(fats<50){
            			facet.fat="25%-50%";
            		}
            		else if(fats<75){
            			facet.fat="50%-75%";
            		}
            		else{
            			facet.fat="75%-100%";
            		}
            		product.facets.push(facet);
            	}
            }

            var str=wait.for(trulo.saveProduct,product);
            console.log(str);
            wait.for(trulo.setProductFlag,products[i]._id);
        }
    });
}, 3000);

function download_imgs(images, id, cb) {
    var types = Object.keys(images);
    var output_images ={};
    var options = {};
    var directory="./mean/public/img/";
    var count=0;
    for (var j = 0; j < types.length; j++) {
        var src = images[types[j]];
        var output = id + "_" + types[j] + ".jpg";
        if (src.length == 0) {
            output_images[types[j]]="";
            count++;
        } 
        else 
        {
            var download = wget.download(src,directory+output, options);
            output_images[types[j]]=output;
            download.on('start',function(size){
            	console.log("downloading image for product id = "+id);
            });
            download.on('end', function(out) {
               count++;
               console.log("Downloaded image for product Id = "+id);
               if(count>=types.length){
               	cb(null,output_images);
               }
            });
        }
    }


}