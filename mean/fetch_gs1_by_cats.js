//http://www.gs1india.org.in/ComapnyByPCategory/ComapnyByProductCat.aspx

var webpage = require('webpage');
var page = webpage.create();

console.log('Hello, world!');


page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onResourceRequested = function(requestData, networkRequest) {
  //console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
};

function checkDone(ch, cb) {
    //console.log("Checking");
    if(!ch()) {//we want it to match
        setTimeout(function(){checkDone(ch,cb);}, 1000);//wait 50 millisecnds then recheck
        return;
    }
    //console.log("Done");
    cb();
}

page.onLoadFinished = function(){
    //console.log("Load finished");
    //var script1 = "function(){ currComp='" + currComp + "'}";
    //page.evaluateJavaScript(script1);
  
    page.includeJs(
    // Include the https version, you can change this to http if you like.
    'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js',
    function() {
        if(page.injectJs('scrub.js') ){
            var pdts = page.evaluate(function(){return getProducts();});
            //console.log(JSON.stringify(pdts));
            
            var pdtCnt = pdts.products.length ;
            
            
            
            pdts.products.forEach(function(product){
                var pdtPage = webpage.create();
                var pdtURL = 'http://www.gs1india.org.in/ProductRange/ProductDetail.aspx?ComapnyId='+ product.compId+'&gtin='+product.gtin ;
                //console.log(pdtURL);
                pdtPage.open(pdtURL);
                pdtPage.onConsoleMessage = function(msg) {
                    console.log(msg);
                };
                
                (function(pg, product){
                    pg.onLoadFinished = function(){
                        pg.includeJs(
                        // Include the https version, you can change this to http if you like.
                        'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js',
                        function() {
                            if(pg.injectJs('scrub.js')){
                                var pdtDet = pg.evaluate(function(){
                                    return getProductDetail();
                                });
                                for (var key in pdtDet) { product[key] = pdtDet[key]; }
                                
                                //TODO print as CSV
                                //console.log(JSON.stringify(product));
                                console.log(product.compId+","+product.compCode+","+product.compName+","+pdts.segtxt+","+pdts.cattxt+","+pdts.scattxt+","+product.gtin+","+product.pdtName+","+product.qty+","+product.ht+","+product.wd+","+product.len+","+product.wtvol);
                                pg.close();
                                pdtCnt--;
                                
                            }
                        });
                    }
                })(pdtPage, product);
            });
            
            
            checkDone( function(){ 
                //console.log(pdtCnt);
                return pdtCnt == 0;
                }
                , function(){
                if(pdts.isLastPg == true){
                    //console.log("Last page");
                    page.evaluate(function(){return gotoNextCat();});
                }
                else {
                    //console.log("Next Page");
                    page.evaluate(function(){return gotoNextPage();});
                }
            });
            
        }
    });
};

page.open('http://www.gs1india.org.in/ComapnyByPCategory/ComapnyByProductCat.aspx', function(status) {
  console.log("Status: " + status);
  if(status === "success") {

   
  }
});    
