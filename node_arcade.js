const express = require("express");
const app = express();
bodyParser = require('body-parser');
port = process.env.PORT || 56933;

app.set('view engine', 'ejs');
	
var Error = function (res) {
	res.send("Your request was shit");
}

app.get('/getBalance?*', function(req, res) {
	console.log(res);
	var serial = req._parsedUrl.query;
	res.send("looking up " + serial + " on the database");
});


var sqlite3 = require('sqlite3').verbose();
 var db = new sqlite3.Database("ArcadeDB");

db.each("SELECT * FROM CardTransactionLog", function(err, row) {
	if(err) {
		console.log(err);
	}
	else {
		console.log(row);
	}
  });
/*  var db = new sqlite3.Database("ArcadeDB");

 var db = new sqlite3.Database("ArcadeDB");
 
db.serialize(function() {
 
 
 db.run("DROP TABLE ArcadeMachines"); db.run("DROP TABLE ArcadeCustomers");
 db.run("DROP TABLE CardTransactionLog");
 db.run("CREATE TABLE ArcadeCustomers (SerialID text primary key, Balance real default 0, email text, AccType text default 'REG', RegistrationDate DEFAULT CURRENT_TIMESTAMP, LastEdited DEFAULT CURRENT_TIMESTAMP)");
 db.run("CREATE TABLE ArcadeMachines (MachineID text primary key, MachineName text, Cost real default 0, NoCharge integer default 0, MachineSecret text,MachinePlays real default 0, MachineType text default 'REG', MachineDate DEFAULT CURRENT_TIMESTAMP, LastEdited DEFAULT CURRENT_TIMESTAMP)");
 db.run("CREATE TABLE CardTransactionLog (SerialID text, BalanceChange real, TransactionDate DEFAULT CURRENT_TIMESTAMP, MachineID text, MachineName text, MachinePlayNumber text)");
 
     var stmt = db.prepare("INSERT INTO ArcadeMachines (MachineID, Cost, MachineName, NoCharge, MachineSecret, MachinePlays ) VALUES (?,?,?,?,?,?)");
  stmt.run("03-0","3","Machine 1 -charge","0", "fhjklajfa","30",function(err, row) {
  if(err) { console.log(err) }});
	stmt.finalize();
	    var stmt = db.prepare("INSERT INTO ArcadeMachines (MachineID, Cost, MachineName, NoCharge, MachineSecret, MachinePlays ) VALUES (?,?,?,?,?,?)");
  stmt.run("03-1","3","Machine 1 -nocharge","1", "fhjklajfa","30",function(err, row) {
  if(err) { console.log(err) }});
	stmt.finalize(); 
		    var stmt = db.prepare("INSERT INTO ArcadeMachines (MachineID, Cost, MachineName, NoCharge, MachineSecret, MachinePlays ) VALUES (?,?,?,?,?,?)");
  stmt.run("03-3","3","Machine 1 -charge tier 2","0", "fhjklajfa","30",function(err, row) {
  if(err) { console.log(err) }});
	stmt.finalize(); 
 
 
   var stmt = db.prepare("INSERT INTO ArcadeCustomers (SerialID, Balance, email, AccType ) VALUES (?,?,?,?)");
  stmt.run("1234567890","1000","anthony@thisisarealdomain.com","REG",function(err, row) {
  if(err) { console.log(err) }});
  stmt.run("12345678901","1000","notservice@thisisarealdomain.com","SERVICE",function(err, row) {
  if(err) { console.log(err) }});
	
	stmt.finalize();  
	
	
	
  db.each("SELECT * FROM ArcadeCustomers", function(err, row) {
	if(err) {
		console.log(err);
	}
	else {
		console.log(row);
	}
  });
  
  db.each("SELECT * FROM ArcadeMachines", function(err, row) {
	if(err) {
		console.log(err);
	}
	else {
		console.log(row);
	}
  });
});
 
db.close(); */

    app.use(bodyParser.urlencoded({extended:true})); 
	
