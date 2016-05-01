mongoimport -d eposro -c gs1cats --host localhost:40000 --jsonArray --upsert categories.gs1datakart.pilot.json
mongoimport -d eposro -c gs1subcats --host localhost:40000 --jsonArray --upsert subcategories.gs1datakart.pilot.json
mongoimport -d eposro -c gs1companies --host localhost:40000 --jsonArray --upsert companies.gs1datakart.pilot.json