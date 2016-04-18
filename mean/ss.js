var webpage = require('webpage');
var page = webpage.create();

amazon = require('amazon-product-api');
var querystring = require('querystring');
var http = require('http');

var client = amazon.createClient({
});

console.log('Hello, world!');


page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onResourceRequested = function(requestData, networkRequest) {
  //console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
};

var startComp = "12180"; //"13970" ;
var compName = "";
var compCode = "";

page.onLoadFinished = function(){
    //console.log("Load finished");
    //var script1 = "function(){ currComp='" + currComp + "'}";
    //page.evaluateJavaScript(script1);
  
    page.includeJs(
    // Include the https version, you can change this to http if you like.
    'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js',
    function() {
        if(page.injectJs('do.js')){
            var pdts = page.evaluate(function(){return getProducts();});
            //console.log(JSON.stringify(pdts));
            
            var pdtCnt = pdts.products.length ;
            pdts.products.forEach(function(product){
                var pdtPage = webpage.create();
                pdtPage.open('http://www.gs1india.org.in/ProductRange/ProductDetail.aspx?ComapnyId='+ product.compId+'&gtin='+product.gtin);
                pdtPage.onConsoleMessage = function(msg) {
                    console.log(msg);
                };

                pdtPage.onLoadFinished = function(){
                    pdtPage.includeJs(
                        // Include the https version, you can change this to http if you like.
                        'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js',
                        function() {
                            if(pdtPage.injectJs('do.js')){
                                var pdtDet = pdtPage.evaluate(function(){
                                    return getProductDetail();
                                });
                                for (var key in pdtDet) { product[key] = pdtDet[key]; }
                                
                                //Fetch from datakart
                                /*
                                $.ajax({
        url: "http://rest-service.guides.spring.io/greeting"
    }).then(function(data) {
       $('.greeting-id').append(data.id);
       $('.greeting-content').append(data.content);
    });
                                */
                                
                                //Fetch from Amazon
                                
                                //TODO print as CSV
                                console.log(JSON.stringify(product));
                                //console.log(product.compId+","+product.compCode+","+product.compName+","+product.gtin+","+product.pdtName+","+product.ht);
                                pdtPage.close();    
                            }
                        });
                };
            });
            if(pdts.currComp=="00"){
                page.evaluateJavaScript("function(){ return gotoComp("+startComp+");}");
            }
            else if(pdts.isLastPg == false){
                page.evaluate(function(){return gotoNextPage();});
            }
            else{
                page.evaluateJavaScript("function(){return gotoNextComp("+pdts.currComp+");}");
            }
        }
    });
};

page.open('http://gs1india.org.in/ProductRange/ProductRange.aspx', function(status) {
  console.log("Status: " + status);
  if(status === "success") {

   
  }
});    