app.get('/canIplay?*', function(req, res) {
//Machine ID / Hashed Serial Number & Machine ID & secret
  var parser = req._parsedUrl.query;
		array = parser.split("/");
		console.log(array[0] + "    " + array[1]);
		if (array.length != 2 || !array[0] || !array[1]){
			Error(res);
		}
		else{
			// Verify(Serial Number & Machine ID)
			// if good
			// check balance -> deduct balance -> send json
			sqlqueryres = {Status: "OK", Balance_Left:"75.0 credits", Verified_Secret : "xEnckk39jsL9d" }
			res.send(sqlqueryres);
			// else Send Error;
		}
  
});



app.get('/view-all-accounts', function(req, res) {
	var db = new sqlite3.Database("ArcadeDB");
	db.serialize(function() {
	db.all("SELECT * FROM ArcadeCustomers", function(err, j) {
	if(err) {
		console.log(err);
	}
	else {
		console.log(j);
		res.render("BasicJSON.ejs", {j:j}); 
	}
  });

	});
});
app.get('/view-all-machines', function(req, res) {
	
	 var db = new sqlite3.Database("ArcadeDB");
 db.serialize(function() {
	db.all("SELECT * FROM ArcadeMachines", function(err, j) {
	if(err) {
		console.log(err);
	}
	else {
		console.log(j);
		res.render("BasicJSON.ejs", {j:j}); 
	}
  });
	
	});
});
app.get('/view-all-transactions', function(req, res) {
	 var db = new sqlite3.Database("ArcadeDB");
db.serialize(function() {
	db.all("SELECT * FROM CardTransactionLog", function(err, j) {
	if(err) {
		console.log(err);
	}
	else {
		console.log(j);
		res.render("BasicJSON.ejs", {j:j}); 
	}
  });
	
	});
	
});

app.get('/create-account', function(req, res) {
  res.render("CreateUser.ejs");
});
app.get('/signup', function(req, res) {
  res.render("CreateUser.ejs");
});
app.post('/create-account', function(req, res) {
	console.log(req.body);
	
	var db = new sqlite3.Database("ArcadeDB");
	var stmt = db.prepare("INSERT INTO ArcadeCustomers (SerialID, Balance, email, AccType ) VALUES (?,?,?,?)");
	stmt.run(req.body.SerialID,req.body.Balance,req.body.email,req.body.AccType,function(err, row) {
	if(err) { console.log(err) }});
	stmt.finalize();  
	db.close();
		res.redirect("http://192.168.1.2:56933/view-all-accounts"); 
	});	
	
app.get('/edit-account?', function(req, res) {
	var id = req._parsedUrl.query;
	console.log(id);
	var db = new sqlite3.Database("ArcadeDB");
	var stmt = db.prepare("SELECT * FROM ArcadeCustomers WHERE SerialID = " + id + "");
stmt.all(function(err, j) {
	if(err) {
		console.log(err);
	}
	else {
		console.log(j);
		res.render("EditUser.ejs",{j:j}); 
	}
  });
});	
app.post('/edit-account', function(req, res) {
	var db = new sqlite3.Database("ArcadeDB");
	var stmt = db.prepare("UPDATE ArcadeCustomers SET SerialID = '" + req.body.SerialID + "', Balance = '"+req.body.Balance+"', email = '"+req.body.email+"', AccType = '"+req.body.AccType+"', LastEdited = CURRENT_TIMESTAMP WHERE SerialID = '" + req.body.origSerialID + "';");
stmt.all(function(err, j) {
	if(err) {
		console.log(err);
	}
	else {
		res.redirect("http://192.168.1.2:56933/view-all-accounts"); 
	}
  });
});	
	
app.get('/create-machine', function(req, res) {
  res.render("CreateMachine.ejs");
});
app.post('/create-machine', function(req, res) {
	console.log(req.body);
	
	
	var db = new sqlite3.Database("ArcadeDB");
	var stmt = db.prepare("INSERT INTO ArcadeMachines (MachineID, Cost, MachineName, NoCharge, MachineSecret, MachinePlays, MachineType ) VALUES (?,?,?,?,?,?,?)");
  stmt.run(req.body.MachineID, req.body.Cost, req.body.MachineName, req.body.NoCharge, req.body.MachineSecret, req.body.MachinePlays,req.body.MachineType,function(err, row) {
  if(err) { console.log(err) }});
	stmt.finalize();
	
		res.redirect("http://192.168.1.2:56933/view-all-machines"); 
	});	
	
