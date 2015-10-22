set logpath=%EPHOME%\mongo\log
set dbpath=%EPHOME%\mongo\data

REM --install --serviceName MongoEP
mongod --config %EPHOME%\mongo\mongod.cfg --port 40000 --logpath %logpath%\node1.log --dbpath %dbpath%\node1

REM mongo-connector -m localhost:40000 -t http://localhost:9393/solr/eposro -d ep_doc_manager
