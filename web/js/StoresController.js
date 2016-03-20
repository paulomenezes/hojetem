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
		$scope.stores = data.data;
	}, function (error) {
		
	});

	$scope.goStore = function (store) {
		$location.path('/store/' + store.id);
	}
});