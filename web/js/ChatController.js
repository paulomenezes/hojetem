app.controller('ChatController', function ($scope, $rootScope, $http, $mdDialog, $routeParams, $location, action, $interval) {
	$scope.USER_ID = USER_ID;
	$scope.action = action;

	if (action && action == 'room') {
		$scope.chats = [];

		load();
		$scope.loadInterval = $interval(function () {
			load();
		}, 1000);

		$scope.$on('$destroy', function () {
			$interval.cancel($scope.loadInterval);
		});

		function load () {
			$http.get('/api.ios/public/index.php/chat/room/' + $routeParams.id).then(function (data) {
				for (var i = 0; i < data.data.length; i++) {
					var date = data.data[i].date ? moment(data.data[i].date, "YYYY-MM-DD HH:mm:ss").fromNow() : 'agora';
					data.data[i].date = date;
				};
				$scope.chats = data.data;
			}, function (error) {
				
			});
		}

		$scope.newMsg = {
			text: '',
			iduser: USER_ID,
			idroom: $routeParams.id
		};

		$scope.send = function () {
			$http.post('/api/public/index.php/chat', $scope.newMsg).then(function (data) {
				var add = {
					id: data.data.id,
					text: $scope.newMsg.text,
					iduser: $scope.newMsg.iduser,
					idroom: $scope.newMsg.idroom, 
					image: $rootScope.user.image,
					date: 'agora'
				};

				$scope.chats.push(add);

				$scope.newMsg.text = '';
			}, function (error) {
				
			});
		};

		$scope.sendKey = function (event) {
			if (event.which == 13 && $scope.newMsg.text.length > 0) {
				$scope.send();
			}
		}
	} else if (action && action == 'friends') {
		$scope.chats = [];

		load();
		$scope.loadInterval = $interval(function () {
			load();
		}, 1000);

		$scope.$on('$destroy', function () {
			$interval.cancel($scope.loadInterval);
		});

		function load () {
			$http.get('/api.ios/public/index.php/chat/' + $routeParams.id).then(function (data) {
				for (var i = 0; i < data.data.length; i++) {
					var date = data.data[i].date ? moment(data.data[i].date, "YYYY-MM-DD HH:mm:ss").fromNow() : 'agora';
					data.data[i].date = date;
				};
				$scope.chats = data.data;
			}, function (error) {
				
			});
		}

		$scope.newMsg = {
			text: '',
			iduser: USER_ID,
			idchat: $routeParams.id
		};

		$scope.send = function () {
			$http.post('/api/public/index.php/chat', $scope.newMsg).then(function (data) {
				var add = {
					id: data.data.id,
					text: $scope.newMsg.text,
					iduser: $scope.newMsg.iduser,
					idchat: $routeParams.id, 
					image: $rootScope.user.image,
					date: 'agora'
				};

				$scope.chats.push(add);

				$scope.newMsg.text = '';
			}, function (error) {
				
			});
		};

		$scope.sendKey = function (event) {
			if (event.which == 13 && $scope.newMsg.text.length > 0) {
				$scope.send();
			}
		}
	} else {
		$scope.chats = [];

		$http.get('/api.ios/public/index.php/chat/rooms/' + USER_ID).then(function (data) {
			for (var i = 0; i < data.data.rooms.length; i++) {
				if (data.data.rooms[i].type == 'Pública' || data.data.rooms[i].idAccount == USER_ID) {
					$scope.chats.push(data.data.rooms[i]);
				} else {
					for (var j = 0; j < data.data.members.length; j++) {
						if (data.data.rooms[i].id == data.data.members[j].idRoom && data.data.members[j].accept == 1) {
							$scope.chats.push(data.data.rooms[i]);	
						}
					};
				}
			};
			
		}, function (error) {
			
		});
	}
});