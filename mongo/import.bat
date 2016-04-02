mongoimport -d eposro -c products --upsert --host localhost:40000 products.json
rem mongoimport -d eposro -c category --upsert --host localhost:40000 category.json
rem mongoimport -d eposro -c companies --upsert --host localhost:40000 companies.json
rem mongoimport -d eposro -c users --upsert --host localhost:40000 users.json
rem mongoimport -d eposro -c cities --upsert --host localhost:40000 cities.json
rem mongoimport -d eposro -c vendors --upsert --host localhost:40000 vendors.json
rem mongoimport -d eposro -c orders --upsert --host localhost:40000 orders.json