app.get('/edit-machine?', function(req, res) {
	var id = req._parsedUrl.query;
	console.log(id);
	var db = new sqlite3.Database("ArcadeDB");
	var stmt = db.prepare("SELECT * FROM ArcadeMachines WHERE MachineID = '" + id + "'");
  stmt.all(function(err, j) {
	if(err) {
		console.log(err);
	}
	else {
		console.log(j);
		res.render("EditMachine.ejs",{j:j}); 
	}
  });
});
app.post('/edit-machine', function(req, res) {
	console.log(req.body);
	var db = new sqlite3.Database("ArcadeDB");
	var stmt = db.prepare("UPDATE ArcadeMachines SET MachineID = '" +req.body.MachineID+"', MachineName = '"+req.body.MachineName+"', Cost = '"+req.body.Cost+"',NoCharge = '"+req.body.NoCharge+"', NoCharge = '"+req.body.NoCharge+"', MachineSecret = '"+req.body.MachineSecret+"', MachinePlays = '"+req.body.MachinePlays+"', MachineType = '"+req.body.MachineType+"', LastEdited = CURRENT_TIMESTAMP WHERE MachineID = '" + req.body.origMachineID + "';");
stmt.all(function(err, j) {
	if(err) {
		console.log(err);
	}
	else {
		console.log(j);
		res.redirect("http://192.168.1.2:56933/view-all-machines"); 
	}
  });


  });

