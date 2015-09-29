set SOLR_HOME=D:\downloads\dvd\solr-5.3.0
set EPHOME=E:\Projects\eposro\eposro

mkdir -p %EPHOME%\solr\eposro\conf

cp -R %SOLR_HOME%\example\files\conf %EPHOME%\solr\eposro\
cp %SOLR_HOME%\example\techproducts\solr\techproducts\conf\schema.xml %EPHOME%\solr\eposro\conf
cp %SOLR_HOME%\example\techproducts\solr\solr.xml %EPHOME%\solr\solr.xml

solr start -p 9393 -s %EPHOME%\solr
wget "http://localhost:9393/solr/admin/cores?action=CREATE&name=eposro&instanceDir=eposro"