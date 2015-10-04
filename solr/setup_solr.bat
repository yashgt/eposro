solr start -p 9393 -s %EPHOME%\solr
wget "http://localhost:9393/solr/admin/cores?action=CREATE&name=eposro&instanceDir=eposro"
