set EPHOME=E:\Projects\eposro\eposro
set logpath=%EPHOME%\mongo\log
set dbpath=%EPHOME%\mongo\data
mkdir -p %logpath%
mkdir -p %dbpath%\node1

mongod --config %EPHOME%\mongo\mongod.cfg --port 30000 --logpath %logpath%\node1.log --dbpath %dbpath%\node1

mongo-connector -m localhost:30000 -t http://localhost:9393/solr/eposro -d solr_doc_manager