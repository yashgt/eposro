var trulo = require('./modules/trulo/server/models/trulo.server.model.js');
var wait =require('wait.for');

setTimeout(function(){
	var current_date= new Date()
	var compare_date=new Date();

	compare_date.setDate(current_date.getDate()-30);
	
	//get month, year and day and concatenate
	var day=''+current_date.getDate();
	var month=''+(current_date.getMonth()+1);
	var year=current_date.getFullYear();
	if(day.length<2){
		day="0"+day;
	}
	if(month.length<2){
		month="0"+month;
	}
	current_date=year+"-"+month+"-"+day;

	day=''+compare_date.getDate();
	month=''+(compare_date.getMonth()+1);//add 1 to date
	year=compare_date.getFullYear();
	if(day.length<2){
		day="0"+day;
	}
	if(month.length<2){
		month="0"+month;
	}
	compare_date=year+"-"+month+"-"+day;
	trulo.computeRFM(current_date,compare_date,function(){
		console.log("RFM SCORE OF ALL THE USERS COMPUTED");
	});
},3000);