var  zmq = require('zmq')
	,port = 'tcp://127.0.0.1:6785'
	,pub = zmq.socket('pub')
	,express = require('express')
	,app = express()
	,server = require('http').createServer(app)
	,io = require('socket.io').listen(server)

	//use redis to store sessions!
	//,redis = require("redis")
    //,client = redis.createClient();
	
	
	//bind publish port
	pub.bind(port,function(err){
	if(err)
		throw err;
		})

require('./websockets.start.js').boot(io,port,zmq,pub);




		app.get('/',function(req,res) {
			res.sendfile('app/index.html');
		})
		
		app.configure(function(){
		app.use(express.static(__dirname + '/app'));
		});
	

	server.listen(8888);