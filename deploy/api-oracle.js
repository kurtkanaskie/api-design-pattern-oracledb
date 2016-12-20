var application_root = __dirname,
    express = require("express"),
    path = require("path");

var app = express();
var jdbc = require('trireme-jdbc');

app.use(express.bodyParser({ keepExtensions: true}));

var db = new jdbc.Database({
	url: 'jdbc:oracle:thin:kurtkanaskie@kurtkanaskie.cgpsf0vdwjun.us-east-1.rds.amazonaws.com:1521/ORCL',
	properties: {
		user: 'kurtkanaskie',
		password: 'Fuffy20!6',
	},
	minConnections: 1,
	maxConnections: 20,
	idleTimeout: 60
});

app.configure(function () {
	// app.use(express.bodyParser());
	app.use(express.json());
	app.use(express.urlencoded());

	// app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	})); 
});

app.get('/status', function(req, res) {
	res.send('Node JDBC API is running' + '\n');
});

app.get('/trucks', function(req, res) {
	var sql = 'SELECT * from trucks';
	console.log("SQL: " + sql);

	var body = {
		"metadata" : {
			"count":0,
			"total":0,
			"complete":false },
		"records":[] 
	};

	db.execute(sql, function(err, result, rows) {
		if ( err ) {
			console.log("Node JDBC execute error: " + err + "\n");
		}
		else if (rows) {
			rows.forEach(function (row) {
				console.log('Row: %j', row);
				body.metadata.count++;
				body.records.push(row);
			});
			body.metadata.complete = true;
			res.type('application/json');
			res.send(200, body);
		}
		else if (result ) {
			console.log('Result: ' + JSON.stringify(result));
			res.send(200, body);
        }
		else {
			console.log('ERROR');
			res.send(500, body);
        }
	});
});


app.get('/trucks/:id', function (req, res) {  
	// curl http://localhost:4242/trucks/AMS1234?select=taskid,taskname
	console.log("Node JDBC Api trucks/:id");
	var select = '*';
    if ( req.query.select != undefined) {
		var arr = req.query.select.split(",");
		for( i=0; i < arr.length; i++ ) {
			arr[i] = '"'+arr[i]+'"';
		}
       		select = arr.join();
	}

	var body = {
		"metadata" : {
			"count":0,
			"total":0,
			"complete":false },
		"records":[] 
	};

	var sql = "SELECT " + select + " FROM trucks WHERE NAME = '" + req.params.id + "'";
	console.log("SQL: " + sql);

	db.execute(sql, function(err, result, rows) {
		if ( err ) {
			console.log("Node JDBC execute error: " + err + "\n");
		}
		else {
			rows.forEach(function (row) {
				// console.log('Row: %j', row);
				body.metadata.count++;
				body.records.push(row);
			});
			body.metadata.complete = true;
			res.type('application/json');
			res.send(200, body);
		}
	});
});

app.post('/trucks', function(req, res) {
    // SQL> insert into trucks (uuid, name, displayName, color, description) VALUES ('4a9eded0-9a6c-11e6-a5ce-1d5a0c351d00', 'AMS1234', 'The Burger Truck by Kurt', 'blue', 'Best burgers you ever tasted');
    // var uuid = '4a9eded0-9a6c-11e6-a5ce-1d5a0c351d01';
    var uuid = req.body.uuid;
    var name = req.body.name;
    var displayName = req.body.displayName;
    var color = req.body.color
    var description = req.body.description
	var sql = "INSERT INTO trucks (uuid, name, displayName, color, description) VALUES ('" + uuid + "', '" + name + "', '" + displayName + "', '" + color + "', '" + description + "')";
	console.log("SQL: " + sql);

	var body = {
		"metadata" : {
			"count":0,
			"total":0,
			"complete":false },
		"records":[] 
	};

	db.execute(sql, function(err, result, rows) {
		if ( err ) {
			console.log("Node JDBC execute error: " + err + "\n");
		}
		else if (rows) {
			rows.forEach(function (row) {
				console.log('Row: %j', row);
				body.metadata.count++;
				body.records.push(row);
			});
			body.metadata.complete = true;
			res.type('application/json');
			res.send(200, body);
		}
		else if (result ) {
			console.log('Result: ' + JSON.stringify(result));
			res.send(200, body);
        }
		else {
			console.log('ERROR');
			res.send(500, body);
        }
	});
});

app.listen(4242, function() {
	console.log('Node JDBC Server API is listening on  - 4242' );
});

