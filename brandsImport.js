var epdb=require('./epdb');
var fs=require('fs');
var wait= require('wait.for');

setTimeout(function(){
	var data = fs.readFileSync('.\\mongo\\Product_Data\\brands.txt');
	var x= data.toString();
	var i=0;
	wait.launchFiber(function(){
		while(x[i]!=undefined){
			while(x[i]==' '||x[i]=='\t')
			{
				i++;
			}
			var brand ="";
			var gln="";
			while(x[i]!='-'){
				brand+=x[i];
				i++;
			}
			brand=brand.slice(0,-1);
			i++;
			while(x[i]!='\n'&& x[i]!='\t'&& x[i]!=undefined)
			{
				gln+=x[i];
				i++;
			}
			wait.for(epdb.saveBrand,brand,parseInt(gln));
		}
	});
},3000);

