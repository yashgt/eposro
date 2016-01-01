set JDK_HOME=C:\Program Files\Java\jdk1.8.0_66
set JAVA_HOME=%JDK_HOME%\bin
set EPHOME=E:\Projects\eposro\eposro
set security_path=%JDK_HOME%\jre\lib\security
set keytool_ps=changeit
set cert_file=%EPHOME%\mavenCert.cer
keytool -import -alias epkey5 -keystore "%security_path%\cacerts" -storepass %keytool_ps% -file %cert_file% 

REM -Xmx512m -Djavax.net.ssl.trustStore=C:\temp\mavenKeystore -Djavax.net.ssl.trustStorePassword=eposro