<?php
    include('connect.php');

    if ($_GET['ac'] == 'logout') {
		session_destroy();
		$_SESSION['userID'] = null;
		$_SESSION = array();
		unset($_SESSION);

		header("Location:/login.php");
    }

    if ($_SESSION['userID']) {
        header("Location:");
    }

    require_once( 'Facebook/HttpClients/FacebookHttpable.php' );
    require_once( 'Facebook/HttpClients/FacebookCurl.php' );
    require_once( 'Facebook/HttpClients/FacebookCurlHttpClient.php' );

    use Facebook\HttpClients\FacebookHttpable;
    use Facebook\HttpClients\FacebookCurl;
    use Facebook\HttpClients\FacebookCurlHttpClient;

    require_once( 'Facebook/FacebookSession.php' );
    require_once( 'Facebook/FacebookRedirectLoginHelper.php' );
    require_once( 'Facebook/FacebookRequest.php' );
    require_once( 'Facebook/FacebookResponse.php' );
    require_once( 'Facebook/FacebookSDKException.php' );
    require_once( 'Facebook/FacebookRequestException.php' );
    require_once( 'Facebook/FacebookAuthorizationException.php' );
    require_once( 'Facebook/GraphObject.php' );
    require_once( 'Facebook/Entities/AccessToken.php' );
     
    use Facebook\FacebookSession;
    use Facebook\FacebookRedirectLoginHelper;
    use Facebook\FacebookRequest;
    use Facebook\FacebookResponse;
    use Facebook\FacebookSDKException;
    use Facebook\FacebookRequestException;
    use Facebook\FacebookAuthorizationException;
    use Facebook\GraphObject;

    FacebookSession::setDefaultApplication('755278891254890', '848c46a242092f2d1b40149cf982a7e0');

    // login helper with redirect_uri
    $helper = new FacebookRedirectLoginHelper( 'http://www.achow.com.br/login.php' );
     
    try {
        $session = $helper->getSessionFromRedirect();
    } catch( FacebookRequestException $ex ) {
        // When Facebook returns an error
    } catch( Exception $ex ) {
        // When validation fails or other local issues
    }

    if ($_POST) {
        if ($_POST['type']) {
            $name = $_POST['first_name'];
            $last_name = $_POST['last_name'];
            $email = $_POST['email'];
            $password = md5($_POST['password']);
            $phone = $_POST['phone'];

            $sql_insert = "INSERT INTO account (name, lastname, email, password, phone) 
                                VALUES ('" . $name ."', '" . $last_name ."', '" . $email ."', '" . $password ."' ,'" . $phone ."')";

            $stmt = $conn->prepare($sql_insert);
            $stmt->execute();

            $user_id = $conn->lastInsertId();

            $_SESSION['userID'] = $user_id;

            header("Location:index.php");
        } else {
            $email = $_POST['email'];
            $password = md5($_POST['password']);

            $sql = "SELECT * FROM account WHERE email = '". $email ."' and password = '" . $password . "'";
            $row = $conn->query($sql)->fetchAll();

            if (sizeof($row) > 0) {
                $_SESSION['userID'] = $row[0]['id'];

                header("Location:index.php");
            }
        }
    }
     
    // see if we have a session
    if ( isset( $session ) ) {
        // graph api request for user data
        $request = new FacebookRequest( $session, 'GET', '/me?fields=id,first_name,last_name,gender,cover' );
        $response = $request->execute();
        // get response
        $graphObject = $response->getGraphObject();

        $id = $graphObject->getProperty('id');

        $sql = "SELECT * FROM account WHERE facebookID = '". $id ."'";
        $row = $conn->query($sql)->fetchAll();

        if (sizeof($row) > 0) {
            $_SESSION['userID'] = $row[0]['id'];

            header("Location:/#");
        } else {
            // Register

            $name = $graphObject->getProperty('first_name');
            $last_name = $graphObject->getProperty('last_name');
            if ($graphObject->getProperty('gender') == "male") {
                $gender = "Masculino";
            } else if ($graphObject->getProperty('gender') == "female") {
                $gender = "Feminino";
            } else {
                $gender = "";
            }

            $image = "https://graph.facebook.com/" . $id . "/picture?type=large";

            if ($graphObject->getProperty('cover') && 
                $graphObject->getProperty('cover')->getProperty('source')) {

                $cover = $graphObject->getProperty('cover')->getProperty('source');

                $sql_insert = "INSERT INTO account (name, lastname, gender, facebookID, image, cover) 
                                VALUES ('" . $name ."', '" . $last_name ."', '" . $gender ."', '" . $id ."' ,'" . $image ."', '" . $cover . "')";

                $stmt = $conn->prepare($sql_insert);
                $stmt->execute();

                $user_id = $conn->lastInsertId();

                $_SESSION['userID'] = $user_id;

            } else {
                $sql_insert = "INSERT INTO account (name, lastname, gender, facebookID, image) 
                                VALUES ('" . $name ."', '" . $last_name ."', '" . $gender ."', '" . $id ."' ,'" . $image ."')";

                $stmt = $conn->prepare($sql_insert);
                $stmt->execute();

                $user_id = $conn->lastInsertId();

                $_SESSION['userID'] = $user_id;
            }

            header("Location:/#");
        }
    }
