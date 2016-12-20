Oracle node js
====

Design Pattern for Oracle DB with JDBC proxy.

This repository contains the apiproxy plus local node development artifacts.

##Dependencies
###Node Modules (builtin to v4.15.01.00)
 - "trireme": "0.8.5"
 - "trireme-jdbc": "1.0.0"

###Java jars
 - "ojdbc6.jar"
 - "trireme.0.8.5.jar"

### Oracle DB
Oracle DB for trucks
````
url: 'jdbc:oracle:thin:username@awsrdsname.cgpsf0vdwjun.us-east-1.rds.amazonaws.com:1521/ORCL',
````


##Testing locally
####Trireme node app
````
	TRIREME_CLASSPATH=`pwd`/ojdbc6.jar  trireme api-oracle.js
````

####Trireme java jar
This works with trireme jar file
````
	java -classpath `pwd`/trireme.0.8.5.jar:`pwd`/ojdbc6.jar io.apigee.trireme.shell.Main api-oracle.js
````

#####Test:
curl http://localhost:4242/trucks

#####Result:
````
...
````

##API Proxy 
###Deployment Details
####Preperation:
All the files in the deploy directory get bundled up and deployed, only need api-oracle.js
	mkdir deploy
	cp api-oracle.js deploy

####Deploy
	NOTE: Repeated Deploys bump the revision.

	apigeetool deploynodeapp -u "username@apigee.com" -d deploy -e test -n design-pattern-oracle -o domain -m api-oracle.js -b /v1/designPattern/oracle -v default,secure
	apigeetool deploynodeapp -u "username@apigee.com" -d deploy -e test -n design-pattern-oracle -o domain -m api-oracle.js -b /v1/designPattern/oracle -v default,secure

	"design-pattern-oracle" Revision 1
	  deployed
	  environment = test
	  base path = /
	  URI = http://org-test.apigee.net/v1/designPattern/oracle
	  URI = https://org-test.apigee.net/v1/designPattern/oracle
###### Local AIO
    apigeetool deploynodeapp -L http://localhost:32773 -u trial@apigee.com -d deploy -e test -n design-pattern-oracle -o trial -m api-oracle.js -b /oracledb/v1 -v default
    curl http://localhost:32771/oracledb/v1/status

#####Install ojdbc6.jar
	Copy the ojdbc6.jar file to: {INST_DIR}/apigee4/data/apigee/custom_jars directory, and restart MP.
		scp ojdbc6.jar test-mp:/apigee/tst/apigee4/data/apigee/custom_jars
		ssh test-mp chmod 755 /apigee/tst/apigee4/data/apigee/custom_jars/ojdbc6.jar
		ssh test-mp apigee/tst/apigee4/bin/apigee-service message-processor restart

####Test
	curl http://org-test.apigee.net/v1/designPattern/oracle/status
	curl http://org-test.apigee.net/v1/designPattern/oracle/trucks

####Modify
	Set password in api-oracle.js to be the Apigee user and password

####Fetch
	apigeetool fetchproxy -u "username@domain.com" -o domain -n design-pattern-oracle -r 1 -f design-pattern-oracle-r1.zip

##Using AWS RDS for Oracle
ENDPOINT FROM CONSOLE: awsname.cgpsf0vdwjun.us-east-1.rds.amazonaws.com:1521

````
$ sqlplus 'username/password@awsname.cgpsf0vdwjun.us-east-1.rds.amazonaws.com:1521/ORCL'
SQL> create table trucks ( uuid VARCHAR2(36), name VARCHAR2(80), displayName VARCHAR2(80), color VARCHAR2(20), description VARCHAR2(160) );
SQL> insert into trucks (uuid, name, displayName, color, description) VALUES ('4a9eded0-9a6c-11e6-a5ce-1d5a0c351d00', 'AMS1234', 'The Burger Truck by Kurt', 'blue', 'Best burgers you ever tasted');
SQL> grant select on trucks to public;
SQL> grant read on trucks to public;

````

##TODO
Execute stored procedure via API.

````
Set serveroutput on 
CREATE OR REPLACE PROCEDURE helloworld IS BEGIN DBMS_OUTPUT.PUT_LINE('Hello!!!'); END;
/

execute helloworld
````
