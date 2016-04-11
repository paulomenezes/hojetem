app.controller('NotificationsController', function ($scope, $http, $mdDialog, $routeParams, $location) {
	$scope.notifications = [];

	$http.get('/api.ios/public/index.php/notifications/' + USER_ID + '/read').then(function (data) {
		for (var i = 0; i < data.data.notifications.length; i++) {
			data.data.notifications[i].storeName = utf8.decode(data.data.notifications[i].storeName);
		};

		$scope.notifications = data.data.notifications;
	}, function (error) {
		console.log(error);
	});

	$scope.goStore = function (store) {
		$location.path('/store/' + store.idStore);
	}
});