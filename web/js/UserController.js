app.controller('UserController', function ($scope, $http, $mdDialog, $routeParams, $location) {
	$scope.user = {};
	$scope.checkins = [];
	$scope.friends = [];

	$scope.friendship = {};

	$http.get('/api.ios/public/index.php/users/' + $routeParams.id).then(function (data) {
		$scope.user = data.data;

		$http.get('/api.ios/public/index.php/users/' + $routeParams.id + '/friends2').then(function (data) {
			$scope.friends = data.data;
		}, function (error) {
			console.log(error);
		});

		$http.get('/api.ios/public/index.php/users/' + $routeParams.id + '/checkins').then(function (data) {
			$scope.checkins = data.data;
		}, function (error) {
			console.log(error);
		});

		if (USER_ID !== $routeParams.id) {
			$http.get('/api.ios/public/index.php/users/' + USER_ID + '/and/' + $routeParams.id).then(function (data) {
				$scope.friendship = data.data;
			}, function (error) {
				console.log(error);
			});
		} else {
			$scope.friendship = false;
		}
	}, function (error) {
		console.log(error);
	});

	$scope.goStore = function (store) {
		$location.path('/store/' + store.id);
	}

	$scope.goUser = function (user) {
		$location.path('/usuario/' + user.id);
	}

	$scope.add = function () {
		var request = {
			idAccount1: USER_ID,
			idAccount2: $scope.user.id
		};

		$http.post('/api/public/index.php/users/requests', request).then(function (data) {
			$scope.friendship.request = data.data;
		}, function (error) {
			console.log(error);
		});
	}

	$scope.remove = function () {
		$http.get('/api.ios/public/index.php/users/' + $scope.friendship.friends.id + '/delete/friend').then(function (data) {
			$scope.friendship.friends = null;
		}, function (error) {
			console.log(error);
		});
	}

	$scope.chat = function () {
		$location.path('/chat/f/' + $scope.friendship.friends.id);
	}
});