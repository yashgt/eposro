mongoimport -d eposro -c products --host localhost:40000 products.json
mongoimport -d eposro -c vendors --host localhost:40000 vendors.json
mongoimport -d eposro -c orders --host localhost:40000 orders.json
mongoimport -d eposro -c users --host localhost:40000 users.json
