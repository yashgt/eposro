//console.log('Hello, world!');

var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onResourceRequested = function(requestData, networkRequest) {
  //console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
};

var currComp = "12180"; //"13970" ;
var compName = "";
var compCode = "";


page.onLoadFinished = function(){
    //console.log("Load finished");
    var script1 = "function(){ currComp='" + currComp + "'}";
    page.evaluateJavaScript(script1);
  
    page.includeJs(
    // Include the https version, you can change this to http if you like.
    'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js',
    function() {
        page.evaluate(function() { //This is sync
                var codeSep = " - ";
                //determine the currComp
                var currOpt;

                //console.log("Dropdown value is " + $('#drpcompanyWise').val());
                currComp = ($('#drpcompanyWise').val() == "00") ? currComp : $('#drpcompanyWise').val() ;
                    
                currOpt = $('#drpcompanyWise option[value="' + currComp + '"]');                    

                //currComp = currOpt.val();
                optText = currOpt.text();
                var c = optText.split(codeSep) ; 
                
                compCode = c[c.length-1];
                compName = unescape(optText.replace(" - " + compCode, ""));
                    
                
                var tbl = $("#grvGepirReport tr");
                var rowNum = "";
                var isLastPg = true;
                if(tbl.length !=0){
                    isLastPg = false;
                    $.each(tbl,function (i, row) {
                        if(i!=0){
                            rowNum = row.cells[0].innerText;
                            var gtin = row.cells[1].innerText;
                            var pdtName = row.cells[3].innerText;
                            console.log(currComp+","+compCode+","+compName+","+gtin+","+pdtName);
                        }
                    });
                    var totCnt = $("#lblTotNo").text();
                    //console.log("Total products: " + totCnt + " Last row:" + rowNum);                    
                    if(totCnt===rowNum)
                        isLastPg = true;
                }
                
                
                if( !isLastPg ){
                    //console.log("Next page");
                    $('#btnnext').click();                    
                }
                else {
                    //console.log('Title: ' + document.title);
                    var $comp = $('#drpcompanyWise');
                    currOpt = currOpt.next();
                    currComp = currOpt.val();
                    compName = unescape(currOpt.text().split(codeSep)[0]);
                    compCode = currOpt.text().split(codeSep)[1];
                    //console.log("Current company is " + compName + " with value " + currComp + " and code "+ compCode);                    
                    
                    $comp.val(currComp);
                    $('#btnsearch').click();  
                }
                //return currComp;
        });
        //console.log("Curr Comp is now " + currComp);
    });
 

};
    
page.open('http://gs1india.org.in/ProductRange/ProductRange.aspx', function(status) {
  console.log("Status: " + status);
  if(status === "success") {

   
  }
});
