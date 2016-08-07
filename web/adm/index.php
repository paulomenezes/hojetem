<?php
	if($_POST)
	{
		session_start();

		if($_SESSION['store'] != '')
		{
			header("Location:dashboard.php");
		}
		else if($_SESSION['adm'] != '')
		{
			header("Location:adm.php");
		}

		if($_POST['email'] == "harrison@gmail.com" && $_POST['senha'] == "hojetem2016")
		{
			$_SESSION['adm'] = "harrison";
			header("Location:adm.php");
		}
		else if($_POST['email'] == "davydson@apphojetem.com" && $_POST['senha'] == "hojetem2016")
		{
			$_SESSION['adm'] = "davydson";
			header("Location:adm.php");
		}
		else if($_POST['email'] == "joaovictor@apphojetem.com" && $_POST['senha'] == "hojetem2016")
		{
			$_SESSION['adm'] = "joaovictor";
			header("Location:adm.php");
		}
		else if($_POST['email'] == "paulo.hgmenezes@gmail.com" && $_POST['senha'] == "95758213")
		{
			$_SESSION['adm'] = "paulo";
			header("Location:adm.php");
		}
		else {
			require("../connect.php");

			$sqlVisited = "SELECT * FROM store WHERE email = '".$_POST['email']."' and password = '". md5($_POST['senha']) ."'";
			$stmt = $conn->query($sqlVisited);
			$store = $stmt->fetchAll()[0];

			if ($store) {
				$_SESSION['store'] = $store;
				header("Location:dashboard.php");
			}
		}
	}
?>

<!DOCTYPE html>
<html class="html">
	<head>
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8"/>
		<title>Hoje Tem - Administração</title>

		<link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="css/bootstrap-theme.css"/>
		<link rel="stylesheet" type="text/css" href="css/template.css" />

		<link rel="stylesheet" type="text/css" href="plugins/timepicker/bootstrap-timepicker.min.css">
		<link rel="stylesheet" type="text/css" href="plugins/datepicker/datepicker.css">
		<link rel="stylesheet" type="text/css" href="plugins/daterange/daterangepicker.css">
		<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">

		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/jquery-ui.min.js"></script> 
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="plugins/timepicker/bootstrap-timepicker.min.js"></script> 
		<script type="text/javascript" src="plugins/jquerymask/jquery.maskedinput.min.js"></script> 

		<script type="text/javascript">
			jQuery(document).ready(function() {
				$('.timepicker').timepicker();

				$('.phone').mask('(99) 9999-9999?9');
				$('.cnpj').mask('99.999.999/9999-99');
			});
		</script>

		<style type="text/css">
			.container {
				margin: 20px auto 150px auto;
			}

			.form-signin {
				max-width: 330px;
				padding: 15px;
				margin: 0 auto;
			}

			.form-signin .form-signin-heading,
			.form-signin .checkbox {
				margin-bottom: 10px;
			}

			.form-signin .checkbox {
				font-weight: normal;
			}

			.form-signin .form-control {
				position: relative;
				height: auto;
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
				padding: 10px;
				font-size: 16px;
			}

			.form-signin .form-control:focus {
				z-index: 2;
			}

			.form-signin input[type="email"] {
				margin-bottom: -1px;
				border-bottom-right-radius: 0;
				border-bottom-left-radius: 0;
			}

			.form-signin input[type="password"] {
				margin-bottom: 10px;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
			}
		</style>
	</head>

	<body>

		<div class="banner">
			<div class="logo"></div>
		</div>

		<div class="container">
			<form class="form-signin" role="form" method="post">
				<h2 class="form-signin-heading">Administração</h2>
				<input type="email" name="email" class="form-control" placeholder="E-mail" required autofocus>
				<input type="password" name="senha" class="form-control" placeholder="Senha" required>

				<button class="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>
			</form>
		</div>

	</body>

</html>