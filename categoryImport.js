var trulo = require('./mean/modules/trulo/server/models/trulo.server.model');
var wait = require('wait.for');
/*
get all the categories present in gs1 collection with flag=false
find if that category already exists in the category collection
if exists mark that category falg as true
else add to category collection and mark the category as true
*/
setTimeout(function() {
        wait.launchFiber(function() {
            var cats = wait.for(trulo.getCatsNotAdded);
            for (var i = 0; i < cats.length; i++) {
                var category = {};
                var cid = cats[i].id;
                category.name = cats[i].category;
                category.parent_id = 0;
                var flag = wait.for(trulo.checkIfExists,category.name);
                if (flag != true) {
                    category._id = wait.for(trulo.getUniqueCatId);
                    var res=wait.for(trulo.addCatToDb,category);
                    wait.for(trulo.setGS1CatFlag,cid);
                    console.log(res);
                } else {
                   wait.for(trulo.setGS1CatFlag,cid);
               }
            }
        });
}, 3000);