function Deduct(rs){
	var db = new sqlite3.Database("ArcadeDB");
	var response;
	console.log(rs);
	db.serialize(function() {
		if(rs.user.AccType == "SERVICE"){
				updateBalance = rs.user.Balance;
				BalanceChange = 0
 db.run("UPDATE ArcadeCustomers set Balance = '"+updateBalance+"' WHERE SerialID = '"+rs.user.SerialID+"';");
 db.run("UPDATE ArcadeMachines set MachinePlays = '"+(rs.machine.MachinePlays+1)+"'' WHERE MachineID = '"+rs.machine.MachineID+"';");
db.run("INSERT CardTransactionLog ( SerialID ,BalanceChange, MachineID, SerialName, MachinePlayNumber ) VALUES ('"+rs.user.SerialID+"', '" +BalanceChange+"', '"+rs.machine.MachineID+"', '"+rs.machine.MachineName+"', '"+(rs.user.MachinePlays+1)+"');");
	response={status:"OK",message:"Credit added"};
			
		}
		else if(rs.user.AccType == "T1"){
				updateBalance = rs.user.Balance - (rs.Machine.NoCharge ? 0 : rs.Machine.MachineType=='REG' ? 0 : rs.Machine.MachineType=='T1' ? 0 : rs.machine.Cost)
				BalanceChange = 0 - (rs.Machine.NoCharge ? 0 : rs.Machine.MachineType=='REG' ? 0 : rs.Machine.MachineType=='T1' ? 0 : rs.machine.Cost)
 db.run("UPDATE ArcadeCustomers set Balance = '"+updateBalance+"' WHERE SerialID = '"+rs.user.SerialID+"';");
 db.run("UPDATE ArcadeMachines set MachinePlays = '"+(rs.machine.MachinePlays+1)+"'' WHERE MachineID = '"+rs.machine.MachineID+"';");
db.run("INSERT CardTransactionLog ( SerialID ,BalanceChange, MachineID, SerialName, MachinePlayNumber ) VALUES ('"+rs.user.SerialID+"', '" +BalanceChange+"', '"+rs.machine.MachineID+"', '"+rs.machine.MachineName+"', '"+(rs.user.MachinePlays+1)+"');");
	response={status:"OK",message:"Credit added. You have until XX before your account reverts to a regular one"};
			
		}
		else if(rs.user.AccType == "T2"){
				updateBalance = rs.user.Balance  - (rs.Machine.NoCharge ? 0 : rs.Machine.MachineType=='REG' ? 0 : rs.Machine.MachineType=='T1' ? 0 : rs.Machine.MachineType=='T2' ? 0 : rs.machine.Cost)
				BalanceChange = 0 - (rs.Machine.NoCharge ? 0 : rs.Machine.MachineType=='REG' ? 0 : rs.Machine.MachineType=='T1' ? 0 : rs.Machine.MachineType=='T2' ? 0 : rs.machine.Cost)
 db.run("UPDATE ArcadeCustomers set Balance = '"+updateBalance+"' WHERE SerialID = '"+rs.user.SerialID+"';");
 db.run("UPDATE ArcadeMachines set MachinePlays = '"+(rs.machine.MachinePlays+1)+"'' WHERE MachineID = '"+rs.machine.MachineID+"';");
 db.run("INSERT CardTransactionLog ( SerialID ,BalanceChange, MachineID, SerialName, MachinePlayNumber ) VALUES ('"+rs.user.SerialID+"', '" +BalanceChange+"', '"+rs.machine.MachineID+"', '"+rs.machine.MachineName+"', '"+(rs.user.MachinePlays+1)+"');");
	response={status:"OK",message:"Credit added. You have until XX before your account reverts to a regular one"};		
		}
		else if(rs.user.AccType == "T3"){
				updateBalance = rs.user.Balance  - (rs.Machine.NoCharge ? 0 : rs.Machine.MachineType=='REG' ? 0 : rs.Machine.MachineType=='T1' ? 0 : rs.Machine.MachineType=='T2' ? 0 : rs.Machine.MachineType=='T3' ? 0 : rs.machine.Cost)
				BalanceChange = 0 - (rs.Machine.NoCharge ? 0 : rs.Machine.MachineType=='REG' ? 0 : rs.Machine.MachineType=='T1' ? 0 : rs.Machine.MachineType=='T2' ? 0 : rs.Machine.MachineType=='T3' ? 0 : rs.machine.Cost)
 db.run("UPDATE ArcadeCustomers set Balance = '"+updateBalance+"' WHERE SerialID = '"+rs.user.SerialID+"';");
 db.run("UPDATE ArcadeMachines set MachinePlays = '"+(rs.machine.MachinePlays+1)+"'' WHERE MachineID = '"+rs.machine.MachineID+"';");
 db.run("INSERT CardTransactionLog ( SerialID ,BalanceChange, MachineID, SerialName, MachinePlayNumber ) VALUES ('"+rs.user.SerialID+"', '" +BalanceChange+"', '"+rs.machine.MachineID+"', '"+rs.machine.MachineName+"', '"+(rs.user.MachinePlays+1)+"');");
response={status:"OK",message:"Credit added. You have until XX before your account reverts to a regular one"};	
			
		}
		else {
				updateBalance = rs.user.Balance  -  rs.machine.Cost
				BalanceChange = 0 - rs.machine.Cost
 db.run("UPDATE ArcadeCustomers set Balance = '"+updateBalance+"' WHERE SerialID = '"+rs.user.SerialID+"';");
 db.run("UPDATE ArcadeMachines set MachinePlays = '"+(rs.machine.MachinePlays+1)+"'' WHERE MachineID = '"+rs.machine.MachineID+"';");
 db.run("INSERT CardTransactionLog ( SerialID ,BalanceChange, MachineID, SerialName, MachinePlayNumber ) VALUES ('"+rs.user.SerialID+"', '" +BalanceChange+"', '"+rs.machine.MachineID+"', '"+rs.machine.MachineName+"', '"+(rs.user.MachinePlays+1)+"');");
response={status:"OK",message:"Credit added. You have " +updateBalance+" credits left."};	
			
		}
		
	
	});
	
    return response;
}



