app.controller('ShowController', function ($scope, $rootScope, $http, $mdDialog, $routeParams, $location, 
											$mdToast, $mdDialog) {
	$scope.store = {};
	$scope.images = [];
	$scope.menu = [];
	$scope.schedule = [];
	$scope.comments = [];
	$scope.stores = [];

	$scope.likes = [];
	$scope.confirms = [];

	$scope.newComment = {
		message: '',
		idStore: $routeParams.id,
		idAccount: USER_ID
	};

	$scope.sendComment = function () {
		$http.post('/api/public/index.php/store_comment', $scope.newComment).then(function (data) {
			var newComment = {
				"id": data.data.id,
				"idStore": $scope.newComment.idStore,
				"idShows": null,
				"idAccount": USER_ID,
				"date": new Date(),
				"message": $scope.newComment.message,
				"name": $rootScope.user.name,
				"lastname": $rootScope.user.lastname,
				"image": $rootScope.user.image
			};

			$scope.comments.unshift(newComment);
			$scope.newComment.message = '';
		}, function (error) {
			console.log(error);
		});
	};

	$scope.dayOfWeeks = [ 'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado' ];

	$scope.favorite = function () {
		var fav = {
			idAccount: USER_ID,
			idStore: $routeParams.id,
			idVisitedType: 5,
		};

		$http.post('/api/public/index.php/store_visited', fav).then(function (data) {
			if (data.data.removed) {
				$mdToast.show($mdToast.simple().textContent('Estabelecimento removido dos favoritos'));
			} else {
				$mdToast.show($mdToast.simple().textContent('Estabelecimento adicionado dos favoritos'));
			}
		}, function (error) {
			console.log(error);
		});
	};

	$scope.meeting = function () {
		$mdDialog.show({
				controller: function ($scope, $mdDialog) {
					$scope.friends = [];
					$scope.meeting = {
						users: [],
						message: ''
					};

					$http.get('/api.ios/public/index.php/users/' + $rootScope.user.id + '/friends2').then(function (data) {
						$scope.friends = data.data;
					});

					$scope.hide = function() {
						$mdDialog.hide();
					};
					
					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.share = function () {
						var users = '';
						for (var i = 0; i < $scope.meeting.users.length; i++) {
							users += $scope.meeting.users[i].id + ', ';
						};

						var checkin = {
							idAccount: USER_ID,
							idShows: $routeParams.id,
							message: $scope.meeting.message,
							users: users
						}

						$http.post('/api/public/index.php/stores/checkin', checkin).then(function (data) {
							$mdToast.show($mdToast.simple().textContent('Encontro marcado com sucesso.'));

							$mdDialog.cancel();
						}, function (error) {
							console.log(error);
							$mdToast.show($mdToast.simple().textContent('Houve um error ao se conectar ao servidor'));
						});
					}
				},
				templateUrl: 'templates/dialog_meeting.html',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			})
			.then(function(answer) {
				
			}, function() {
				
			});
	};

	$scope.like = function () {
		var fav = {
			idAccount: USER_ID,
			idShows: $routeParams.id,
			idVisitedType: 1,
		};

		$http.post('/api/public/index.php/store_visited', fav).then(function (data) {
			if (data.data.failed) {
				$mdToast.show($mdToast.simple().textContent('Você já marcou como gostei esse evento'));
			} else {
				$mdToast.show($mdToast.simple().textContent('Obrigado!'));
			}
		}, function (error) {
			console.log(error);
		});
	};

	$scope.here = function () {
		var fav = {
			idAccount: USER_ID,
			idShows: $routeParams.id,
			idVisitedType: 2,
		};

		$http.post('/api/public/index.php/store_visited', fav).then(function (data) {
			if (data.data.id) {
				$mdToast.show($mdToast.simple().textContent('Você confirmou sua participação'));
			} else {
				$mdToast.show($mdToast.simple().textContent('Você já confirmou participação.'));
			}
		}, function (error) {
			console.log(error);
		});
	};

	$http.get('/api.ios/public/index.php/ads/shows/' + $routeParams.id).then(function (data) {
		data.data.name = utf8.decode(data.data.name);
		data.data.address = utf8.decode(data.data.address);
		if (data.data.description)
			data.data.description = utf8.decode(data.data.description);

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

		$http.get('/api.ios/public/index.php/store_comment/shows/' + $routeParams.id).then(function (data) {
			$scope.comments = data.data;
		});

		$http.get('/api.ios/public/index.php/store_visited/shows/' + USER_ID + '/1/' + $routeParams.id).then(function (data) {
			$scope.likes = data.data.accounts;
		});

		$http.get('/api.ios/public/index.php/store_visited/shows/' + USER_ID + '/2/' + $routeParams.id).then(function (data) {
			$scope.confirms = data.data.accounts;
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

	$scope.goUser = function (user) {
		$location.path('/usuario/' + user.id);
	}
});