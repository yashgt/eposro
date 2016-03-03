var cheerio = require('cheerio');
var _ = require('lodash');
var fs=require('fs');

fs = require('fs')
fs.readFile('../mongo/Product_Data/companies.html', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var count=0;
  $ = cheerio.load(data);
  $("body > table > tbody > .jmr").each( function(i,elt){ //Row
	var company = {};
	company._id=count;	
	$(this).children(".jmc").each( function(j, e){
		switch(j){
			case 0 : 	company.code = $(this).text(); break;
			case 1 :	company.location_num = $(this).text(); break;
			case 2 :	company.name = $(this).text(); break;
			case 3 :	
						$(this).find("table > tbody > tr > td > table > tbody > tr").each(function(k,c){
							var text = $(this).text();
							text = text.replace("\r","");
							text = text.replace("\n","");
							text = text.replace("\t","");
							text = _.trim(text);
							//console.log(text);
							if(_.startsWith(text,"Mail:")){
								company.email = text.replace("Mail:","") ;
							}
							
						
						}); break;
			default : a = 1;			
		}
	});
	count++;
	fs.appendFileSync('../mongo/companies.json','\n'+JSON.stringify(company),'utf-8');
  });
});