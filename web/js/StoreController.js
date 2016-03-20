app.controller('StoreController', function ($scope, $http, $mdDialog, $routeParams, $location) {
	$scope.store = {};
	$scope.images = [];
	$scope.menu = [];
	$scope.schedule = [];
	$scope.comments = [];
	$scope.stores = [];

	$scope.newComment = {
		message: '',
		idStore: $routeParams.id,
		idAccount: 38
	};

	$scope.sendComment = function () {
		console.log($scope.newComment);	

		$http.post('/api/public/index.php/store_comment', $scope.newComment).then(function (data) {
			$scope.newComment.message = '';
		}, function (error) {
			console.log(error);
		});
	};

	$scope.dayOfWeeks = [ 'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado' ];

	$http.get('/api.ios/public/index.php/stores/get/' + $routeParams.id).then(function (data) {
		$scope.store = data.data;

		if ($scope.store.image) {
			$scope.images.push($scope.store.image);
		}
		if ($scope.store.image1) {
			$scope.images.push($scope.store.image1);
		}
		if ($scope.store.image2) {
			$scope.images.push($scope.store.image2);
		}
		if ($scope.store.image3) {
			$scope.images.push($scope.store.image3);
		}

		$http.get('/api.ios/public/index.php/stores/' + $routeParams.id + '/menu').then(function (data) {
			var menu = data.data;
			var newMenu = [];
			var lastType = '';
			var lastTypeIndex = 0;

			for (var i = 0; i < menu.length; i++) {
				menu[i].selected = false;
				menu[i].quantity = 1;

				if (i == 0) {
					newMenu.push({
						type: menu[0].type,
						open: true,
						items: []
					});

					newMenu[0].items.push(menu[0]);

					lastType = menu[0].type;
					lastTypeIndex = 0;
				} else {
					if (lastType === menu[i].type) {
						newMenu[lastTypeIndex].items.push(menu[i]);
					} else {
						newMenu.push({
							type: menu[i].type,
							open: false,
							items: []
						});

						newMenu[i].items.push(menu[i]);

						lastType = menu[i].type;
						lastTypeIndex = i;
					}
				}
			};

			$scope.menu = newMenu;
		});

		$http.get('/api.ios/public/index.php/stores/' + $routeParams.id + '/schedule').then(function (data) {
			$scope.schedule = data.data;
		});

		$http.get('/api.ios/public/index.php/store_comment/' + $routeParams.id).then(function (data) {
			$scope.comments = data.data;
		});

		$http.get('/api.ios/public/index.php/stores/' + $scope.store.idStoreType + '/Porto Feliz/' + $scope.store.subtype.split(',')[1].trim()).then(function (data) {
			var s = [];

			for (var i = 0; i < (data.data.length > 5 ? 5 : data.data.length); i++) {
				if (data.data[i].id != $scope.store.id) {
					s.push(data.data[i]);
				}
			};

			$scope.stores = s;
		});

		mapboxgl.accessToken = 'pk.eyJ1IjoicGF1bG9tZW5lemVzIiwiYSI6ImNpbHFrMzNyMTA4aG50c20xZTFta3k2cm0ifQ.s8g3A0_UXhqPV-nH3pXnPw';
		var map = new mapboxgl.Map({
			container: 'map', // container id
			style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
			center: [$scope.store.longitude, $scope.store.lat], // starting position
			zoom: 13 // starting zoom
		});

		map.on('style.load', function () {
			// add geojson data as a new source
			map.addSource("symbols", {
				"type": "geojson",
				"data": {
					"type": "FeatureCollection",
					"features": [
						{
							"type": "Feature",
							"properties": {},
							"geometry": {
								"type": "Point",
								"coordinates": [
									$scope.store.longitude,
									$scope.store.lat
								]
							}
						}
					]
				}
			});

			// add source as a layer and apply some styles
			map.addLayer({
				"id": "symbols",
				"interactive": true,
				"type": "symbol",
				"source": "symbols",
				"layout": {
					"icon-image": "marker-15"
				},
				"paint": {}
			});
		});
	}, function (error) {
		console.log(error);
	});

	$scope.goStore = function (store) {
		$location.path('/store/' + store.id);
	}
});