app.get('/SimulateCharge', function(req, res) {
  res.render("Simulation.ejs");
});
app.post('/SimulateResults', function(req, res) {
	console.log(req.body);
	var db = new sqlite3.Database("ArcadeDB");
	var results;
	db.serialize(function() {
	var stmt = db.prepare("Select * FROM ArcadeCustomers WHERE SerialID = '" + req.body.SerialID + "';");
stmt.all(function(err, j) {
	if(err) {
		console.log(err);
	}
	else {
		 var stmt2 = db.prepare("Select * FROM ArcadeMachines WHERE MachineID = '" + req.body.MachineID + "';");
stmt2.all(function(err2, j2) {
	if(err2) {
		console.log(err2);
	}
	else {
		rs = {user:j[0],machine:j2[0]};
		if(!rs.user){
			res.send("{status:'fail',message:'Not a real User'}");
		}
		else if(!rs.machine){
			res.send("{status:'fail',message:'Not a real Machine'}");
		}
		else if(rs.machine.MachineSecret!=req.body.MachineSecret){
			res.send("{status:'fail',message:'Failed Handshake, check Secret'}");
		}
		
		else {
			if(rs.user.AccType == "SERVICE"){
				updateBalance = rs.user.Balance;
				
				BalanceChange = 0
 db.run("UPDATE ArcadeCustomers set Balance = '"+updateBalance+"' WHERE SerialID = '"+rs.user.SerialID+"';");
 db.run("UPDATE ArcadeMachines set MachinePlays = '"+(rs.machine.MachinePlays+1)+"' WHERE MachineID = '"+rs.machine.MachineID+"';");
 var stmt = db.prepare("INSERT INTO CardTransactionLog ( SerialID ,BalanceChange, MachineID, MachineName, MachinePlayNumber ) VALUES (?,?,?,?,?)");
  stmt.run(rs.user.SerialID,BalanceChange,rs.machine.MachineID,rs.machine.MachineName,(rs.machine.MachinePlays+1),function(err, row) {
  if(err) { console.log(err) }});
  response={status:"OK",message:"Credit added"};
			
		}
		else if(rs.user.AccType == "T1"){
				updateBalance = rs.user.Balance - (rs.machine.NoCharge ? 0 : rs.machine.MachineType=='REG' ? 0 : rs.machine.MachineType=='T1' ? 0 : rs.machine.Cost)
				if(updateBalance<0){
			res.send("{status:'fail',message:'Not Enough Credits'}");
		} else {
				BalanceChange = 0 - (rs.machine.NoCharge ? 0 : rs.machine.MachineType=='REG' ? 0 : rs.machine.MachineType=='T1' ? 0 : rs.machine.Cost)
 db.run("UPDATE ArcadeCustomers set Balance = '"+updateBalance+"' WHERE SerialID = '"+rs.user.SerialID+"';");
 db.run("UPDATE ArcadeMachines set MachinePlays = '"+(rs.machine.MachinePlays+1)+"' WHERE MachineID = '"+rs.machine.MachineID+"';");
db.run("INSERT INTO CardTransactionLog ( SerialID ,BalanceChange, MachineID, MachineName, MachinePlayNumber ) VALUES ('"+rs.user.SerialID+"', '" +BalanceChange+"', '"+rs.machine.MachineID+"', '"+rs.machine.MachineName+"', '"+(rs.user.MachinePlays+1)+"');");
	response={status:"OK",message:"Credit added. You have "+rs.user.Hours+" hours left before your account reverts to a regular one. You have " +updateBalance+" credits left."};
			
		}}
		else if(rs.user.AccType == "T2"){
				updateBalance = rs.user.Balance  - (rs.machine.NoCharge ? 0 : rs.machine.MachineType=='REG' ? 0 : rs.machine.MachineType=='T1' ? 0 : rs.machine.MachineType=='T2' ? 0 : rs.machine.Cost)
				if(updateBalance<0){
			res.send("{status:'fail',message:'Not Enough Credits'}");
		} else {
			BalanceChange = 0 - (rs.machine.NoCharge ? 0 : rs.machine.MachineType=='REG' ? 0 : rs.machine.MachineType=='T1' ? 0 : rs.machine.MachineType=='T2' ? 0 : rs.machine.Cost)
 db.run("UPDATE ArcadeCustomers set Balance = '"+updateBalance+"' WHERE SerialID = '"+rs.user.SerialID+"';");
 db.run("UPDATE ArcadeMachines set MachinePlays = '"+(rs.machine.MachinePlays+1)+"' WHERE MachineID = '"+rs.machine.MachineID+"';");
 var stmt = db.prepare("INSERT INTO CardTransactionLog ( SerialID ,BalanceChange, MachineID, MachineName, MachinePlayNumber ) VALUES (?,?,?,?,?)");
  stmt.run(rs.user.SerialID,BalanceChange,rs.machine.MachineID,rs.machine.MachineName,(rs.machine.MachinePlays+1),function(err, row) {
  if(err) { console.log(err) }});
  response={status:"OK",message:"Credit added. You have "+rs.user.Hours+" hours left before your account reverts to a regular one. You have " +updateBalance+" credits left."};		
		}}
		else if(rs.user.AccType == "T3"){
				updateBalance = rs.user.Balance  - (rs.machine.NoCharge ? 0 : rs.machine.MachineType=='REG' ? 0 : rs.machine.MachineType=='T1' ? 0 : rs.machine.MachineType=='T2' ? 0 : rs.machine.MachineType=='T3' ? 0 : rs.machine.Cost)
				if(updateBalance<0){
			res.send("{status:'fail',message:'Not Enough Credits'}");
		} else {
				BalanceChange = 0 - (rs.machine.NoCharge ? 0 : rs.machine.MachineType=='REG' ? 0 : rs.machine.MachineType=='T1' ? 0 : rs.machine.MachineType=='T2' ? 0 : rs.machine.MachineType=='T3' ? 0 : rs.machine.Cost)
 db.run("UPDATE ArcadeCustomers set Balance = '"+updateBalance+"' WHERE SerialID = '"+rs.user.SerialID+"';");
 db.run("UPDATE ArcadeMachines set MachinePlays = '"+(rs.machine.MachinePlays+1)+"' WHERE MachineID = '"+rs.machine.MachineID+"';");
  var stmt = db.prepare("INSERT INTO CardTransactionLog ( SerialID ,BalanceChange, MachineID, MachineName, MachinePlayNumber ) VALUES (?,?,?,?,?)");
  stmt.run(rs.user.SerialID,BalanceChange,rs.machine.MachineID,rs.machine.MachineName,(rs.machine.MachinePlays+1),function(err, row) {
  if(err) { console.log(err) }});
  response={status:"OK",message:"Credit added. You have "+rs.user.Hours+" hours left before your account reverts to a regular one. You have " +updateBalance+" credits left."};	
			
		}}
		else {
			if(updateBalance<0){
			res.send("{status:'fail',message:'Not Enough Credits'}");
		} else {
			
				updateBalance = rs.user.Balance  -  (rs.machine.NoCharge ? 0 : rs.machine.Cost)
				BalanceChange = 0 - (rs.machine.NoCharge ? 0 : rs.machine.Cost)
 db.run("UPDATE ArcadeCustomers set Balance = '"+updateBalance+"' WHERE SerialID = '"+rs.user.SerialID+"';");
 db.run("UPDATE ArcadeMachines set MachinePlays = '"+(rs.machine.MachinePlays+1)+"' WHERE MachineID = '"+rs.machine.MachineID+"';");
 var stmt = db.prepare("INSERT INTO CardTransactionLog ( SerialID ,BalanceChange, MachineID, MachineName, MachinePlayNumber ) VALUES (?,?,?,?,?)");
  stmt.run(rs.user.SerialID,BalanceChange,rs.machine.MachineID,rs.machine.MachineName,(rs.machine.MachinePlays+1),function(err, row) {
  if(err) { console.log(err) }});
 //db.run("INSERT INTO CardTransactionLog( SerialID ,BalanceChange, MachineID, MachineName, MachinePlayNumber ) VALUES (
 //'"+rs.user.SerialID+"', '" +BalanceChange+"', '"+rs.machine.MachineID+"', '"+rs.machine.MachineName+"', '"+(rs.machine.MachinePlays+1)+"');");
response={status:"OK",message:"Credit added. You have " +updateBalance+" credits left."};	
		}}
		
			console.log(response);
			res.send(response);
		}
	}
  });
	}
  });
  
	});

	});


app.get('/*', function(req, res) {
  res.render("Main.ejs");
});

	app.listen(port);
    console.log('server running on port ' + port);