?>
<!DOCTYPE html>
<html ng-app="Achow">
	<head>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />

		<title>Achow</title>

        <link rel="stylesheet" href="./bower_components/angular-material/angular-material.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700">
        <link rel="stylesheet" href="./bower_components/material-design-lite/material.min.css">
        <link rel="stylesheet" href="https://code.getmdl.io/1.1.3/material.blue-indigo.min.css" />

        <script src="./bower_components/angular/angular.min.js"></script>
        <script src="./bower_components/angular-aria/angular-aria.js"></script>
        <script src="./bower_components/angular-animate/angular-animate.js"></script>
        <script src="./bower_components/angular-material/angular-material.js"></script>
        <script src="./bower_components/angular-messages/angular-messages.min.js"></script>

        <link rel="stylesheet/less" type="text/css" href="./css/login.less" />
        
        <script src="./bower_components/less/dist/less.min.js"></script>
        <script type="text/javascript">
            var app = angular.module('Achow', ['ngMaterial', 'ngMessages']);
            app.controller('LoginController', function ($scope) {
                $scope.login = true;
                $scope.register = {
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    password: ''
                };
            });
        </script>
	</head>

	<body ng-controller="LoginController">
        <div class="toolbar mdl-cell--hide-desktop">
            <div class="top">
                <div class="content">
                    <div class="logo"><img src="./images/logo.png"></div>
                </div>
            </div>
        </div>

        <div class="login-view mdl-grid">
            <div class="logo mdl-cell mdl-cell--8-col mdl-cell--hide-phone mdl-cell--hide-tablet mdl-shadow--4dp">
                <div class="logo-img"><img src="images/logo.png" /></div>
            </div>
            <div class="login mdl-cell mdl-cell--4-col mdl-cell--12-col-phone  mdl-cell--12-col-tablet">
                <div ng-show="login">
                    <div class="title">entrar</div>

                    <form name="loginForm" method="POST" action="/login.php">

                        <md-input-container>
                            <label>Email ou CPF</label>
                            <input ng-model="user.email" name="email" type="text" required>
                        </md-input-container>

                        <md-input-container>
                            <label>Senha</label>
                            <input ng-model="user.password" name="password" type="password" required>
                        </md-input-container>
                        
                        <div class="buttons">
                            <input type="submit" value="Entrar" class="sign-in mdl-button mdl-js-button mdl-button--raised mdl-button--colored" ng-disabled="loginForm.$invalid">

                            <a href="<?php echo $helper->getLoginUrl(); ?>" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored btn-facebook">
                                <i class="ion-social-facebook" style="margin-right:10px;font-size:24px;float:left;"></i>
                                Entrar com o Facebook
                            </a>
                        </div>

                        <button type="button" class="mdl-button mdl-js-button register" ng-click="login=false">
                            Criar conta
                        </button>
                    </form>
                </div>

                <div ng-hide="login" class="register">
                    <div class="title">criar conta</div>

                    <form class="mdl-grid" name="registerForm" method="POST" action="/login.php">
                        <div class="mdl-cell mdl-cell--6-col">
                            <md-input-container>
                                <label>Nome</label>
                                <input ng-model="register.first_name" name="first_name" type="text" ng-required="true">
                                <div ng-show="registerForm.first_name.$dirty" ng-messages="registerForm.first_name.$error">
                                    <div ng-message="required">Campo obrigatório</div>
                                </div>
                            </md-input-container>
                        </div>
                        <div class="mdl-cell mdl-cell--6-col">
                            <md-input-container>
                                <label>Sobrenome</label>
                                <input ng-model="register.last_name" name="last_name" type="text" ng-required="true">
                                <div ng-show="registerForm.last_name.$dirty" ng-messages="registerForm.last_name.$error">
                                    <div ng-message="required">Campo obrigatório</div>
                                </div>
                            </md-input-container>
                        </div>
                        <div class="mdl-cell mdl-cell--12-col">
                            <md-input-container>
                                <label>Email</label>
                                <input ng-model="register.email" name="email" type="email" ng-required="true">
                                <div ng-show="registerForm.email.$dirty" ng-messages="registerForm.email.$error">
                                    <div ng-message="required">Campo obrigatório</div>
                                    <div ng-message="email">E-mal inválido</div>
                                </div>
                            </md-input-container>
                        </div>
                        <div class="mdl-cell mdl-cell--6-col">
                            <md-input-container>
                                <label>Telefone</label>
                                <input ng-model="register.phone" name="phone" type="phone">
                            </md-input-container>
                        </div>
                        <div class="mdl-cell mdl-cell--6-col">
                            <md-input-container>
                                <label>Senha</label>
                                <input ng-model="register.password" name="password" type="password" ng-required="true">
                                <div ng-show="registerForm.password.$dirty" ng-messages="registerForm.password.$error">
                                    <div ng-message="required">Campo obrigatório</div>
                                </div>
                            </md-input-container>
                        </div>
                        <div class="buttons">
                            <button type="button" class="back mdl-button mdl-js-button" ng-click="login=true">
                                Voltar
                            </button>
                            <button type="submit" ng-disabled="registerForm.$invalid" class="sign-in mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                                Criar conta
                            </button>
                        </div>
                        <input name="type" type="hidden" value="register">
                    </form>
                </div>
            </div>
        </div>
	</body>
</html>