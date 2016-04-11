app.controller('SearchController', function ($scope, $http, $mdDialog, $routeParams, $location) {
	$scope.users = [];
	$scope.stores = [];

	$http.get('/api.ios/public/index.php/users/find/' + $routeParams.search + '/' + USER_ID).then(function (data) {
		$scope.users = data.data.users;

		for (var i = 0; i < data.data.stores.length; i++) {
			data.data.stores[i].name = utf8.decode(data.data.stores[i].name);
			data.data.stores[i].address = utf8.decode(data.data.stores[i].address);
		};

		$scope.stores = data.data.stores;
	}, function (error) {
		console.log(error);
	});

	$scope.goUser = function (user) {
		$location.path('/usuario/' + user.id);
	}

	$scope.goStores = function (store) {
		$location.path('/store/' + store.id);	
	}
});