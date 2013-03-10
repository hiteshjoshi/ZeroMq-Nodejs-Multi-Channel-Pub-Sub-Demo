'use strict';

/* Controllers */



function MyCtrl1($scope){

	jQuery("textarea#live_notes").bind('keyup',function()
	{ 
	
	if(((new Date()).getTime()-$scope.last_publish > 10000) && $scope.socket!=null){
		$scope.socket.emit('message',{user:$scope.userName,channel:$scope.roomId,type:'note',msg:$scope.live_notes});
		//$scope.last_publish = (new Date()).getTime();
	}
	 })
	 
	 jQuery("input#current_url").bind('keyup',function() {
		 if(((new Date()).getTime()-$scope.last_publish > 10000) && $scope.socket!=null)
		 $scope.socket.emit('message',{user:$scope.userName,channel:$scope.roomId,type:'url',msg:$scope.current_url});
	 })
	
	$scope.roomId = null;
	$scope.last_publish = (new Date()).getTime();
	$scope.userName = null;
	$scope.feeds = [];
	$scope.note = null;
	$scope.comments = [];
	$scope.socket = null;
	$scope.live_notes = null;
	$scope.current_url = null;
	$scope.add_comment = function() {
		if($scope.socket){
			$scope.socket.emit('message',{user:$scope.userName,channel:$scope.roomId,type:'feed',msg:$scope.userName+' added a new comment'});
			$scope.socket.emit('message',{user:$scope.userName,channel:$scope.roomId,type:'comment',msg:$scope.new_comment});
			
		}
	}
	
	
	$scope.start_live_share = function() {
		if($scope.socket===null)
		 	$scope.socket = io.connect('');
		
		$scope.socket.emit('join',{user:$scope.userName,channel:$scope.roomId,type:'feed',msg:$scope.userName+' joined the session'});
		
		$scope.socket.on('message',function(data){
		console.log(data);
			switch(data.type){
				case 'feed':
					$scope.feeds.push(data.msg);
					$scope.$apply();
				break;
				case 'comment':
					$scope.comments.push(data.msg);
					$scope.$apply();
				break;
				case 'note':
					$scope.live_notes = (data.msg);
					$scope.$apply();
				break;	
				case 'url':
					$scope.current_url = (data.msg);
					$scope.$apply();
				break;	
							
			}
			})
		//socket.emit('message',{msg:"s",channel:'new_1'})
	}
}
MyCtrl1.$inject = ['$scope'];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
