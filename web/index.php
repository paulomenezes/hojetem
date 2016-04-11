<?php
	session_start();
	if (!$_SESSION['userID']) {
		header("Location:login.php");
	}
?>
<!DOCTYPE html>
<html ng-app="Achow">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />

		<title>Achow</title>

		<script type="text/javascript">
			var USER_ID = "<?php echo $_SESSION['userID'] ?>";
		</script>

		<link rel="stylesheet" href="./bower_components/angular-material/angular-material.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
		<link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
		<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700">
		<link rel="stylesheet" href="./bower_components/flexslider/flexslider.css">
		<link rel="stylesheet" href="./bower_components/angucomplete-alt/angucomplete-alt.css">
		<link rel="stylesheet" href="./bower_components/angular-loading-bar/src/loading-bar.css">
		<link rel="stylesheet" href="./bower_components/angularMultipleSelect/build/multiple-select.min.css">

		<script src="./bower_components/jquery/dist/jquery.js"></script>
		<script src="./bower_components/flexslider/jquery.flexslider.js"></script>

		<script src="./bower_components/angular/angular.min.js"></script>
		<script src="./bower_components/angular-aria/angular-aria.js"></script>
		<script src="./bower_components/angular-animate/angular-animate.js"></script>
		<script src="./bower_components/angular-material/angular-material.js"></script>
		<script src="./bower_components/angular-flexslider/angular-flexslider.js"></script>
		<script src="./bower_components/angucomplete-alt/angucomplete-alt.js"></script>
		<script src="./bower_components/angular-route/angular-route.min.js"></script>

		<script src="./bower_components/moment/moment.js"></script>
		<script src="./bower_components/moment/locale/pt-br.js"></script>

		<script src="./bower_components/utf8/utf8.js"></script>
		<script src="./bower_components/angular-loading-bar/src/loading-bar.js"></script>

		<script src="./bower_components/angularMultipleSelect/build/multiple-select.js"></script>
		
		<link rel="stylesheet/less" type="text/css" href="./css/styles.less" />

		<script type="text/javascript" src="./js/IndexController.js"></script>
		<script type="text/javascript" src="./js/StoresController.js"></script>
		<script type="text/javascript" src="./js/StoreController.js"></script>
		<script type="text/javascript" src="./js/NotificationsController.js"></script>
		<script type="text/javascript" src="./js/ContactsController.js"></script>
		<script type="text/javascript" src="./js/FavoritesController.js"></script>
		<script type="text/javascript" src="./js/AboutController.js"></script>
		<script type="text/javascript" src="./js/OrdersController.js"></script>
		<script type="text/javascript" src="./js/ChatController.js"></script>
		<script type="text/javascript" src="./js/UserController.js"></script>
		<script type="text/javascript" src="./js/SearchController.js"></script>
		<script type="text/javascript" src="./js/ShowController.js"></script>
		
		<script src="./bower_components/less/dist/less.min.js"></script>

		<script src="./bower_components/angular-scroll-glue/src/scrollglue.js"></script>

		<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.15.0/mapbox-gl.js'></script>
		<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.15.0/mapbox-gl.css' rel='stylesheet' />
	</head>
	<body ng-controller="IndexController">
		<section layout="row" flex>
			<md-sidenav
				class="md-sidenav-left"
				md-component-id="left"
				md-is-locked-open="$mdMedia('gt-sm')"
				md-disable-backdrop
				md-whiteframe="4">

				<md-content class="side-menu">
					<div class="header" style="background-image: url('{{ user.cover }}')">
						<div class="profile">
							<img ng-src="{{ !user.image ? '/images/logo-sq.png' : user.image.indexOf('http') == 0 ? user.image : '/' + user.image }}">

							<div class="name"><a href="/#/usuario/{{ user.id }}">{{ user.full_name }}</a></div>
						</div>
					</div>

					<ul>
						<li>
							<a href="/#/">
								<i class="material-icons">home</i> 
								<div>Inicio</div>
							</a>
						</li>
						<li>
							<a href="/#/notificacoes">
								<i class="material-icons">notifications</i> 
								<div>Notificações</div>
							</a>
						</li>
						<li>
							<a href="/#/contatos">
								<i class="material-icons">group</i> 
								<div>Contatos</div>
							</a>
						</li>
						<li>
							<a href="/#/chat">
								<i class="material-icons">chat</i> 
								<div>Bate papo</div>
							</a>
						</li>
						<li>
							<a href="/#/favoritos">
								<i class="material-icons">star</i> 
								<div>Favoritos</div>
							</a>
						</li>
						<li>
							<a href="/#/pedidos">
								<i class="material-icons">shopping_cart</i> 
								<div>Meus pedidos</div>
							</a>
						</li>
						<li>
							<a href="/#/sobre">
								<i class="material-icons">info</i> 
								<div>Sobre</div>
							</a>
						</li>
						<li>
							<a href="/login.php?ac=logout">
								<i class="material-icons">exit_to_app</i> 
								<div>Sair</div>
							</a>
						</li>
					</ul>
				</md-content>
			</md-sidenav>

			<md-content class="md-content" flex>
				<div layout="column" layout-fill layout-align="top center">
					<div class="toolbar">
						<div class="top">
							<div class="content">
								<div class="logo"><a href="/#/"><img src="./images/logo.png"></a></div>
								<div class="search hide-xs hide-sm">
									<form ng-submit="sendSearch()" method="POST">
										<md-input-container md-no-float class="md-block">
											<input type="text" ng-model="search" placeholder="Digite sua busca">
										</md-input-container>
									</form>
								</div>
								<div class="menu icon hide show-xs show-sm" ng-click="openNav()">
									<i class="material-icons">{{ openMenu ? 'close' : 'menu' }}</i>
								</div>
							</div>
						</div>
					</div>
					<div ng-view class="md-padding" style="width: 100%; min-height: 600px;"></div>
					<div class="footer">
						<div class="content">
							<div class="fb-page" data-href="https://www.facebook.com/Achowpag?fref=ts&amp;ref=br_tf" data-width="500" data-hide-cover="false" data-show-facepile="true" data-show-posts="false"><div class="fb-xfbml-parse-ignore"><blockquote cite="https://www.facebook.com/Achowpag?fref=ts&amp;ref=br_tf"><a href="https://www.facebook.com/Achowpag?fref=ts&amp;ref=br_tf">Achow</a></blockquote></div></div>
							<ul>
								
							</ul>
						</div>
					</div>
					<div class="copyright">
						<div class="content">
							Desenvolvido por <a href="mailto:paulo.hgmenezes@gmail.com">Paulo Menezes</a>
						</div>
					</div>
				</div>
			</md-content>
		</section>

		<div id="fb-root"></div>
		<script>(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.5&appId=755278891254890";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));</script>
	</body>
</html>