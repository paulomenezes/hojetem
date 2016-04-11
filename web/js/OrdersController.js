app.controller('OrdersController', function ($scope, $http, $mdDialog, $routeParams, $location) {
	$scope.orders = [];

	$http.get('/api.ios/public/index.php/order/' + USER_ID).then(function (data) {
		for (var i = 0; i < data.data.length; i++) {
			var total = 0;
			for (var j = 0; j < data.data[i].itens.length; j++) {
				total += parseFloat(data.data[i].itens[j].price);
			};

			data.data[i].price = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			data.data[i].date = new Date(data.data[i].date);
		};

		$scope.orders = data.data;
	}, function (error) {
		console.log(error);
	});
});