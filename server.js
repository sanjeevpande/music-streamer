var express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	app = express(),
	port = process.env.port || 3000,
	path = require('path'),
	fs = require('fs');

app.use(bodyParser.urlencoded({extented : true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('./app'));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, './app', 'index.html'));
});

app.post('/getfiles', function(req, res){
	res.json({
		message : "files...",
		data : req.body
	});
});

app.get('/getimage', function(req, res){
	res.sendFile(path.join(__dirname, './app/images', 'nodejs.png'));
});

app.get('/getsongs', function(req, res){

	var dir = getUserHome() + '/files';

	fs.readdir(dir, function (err, files) {
	    if (err) {
	    	console.log(err.path + " doesn't exists.");
	        throw err;
	    }

	    var songname = [],
	    	songpath = [];

	    for(var i in files) {
	    	var file = path.join(dir, files[i]);
		   	if(fs.statSync(file).isFile() && (path.extname(file) === ".mp3")) {
		    	songname.push(path.basename(file));
		    	songpath.push(file);
		   	}
		}

		console.log(songname);

		res.json({
			message : "files...",
			songname : songname,
			songpath : songpath
		});
	});
});

var child;

app.post('/playsong', function(req, res){

	var songname = req.body.songname,
		songpath = req.body.songpath;

	console.log("aaaaaaa : " + songname + "  " + songpath);
	
	var sys = require('sys')
	var exec = require('child_process').exec;
	
	if(child){
		var child1;
		child1 = exec("pkill vlc", function (error, stdout, stderr) {
		  sys.print('stdout: ' + stdout);
		  sys.print('stderr: ' + stderr);
		  if (error !== null) {
		    console.log('exec error: ' + error);
		  }
		});	
	}
	child = exec('cvlc ' + '"' + songpath + '"', function (error, stdout, stderr) {
	  sys.print('stdout: ' + stdout);
	  sys.print('stderr: ' + stderr);
	  if (error !== null) {
	    console.log('exec error: ' + error);
	  }
	});


	res.json({
		message : "files...",
		data : req.body
	});
});

app.get('/streamaudio', function(req, res){

	res.sendFile(req.query.songpath);

});

process.on('uncaughtException', function(err){
	console.log(err);
});

app.listen(port, function(){
	console.log("Server listening on port : " + port);
});

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// var dir = getUserHome() + '/files';

// fs.readdir(dir, function (err, files) {
//     if (err) {
//     	console.log(err.path + " doesn't exists.");
//         throw err;
//     }

//     var songList = [];

//     for(var i in files) {
//     	var file = path.join(dir, files[i]);
// 	   	if(fs.statSync(file).isFile() && (path.extname(file) === ".mp3")) {
// 	    	songList.push(path.basename(file));
// 	   	}
// 	}

// 	console.log(songList);

//     /*files.map(function (file) {
//     	return path.join(dir, file);
//     }).filter(function (file) {
//     	return fs.statSync(file).isFile();
//     }).forEach(function (file) {
//     	//console.log("zz "+path.basename(file));
//     	console.log("%s%s", file, path.extname(file));
//     });
// });*/