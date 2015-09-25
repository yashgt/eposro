var epdb = require('./epdb');

var cnt = 100;

//random product generation
setTimeout(function () {
    //product related data
    var names = [
		'Amul Taaza',
		'Britania Buiscuit',
		'Marie Gold',
		'Goa Dairy Milk',
		'Colgate ToothPaste',
		'Standard Horlicks',
		'Kanan Devan Tea',
		'Tata Salt',
		'Sugar',
		'Wheat Flour',
		'Bournvita',
		'Flavoured Milk'
	];
    var descriptions = [
	  'Tasty and Enriching',
	  'Best Selling product',
	  'Nutritious',
	  'Enjoy The Taste Of Goa',
	  'Created with Joy',
	  'No. 1 Brand in India'
	];
    var brands = [
	   'Amul',
	   'Goa Dairy',
	   'Tata',
	   'Colgate',
	   'Horlicks',
	];
    var units = ['Ltrs', 'Kg'];
    var facets = [
		'thickness',
		'Calories',
		'Fat_percentage',

	];
    epdb.getLastID(function (doc) {
        var count = doc.last_entry_id;
        console.log(count);

        for (var i = 1; i <= cnt; i++) {
            var pname = names[Math.floor(Math.random() * names.length)];
            var p = { //TODO team to fill the object
                "_id": ++count,
                "brand_of_product": brands[Math.floor(Math.random() * brands.length)],
                "gtin": randomString(14, '0123456789'),
                "pname": pname,
                "category": Math.floor(Math.random() * 30),
                "image_url": pname.concat('.jpg'),
                "pricing": {
                    "default_mrp": Math.floor(Math.random() * 500),
                    "mrp": [
                        {
                            "city": Math.floor(Math.random() * 6),
                            "mrp": Math.floor(Math.random() * 500)
                        },
                        {
                            "city": Math.floor(Math.random() * 6),
                            "mrp": Math.floor(Math.random() * 500)
                        }
				]
                },
                "common_fields": {
                    "c_facet_qty": Math.floor(Math.random() * 3),
                    "c_qty_unit": units[Math.floor(Math.random() * 2)],
                    "c_facet_wt": Math.floor(Math.random() * 3),
                    "c_qty_wt": "Kg"
                },
                "facets": [
                    {
                        "type": facets[Math.floor(Math.random() * facets.length)],
                        "val": Math.floor(Math.random() * 30)
				},
                    {
                        "type": facets[Math.floor(Math.random() * facets.length)],
                        "val": Math.floor(Math.random() * 30)
				}],
                "vars": [],
                "related_products": []
            };
            //to generate random variants
            for (var j = 0; j < Math.floor(Math.random() * 5); j++) {
                p.vars.push({
                    "vid": Math.floor(Math.random() * count),
                    "vname": names[Math.floor(Math.random() * names.length)],
                    "facets": [
                        {
                            "type": facets[Math.floor(Math.random() * facets.length)],
                            "val": Math.floor(Math.random() * 30)
									},
                        {
                            "type": facets[Math.floor(Math.random() * facets.length)],
                            "val": Math.floor(Math.random() * 30)
									}
						]

                });
            }

            //to generate random recommended products
            for (var j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
                pname = names[Math.floor(Math.random() * names.length)];
                p.related_products.push({
                    "id": Math.floor(Math.random() * count),
                    "pname": pname,
                    "purl": pname.concat('.jpg')
                });
            }
            epdb.addProduct(p, function (pdt) {
                console.log("Added %j", pdt);
            });
        }
        //entering the last count
        epdb.updateID(count, doc, function (doc) {});
    });

}, 15000); //Wait for 5 sec for connection to be established with DB

//My custom functions
function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}
