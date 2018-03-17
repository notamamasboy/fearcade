const fetch = require("node-fetch");
//var mapValues = require('object.map');
const express = require("express");
const app = express();
port = process.env.PORT || 56933;
 

    app.set('view engine', 'ejs');
const url1 =
  "https://supportxmr.com/api/miner/45t2ZtHLx9LDBDpTvJLJ1BiEBJr8PdjAW58PtH2Azg8XRDYtaouoVuZcHs1oFHVKKL7CqdiFr7qSdKyyuzo1s6nd4bzRgzU/chart/hashrate/FEARMiner1";
const url2 =
  "https://supportxmr.com/api/miner/45t2ZtHLx9LDBDpTvJLJ1BiEBJr8PdjAW58PtH2Azg8XRDYtaouoVuZcHs1oFHVKKL7CqdiFr7qSdKyyuzo1s6nd4bzRgzU/chart/hashrate/FEARMiner2";
const url3 =
  "https://supportxmr.com/api/miner/45t2ZtHLx9LDBDpTvJLJ1BiEBJr8PdjAW58PtH2Azg8XRDYtaouoVuZcHs1oFHVKKL7CqdiFr7qSdKyyuzo1s6nd4bzRgzU/chart/hashrate/FEARMiner3";
const url5 = "https://api.nanopool.org/v1/sia/history/6a4c5d4b2033d66b5bb69bbf5e24a2a0a47132754dddf80933e527f1d00a1713dab865b6f842"
const url4 = "https://api.nanopool.org/v1/eth/history/0xc5aeccb919c7d2928d4e5e914668485d26e45579";
  
const ETHMiner = "https://api.nanopool.org/v1/eth/user/0xc5aeccb919c7d2928d4e5e914668485d26e45579";


 var MineObject = { Miners : 
 [
 {historyurls : {xmr : url1, eth : url4, sia: url5}, name : 'FEARMiner1'},
 {historyurls : {xmr : url2}, name : 'FEARMiner2'},
 {historyurls : {xmr : url3}, name : 'FEARMiner3'}
 ]};
 var urls = [];
 var coins = [];
 var names = [];
Object.keys(MineObject.Miners).forEach(function(key,index) {
Object.keys(MineObject.Miners[index].historyurls).forEach(function(key2,index2) {
	if(this.historyurls[key2] ){
	urls.push(this.historyurls[key2])}
	
	coins.push(key2);
	names.push(this.name);
},MineObject.Miners[index]);
 });


var promises = urls.map(url => fetch(url).then(y => y.json()).then(function(json){ 

	if(json.data){
		//json.data.put("name", "Anthony");
		p = json.data[0];
		//p.name = "Anthony"
		//p.put("name","anthony");
		return p} 
	else{
		//json.put("name", "Anthony");
		p = json[0];
		//p.name = "Anthony"
		//p.put("name","anthony");
		return p};
	}));
//var jsonresults = {};

function reflect(promise){
    return promise.then(function(v){ return {v:v, status: "resolved" }},
                        function(e){ return {e:e, status: "rejected" }});
}

function refresh() {
	
	Promise.all(promises).then(results => {
	jsonresults = results;
   
   if(jsonresults){
    Object.keys(jsonresults).forEach(function(key, index) {
		


		if (jsonresults[key]){
			jsonresults[key].status = "Online"
			}
		else {
			jsonresults[key] = {};
			jsonresults[key].status = "Offline";
			}
			jsonresults[key].name = names[index] + "/" + coins[index]
			
			jsonresults[key].DateForm = jsonresults[key].date ?jsonresults[key].date : jsonresults[key].ts / 1000 
			jsonresults[key].HashRate = jsonresults[key].hashrate ? jsonresults[key].hashrate + " MH/s" : jsonresults[key].hs + " KH/s" 
			
			
			
		}
		
		);
		
        //Some other function call in callabck
        
   //console.log(jsonresults);
   

}
});
}

refresh();
	
var requestLoop = setInterval(refresh, 60000);
//refresh();
//requestLoop;


function getSongInfo(callback) {
  
    callback(jsonresults);
   }

app.get('/songinfo', function(req, res) {
  getSongInfo(function(data) {
	 
	 data2=[];
    Object.keys(data).forEach(function(key, index) {
		
		data2[key]={};
		var d = new Date(0);
		d.setUTCSeconds(data[key].DateForm);
		data2[key].DateForm = d
		data2[key].HashRate = data[key].HashRate
		
		data2[key].Name = data[key].name
		data2[key].Status = data[key].status
		//delete data[key].hs
		//delete data[key].hashrate
		//delete data[key].date
		//delete data[key].ts
		
	});
	res.render('songinfo.ejs', {data : data2});	  

  });
});

app.get('/raw-songinfo', function(req, res) {
  getSongInfo(function(data) {
	
	 data2=[];
	   Object.keys(data).forEach(function(key, index) {
		
		data2[key]={};
		var d = new Date(0);
		d.setUTCSeconds(data[key].DateForm);
		data2[key].DateForm = d
		data2[key].HashRate = data[key].HashRate
		
		data2[key].Name = data[key].name
		data2[key].Status = data[key].status
		
	});
	res.setHeader('content-type', 'application/json');
    res.send(data2);

		  
		  
	
    
  });
});


	
	app.listen(port);
    console.log('server running on port ' + port);
