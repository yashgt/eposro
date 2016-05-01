var trulo = require('./mean/modules/trulo/server/models/trulo.server.model');
var wait = require('wait.for');

setTimeout(function() {
    wait.launchFiber(function() {
        var subcats = wait.for(trulo.subcatsNotAdded);
        for (var i = 0; i < subcats.length; i++) {
            var category = {};
            var cid=subcats[i].id;
            category.name = subcats[i].subcategory;
            category.parent_id = wait.for(trulo.findCategoryId, subcats[i].category)[0];
            var flag = wait.for(trulo.checkIfExists, category.name);
            if (flag != true) {
                category._id = wait.for(trulo.getUniqueCatId);
                var str = wait.for(trulo.addCatToDb, category);
                wait.for(trulo.setGS1SubCatFlag,cid);
                console.log(str);
            } else {
                wait.for(trulo.setGS1SubCatFlag,cid);
            }
        }
    });
}, 3000);