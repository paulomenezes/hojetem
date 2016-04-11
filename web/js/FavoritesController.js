app.controller('FavoritesController', function ($scope, $http, $mdDialog, $routeParams, $location) {
	$scope.stores = [];

	$http.get('/api.ios/public/index.php/store_visited/' + USER_ID + '/favorite').then(function (data) {
		for (var i = 0; i < data.data.length; i++) {
			data.data[i].name = utf8.decode(data.data[i].name);
			data.data[i].address = utf8.decode(data.data[i].address);
		};
		
		$scope.stores = data.data;
	}, function (error) {
		console.log(error);
	});

	$scope.goStore = function (store) {
		$location.path('/store/' + store.id);
	}
});