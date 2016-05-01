var MongoClient = require('mongodb').MongoClient; // Driver for connecting to MongoDB
var ObjectID = require('mongodb').ObjectID;
var dbConn;

MongoClient.connect('mongodb://localhost:40000/eposro', function(err, db) {
    if (!err) {
        dbConn = db;
        console.log("Connected Successfully");
    } else {
        console.log(err);
    }
});

setTimeout(function() {
        dbConn.collection('vendors').ensureIndex({
            "address.location": "2dsphere"
        }, function(err, res) {
            if (!err) {
                console.log(res);
            }
        });

        dbConn.collection("gs1cats").createIndex({
                "id": 1
            },
            {unique:true},
            function(err, res) {
                if (!err) {
                    console.log(res);
                }
            }
        );
        dbConn.collection("gs1subcats").createIndex({
                "id": 1
            },
            {unique:true},
            function(err, res) {
                if (!err) {
                    console.log(res);
                }
            }
        );
}, 5000);