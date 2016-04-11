app.controller('ContactsController', function ($scope, $http, $mdDialog, $routeParams, $location) {
	$scope.friends = [];
	$scope.requests = [];

	$http.get('/api.ios/public/index.php/users/' + USER_ID + '/friends2').then(function (data) {
		$scope.friends = data.data;
	}, function (error) {
		console.log(error);
	});

	$http.get('/api.ios/public/index.php/users/' + USER_ID + '/requests').then(function (data) {
		$scope.requests = data.data;
	}, function (error) {
		console.log(error);
	});

	$scope.accept = function (request, index) {
		var req = {
			idAccount1: request.idAccount1,
			idAccount2: request.idAccount2,
		};
		
		$http.post('/api/public/index.php/users/' + request.IDRequest + '/requests/aceitar', req).then(function (data) {
			$scope.friends.push(request);
			$scope.requests.splice(index, 1);
		}, function (error) {
			console.log(error);
		});
	};

	$scope.reject = function (request, index) {
		$http.get('/api.ios/public/index.php/users/' + request.IDRequest + '/requests/recusar').then(function (data) {
			$scope.requests.splice(index, 1);
		}, function (error) {
			console.log(error);
		});	
	};

	$scope.goUser = function (user) {
		$location.path('/usuario/' + user.id);
	}
});