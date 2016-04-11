var app = angular.module('Achow', ['ngMaterial', 'angular-flexslider', 'ngRoute', 'angucomplete-alt', 'luegg.directives', 'angular-loading-bar', 'multipleSelect']);

app.config(['$mdThemingProvider', '$routeProvider', function ($mdThemingProvider, $routeProvider) {
	$mdThemingProvider.theme('default').primaryPalette('blue').accentPalette('blue-grey');

	$routeProvider
		.when('/', {
			templateUrl: 'templates/home.html',
			controller: 'IndexController'
		})
		.when('/usuario/:id', {
			templateUrl: 'templates/user.html',
			controller: 'UserController'
		})
		.when('/shows/:id', {
			templateUrl: 'templates/show.html',
			controller: 'ShowController'
		})
		.when('/buscar/:search', {
			templateUrl: 'templates/search.html',
			controller: 'SearchController'
		})
		.when('/store/:id', {
			templateUrl: 'templates/store.html',
			controller: 'StoreController'
		})
		.when('/:type/:sub', {
			templateUrl: 'templates/stores.html',
			controller: 'StoresController'
		})
		.when('/notificacoes', {
			templateUrl: 'templates/notifications.html',
			controller: 'NotificationsController'
		})
		.when('/contatos', {
			templateUrl: 'templates/contacts.html',
			controller: 'ContactsController'
		})
		.when('/favoritos', {
			templateUrl: 'templates/favorites.html',
			controller: 'FavoritesController'
		})
		.when('/sobre', {
			templateUrl: 'templates/about.html',
			controller: 'AboutController'
		})
		.when('/pedidos', {
			templateUrl: 'templates/orders.html',
			controller: 'OrdersController'
		})
		.when('/chat', {
			templateUrl: 'templates/chat.html',
			controller: 'ChatController',
			resolve: {
				action: function () {
					return 'index'
				}
			}
		})
		.when('/chat/s/:id', {
			templateUrl: 'templates/chatGroup.html',
			controller: 'ChatController',
			resolve: {
				action: function () {
					return 'room'
				}
			}
		})
		.when('/chat/f/:id', {
			templateUrl: 'templates/chatGroup.html',
			controller: 'ChatController',
			resolve: {
				action: function () {
					return 'friends'
				}
			}
		});
}]);

app.run(function ($rootScope, $http) {
	$http.get('/api.ios/public/index.php/users/' + USER_ID).then(function (data) {
		$rootScope.user = data.data;
	}, function (error) {
		console.log(error);
	});
});

app.controller('IndexController', function ($scope, $rootScope, $http, $mdDialog, $location, $mdSidenav) {
	$scope.openMenu = false;
	$scope.banners = [];
	$scope.shows = [];

	$scope.itens = [
		{
			id: 1,
			title: 'Onde Comer',
			image: 'ondecomer',
			icon: 'android-restaurant'
		}, {
			id: 2,
			title: 'Onde Comprar',
			image: 'ondecomprar',
			icon: 'bag'
		}, {
			id: 3,
			title: 'Onde Curtir',
			image: 'ondecurtir',
			icon: 'beer'
		}, {
			id: 4,
			title: 'Onde Ficar',
			image: 'diversos',
			icon: 'home'
		}, {
			id: 5,
			title: 'Saúde',
			image: 'saude',
			icon: 'medkit'
		}, {
			id: 6,
			title: 'Estética e Beleza',
			image: 'esteticasebeleza',
			icon: 'tshirt'
		}, {
			id: 7,
			title: 'Animais',
			image: 'animais',
			icon: 'ios-paw'
		}, {
			id: 9,
			title: 'Autos e Transportes',
			image: 'autosetransportes',
			icon: 'android-car'
		}, {
			id: 10,
			title: 'Serviços Públicos e Telefones Úteis',
			image: 'servicospublicosetelefonesuteis',
			icon: 'ios-telephone'
		}, {
			id: 11,
			title: 'Prestadores de Serviços',
			image: 'prestadoresdeservicos',
			icon: 'wrench'
		}, {
			id: 12,
			title: 'Shopping',
			image: 'shopping',
			icon: 'ios-cart'
		}, {
			id: 13,
			title: 'Educação',
			image: 'educacao',
			icon: 'university'
		}, {
			id: 14,
			title: 'Classificados',
			image: 'classificados',
			icon: 'document-text'
		}, {
			id: 15,
			title: 'Casa e Construção',
			image: 'casaeconstrucao',
			icon: 'ios-home'
		}
	];

	$scope.openNav = function () {
		$mdSidenav('left').toggle();
	}

	$scope.search = '';
	$scope.sendSearch = function () {
		$location.path('/buscar/' + $scope.search);
	}

	$http.get('/api.ios/public/index.php/ads/banners').then(function (data) {
		$scope.banners = data.data;
	}, function (error) {
		console.log(error);
	});

	$http.get('/api.ios/public/index.php/ads/shows').then(function (data) {
		$scope.shows = data.data;
	}, function (error) {
		console.log(error);
	});

	$scope.openShow = function (item) {
		$location.path('/shows/' + item.id);
	};

	$scope.openItem = function (item, ev) {
		$http.get('/api.ios/public/index.php/sub_types/get/' + item.id).then(function (data) {
			for (var i = 0; i < data.data.length; i++) {
				data.data[i].name = utf8.decode(data.data[i].name);
			};

			$mdDialog.show({
					controller: function ($scope, $mdDialog) {
						$scope.title = item.title;
						$scope.itens = data.data;

						$scope.hide = function() {
							$mdDialog.hide();
						};
						
						$scope.cancel = function() {
							$mdDialog.cancel();
						};

						$scope.close = function(option) {
							$mdDialog.hide(option);
						};
					},
					templateUrl: 'templates/dialog_category.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true
				})
				.then(function(option) {
					$location.path('/' + option.Store_Type_id + '/' + option.id);
				});
		}, function (error) {
			console.log(error);
		});
	}
});