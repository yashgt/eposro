mongoimport -d eposro -c products --upsert --host localhost:40000 products.json
mongoimport -d eposro -c category --upsert --host localhost:40000 category.json
mongoimport -d eposro -c category --upsert --host localhost:40000 companies.json
mongoimport -d eposro -c category --upsert --host localhost:40000 users.json
mongoimport -d eposro -c category --upsert --host localhost:40000 cities.json
mongoimport -d eposro -c category --upsert --host localhost:40000 vendors.json
mongoimport -d eposro -c category --upsert --host localhost:40000 orders.json