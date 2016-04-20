var codeSep = " - ";

function gup( name, url ) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}


var gotoNextCat = function(){
    ['ddlsubcategory','ddlcategory','ddlsegment'].every(function(dd){
            //console.log(dd);
            var currOpt = $('#'+ dd +' option[selected="selected"]');   
            if(currOpt.next().val()){
                
                nextCat = currOpt.next().val();
                //console.log(nextCat);
                var comp = $('#'+ dd);
                comp.val(nextCat);
                comp.change();
                
                if(dd=="ddlsubcategory"){
                    $('#btnsearch').click();
                }
                return false;
            }
            
            
            return true;
    });
    
    return true;
    
};

var gotoNextPage = function() {
    //console.log("Going to next page");
    $('#btnnext').click();
};

var getProducts = function(){
    //console.log("Getting products");
    var pdtsObj = {}; //The DTO
    pdtsObj.isLastPg = true;
    pdtsObj.products = [];
    pdtsObj.seg = "";
    pdtsObj.cat = "";
    pdtsObj.scat = "";
    
    pdtsObj.seg = $('#ddlsegment').val();
    pdtsObj.cat = $('#ddlcategory').val();
    pdtsObj.scat = $('#ddlsubcategory').val();
    pdtsObj.segtxt = $('#ddlsegment option:selected').text();
    pdtsObj.cattxt = $('#ddlcategory option:selected').text();
    pdtsObj.scattxt = $('#ddlsubcategory option:selected').text();
    
   
    var tbl = $("#grvGepirReport tr");
    var rowNum = "";
    
    if(tbl.length !=0){
        pdtsObj.isLastPg = false;
        $.each(tbl,function (i, row) {
            if(i!=0){
                rowNum = row.cells[0].innerText;
                var gtin = row.cells[1].innerText;
                var pdtName = row.cells[2].innerText;
                var compName = row.cells[3].innerText;
                //var link = $('#grvGepirReport_ctl'+03 + '_HyperLink1').attr('href');
                //console.log(row.cells[1].innerHTML);
                var link = $(row.cells[1].innerHTML).attr('href');
                
                var compId = gup("ComapnyId", link);
                //TODO add cat, subcat, segment
                pdtsObj.products.push({compId: compId, compName: compName, gtin: gtin, pdtName: pdtName});
                //console.log(currComp+","+compCode+","+compName+","+gtin+","+pdtName);
                }
        });
        var totCnt = $("#lblTotNo").text();
        //console.log("Total products: " + totCnt + " Last row:" + rowNum);                    
        if(totCnt===rowNum)
            pdtsObj.isLastPg = true;
    }
    
    return pdtsObj;
};

var getProductDetail = function(){
    var det = {};
    var qty = $("#detailGepirCompany tr:nth-child(7) span").text();
    //console.log("Getting detail");
    det.qty = qty;
    det.ht = $("#detailGepirCompany_Label7").text();
    det.wd = $("#detailGepirCompany_Label8").text();
    det.len = $("#detailGepirCompany_Label9").text();
    det.wtvol = $("#detailGepirCompany_Label10").text();
    var compName = $("#lblcompanyName").text();
    //console.log($("#lblcompanyName"));
    var c = compName.split(codeSep) ; 
                
    det.compCode = c[c.length-1];
    return det;
};
