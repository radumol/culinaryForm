//Author: Radu Molea


var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');
const ROOT = "./public_html";

// create http server
var server = http.createServer(handleRequest); //already async
server.listen(2406);

console.log('Server listening on port 2406');

function handleRequest(req, res) {
	
	console.log(req.method+ " request for: " + req.url);
	
	var urlObj = url.parse(req.url, true);
	var filename = ROOT+urlObj.pathname;
	console.log(filename);
	if (urlObj.pathname === "/recipes/"){
		if(req.method==="GET"){
			//client wants the specifi json object recipe
			fs.readdir(filename, function(err, items) {
				//console.log(items);
				//console.log(JSON.stringify(items));
				//filename = ".json"; 
				respond(200, JSON.stringify(items));
			});	 
		}
		if(req.method==="POST"){
			//client sends the contents of a new recipe so we create this json
			console.log("we got here");
			var postBody="";
			req.setEncoding('utf8');
			req.on('data',function(chunk){			
				postBody+=chunk; //data is read as buffer objects
				//console.log("chunk: "+postBody);
			});
			req.on('end',function(){
				//console.log("post body: "+postBody);
				var splited = postBody.split("{");
				console.log("First of split: " + splited[0]);
				fs.writeFileSync(ROOT + "/recipes/"+splited[0], "{"+splited[1]);
				//var client = JSON.parse(postBody);
				
				respond(200);
			});
		}
	}else{
		var stats = fs.stat(filename, function(err, stats){
			if(err){
				server404();
			}else if(stats.isDirectory()){
				fs.readdir(filename, function(err, files){
					if(err) serve404();
					else respond (200, files.join("<br/>"));
				});
			}else{
				fs.readFile(filename, "utf8", function(err, data){
					if(err)serve404();
					else respond(200, data);
				});
			}
		});
	}
	
	//locally defined helper function that serves 404 files
	function server404(){
		fs.readFile(ROOT+"/404.html", "utf8", function(err, data){
			if(err)respondErr(err);
			else respond(404, data);
		});
	}
	
	//responds in error, and outputs to the console
	function respondErr(err){
		respond(500, null);
		console.error(err.stack);
	}
	
	//sends off the response message
	function respond(code, data){
		//content header
		res.writeHead(code, {'content-type': mime.lookup(filename)||'text/html'});
		//write message and signal communication is complete
		res.end(data);
	}
	function readFiles(dirname, onFileContent, onError) {
	  fs.readdir(dirname, function(err, filenames) {
		if (err) {
		  onError(err);
		  return;
		}
		filenames.forEach(function(filename) {
		  fs.readFile(dirname + filename, 'utf-8', function(err, content) {
			if (err) {
			  onError(err);
			  return;
			}
			onFileContent(filename, content);
		  });
		});
	  });
	}	
}; //end handle request
