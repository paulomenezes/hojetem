app.controller('StoresController', function ($scope, $http, $mdDialog, $routeParams, $location) {
	$scope.stores = [];
	$scope.type = '';
	$scope.sub = '';

	$http.get('/api.ios/public/index.php/sub_types/name/' + $routeParams.type + '/' + $routeParams.sub).then(function (data) {
		$scope.type = data.data.type;
		$scope.sub = data.data.sub;
	}, function (error) {
		console.log(error);
	});

	$http.get('/api.ios/public/index.php/stores/' + $routeParams.type + '/Porto Feliz/' + $routeParams.sub).then(function (data) {
		for (var i = 0; i < data.data.length; i++) {
			data.data[i].name = utf8.decode(data.data[i].name);
			data.data[i].address = utf8.decode(data.data[i].address);
		};

		$scope.stores = data.data;
	}, function (error) {
		
	});

	$scope.goStore = function (store) {
		$location.path('/store/' + store.id);
	}
});