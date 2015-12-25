var epdb=require('./epdb');
var XLSX = require("xlsx");

/////////////////////////////
//functions needs to be completed
var categories = ["Cow milk","Goat Milk","Buffalo Milk","Cone","Flavoured Milk"];
function findCategory(cat){
    var x=[];
    for(var i=0;i<categories.length;i++){
        if(categories[i]==cat){
            x.push(i);
        }
    }
    if(x.length!=0){
        return x;
    }
    return -1;
}
function findCityID(city){
    return 0;
}

////////////////////////////////

var excel_file = process.argv[2];
var workbook =XLSX.readFile(excel_file);
var worksheet,current_sheet, data;

for(var i = 1;i<workbook.SheetNames.length;i++){
    current_sheet = workbook.SheetNames[i];
    worksheet=workbook.Sheets[current_sheet];

    data=XLSX.utils.sheet_to_json(worksheet);

    if(JSON.stringify(data)!='[]'){
        var keys = Object.keys(data[0]);

        //find all the facets for the products
        var facets=[];
        var facet_index;
        for(facet_index=7;keys[facet_index].search("MRP")==-1;facet_index++){
            facets.push(keys[facet_index]);
        }
        var mrp_index=facet_index;
        facet_index=7;

        //find all the cities which our product is present
        var cities = [];
        for(var k=mrp_index;k<keys.length;k++){
            cities.push(keys[k].substring(3,keys[k].length));
        }

        //read last product id from the database
        //var last_id = getNextId();
        var last_id =0;
        //find categories to which the products from this category might belong
        var cats = findCategory(current_sheet);
        //develop the product 
      for(var j=0;j<data.length;j++){
        var product={};
        product['_id']=last_id++;
        product.brand=data[j]['Brand'];
        product.gtin = data[j]['GTIN'];
        product.pname = data[j]['Title'];
        product.desc = data[j]['Description'];
        product.img = data[j]['Image_URL'];
        product.cats = cats;
        product.facets={};
        for(var k =facet_index;k<mrp_index;k++){
            var temp=keys[k].replace(/ /g,"_").toLowerCase();
            if(data[j][keys[k]].match(/^[0-9]+.?[0-9]*$/)!=null){//it contains only number
                if(data[j][keys[k]].match(/^[0-9]+$/)!=null)
                    product.facets[temp]=parseInt(data[j][keys[k]].match(/^[0-9]+$/).toString());
                else
                    product.facets[temp]=parseFloat(data[j][keys[k]].match(/^[0-9]+.[0-9]+$/).toString());
            }
            else{
                product.facets[temp]={};
                 if(data[j][keys[k]].search(/\./)==-1)
                    product.facets[temp]['val']=parseInt(data[j][keys[k]].match(/^[0-9]+/).toString());
                else
                     product.facets[temp]['val']=parseFloat(data[j][keys[k]].match(/^[0-9]+.[0-9]+/).toString());
                
                product.facets[temp]['unit'] =data[j][keys[k]].match(/[a-zA-Z]+$/).toString();
            }
        }
        product.price={};
        product.price.default_mrp=data[j]['MRP'];
        product.price.mrp=[];
        temp=0;
        for(var k= mrp_index;k<keys.length;k++){
            product.price.mrp[temp]={};
            product.price.mrp[temp].city=findCityID(cities[temp]);
            product.price.mrp[temp].mrp=data[j]["MRP"+cities[temp]];
            temp++;
        }
        product.vars=[];
        product.rel_pdts=[];
      }
    }
}

