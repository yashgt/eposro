var trulo = require('./mean/modules/trulo/server/models/trulo.server.model');
var wait = require('wait.for');

setTimeout(function(){
	wait.launchFiber(function(){
		var companies= wait.for(trulo.getCompaniesNotAdded);
		for(var i=0;i<companies.length;i++){
			var company={};
			company.name=companies[i].name;
			company.gcp=companies[i].gcp;
			var flag= wait.for(trulo.checkIfExitsCompany,company);
			if(flag==false){
				company._id=wait.for(trulo.getUniqueCompanyId);
				var str=wait.for(trulo.addCompanyToDb,company);
				wait.for(trulo.setCompanyFlag,companies[i]._id);
				console.log(str);
			}
			else{
				wait.for(trulo.setCompanyFlag,companies[i]._id);
			}
		}

	});
},3000);