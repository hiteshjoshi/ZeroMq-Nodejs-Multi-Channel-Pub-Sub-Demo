exports.boot= function(io,port,zmq,pub) {

io.configure( function() {
	io.set('close timeout', 60*60*24); // 24h time out
});

function SessionController (user,channel,socketid) {
	
	//user redis hashes to store sessions
	//redis.hset(socketid,'user',user)
	//redis.hset(socketid,'channel',channel)
	
	//redis.hgetall(socketid,function (err,storage) {
	//	if(storage===null){
	//		redis.hset(socketid,'user',user)
	//		redis.hset(socketid,'channel',channel)
	//	}else{
	//		
	//	}
	//})

	
	//Below is how you SHOULD not store sessions,
	//but for this demo, lets bang!

	this.sub = zmq.socket('sub')//redis.createClient();
	this.user = user;
	this.channel = channel;
	this.sub.identity = user+':'+channel+':'+socketid;
	this.sub.connect(port,function(err){
		if(err)
			throw err;
	})
}

SessionController.prototype.subscribe = function(socket,channel) {
	this.sub.on('message', function(message) {
	
	message = String(message);
	console.log("Message received",message);
	var msg = message.substr(channel.length+1);
		socket.emit('message', JSON.parse(msg));
	});
	this.sub.subscribe(channel);
};

SessionController.prototype.unsubscribe = function() {
	this.sub.unsubscribe(this.channel);
};

SessionController.prototype.publish = function(channel,message) {
	pub.send(channel+':'+message);
};


io.sockets.on('connection', function (socket) { // the actual socket callback


	socket.on('message', function (data) { // receiving chat messages
		var msg = data//JSON.parse(data);
		socket.get('sessionController', function(err, sessionController) {
			if (sessionController === null) {
				// implicit login - socket can be timed out or disconnected
				var newSessionController = new SessionController(msg.user,msg.channel,socket.id);
				socket.set('sessionController', newSessionController);
				newSessionController.subscribe(socket, msg.channel);
			} else {
				var reply = JSON.stringify({action: 'message', user: msg.user, msg: msg.msg,type:msg.type });
				sessionController.publish(sessionController.channel,reply);
			}
		});
	});

	socket.on('join', function(data) { //data = {username,channel}
		var msg = data//JSON.parse(data);
		var sessionController = new SessionController(msg.user,msg.channel,socket.id);
		socket.set('sessionController', sessionController);
		sessionController.subscribe(socket,msg.channel);
		// just some logging to trace the chat data
		var reply = JSON.stringify({action: 'message', user: msg.user, msg: msg.msg,type:msg.type });
		sessionController.publish(sessionController.channel,reply);
		console.log(data);
	});
	
	socket.on('disconnect', function() {
		socket.get('sessionController', function(err, sessionController) {
			if (sessionController === null) return;
			sessionController.unsubscribe();
		});
	});
});

}