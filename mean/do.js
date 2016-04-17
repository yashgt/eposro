
var codeSep = " - ";
//var startComp = "12180";

var gotoComp = function(compId) {
    console.log("Going to " + compId);
    var comp = $('#drpcompanyWise');
    comp.val(compId);
    $('#btnsearch').click();
};

var gotoNextComp = function(compId) {
    console.log("Going to next after " + compId);
    var comp = $('#drpcompanyWise');
    var currOpt = $('#drpcompanyWise option[value="' + compId + '"]');    
    currComp = currOpt.next().val();
    comp.val(currComp);
    $('#btnsearch').click();
};

var gotoNextPage = function(){
    console.log("Going to next page");
    $('#btnnext').click();
};


var getProducts = function(){
    console.log("Getting products");
    var pdtObj = {}; //The DTO
    pdtObj.isLastPg = true;
    pdtObj.products = [];
    pdtObj.currComp = "";
    
    pdtObj.currComp = $('#drpcompanyWise').val();
    
    var currOpt = $('#drpcompanyWise option[value="' + pdtObj.currComp + '"]');    
    optText = currOpt.text();
    var c = optText.split(codeSep) ; 
                
    compCode = c[c.length-1];
    compName = unescape(optText.replace(" - " + compCode, ""));
    
    var tbl = $("#grvGepirReport tr");
    var rowNum = "";
    
    if(tbl.length !=0){
        pdtObj.isLastPg = false;
        $.each(tbl,function (i, row) {
            if(i!=0){
                rowNum = row.cells[0].innerText;
                var gtin = row.cells[1].innerText;
                var pdtName = row.cells[3].innerText;
                //TODO add cat, subcat, segment
                pdtObj.products.push({compId: pdtObj.currComp, compCode: compCode, compName: compName, gtin: gtin, pdtName: pdtName});
                //console.log(currComp+","+compCode+","+compName+","+gtin+","+pdtName);
                }
        });
        var totCnt = $("#lblTotNo").text();
        //console.log("Total products: " + totCnt + " Last row:" + rowNum);                    
        if(totCnt===rowNum)
            pdtObj.isLastPg = true;
    }
    
    return pdtObj;
};

var getProductDetail = function(){
    var det = {};
    var qty = $("#detailGepirCompany tr:nth-child(7) span").text();
    console.log(qty);
    det.qty = qty;
    det.ht = $("#detailGepirCompany_Label7").text();
    det.wd = $("#detailGepirCompany_Label8").text();
    det.len = $("#detailGepirCompany_Label9").text();
    det.wtvol = $("#detailGepirCompany_Label10").text();
    return det;
};
