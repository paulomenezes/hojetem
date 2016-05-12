<?php
	session_start();
	if($_SESSION['choose'] == '')
	{
		header("Location:index.php");
	}

	try 
	{   
		$conn = new PDO ("sqlsrv:server = tcp:n2kuu0zio2.database.windows.net,1433; Database = WhereiSit-android_db", "app", "whereisitxD#1");    
		$conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

		$sqlVisited = "SELECT * FROM [whereisit_app].[Store] WHERE email = '" . $_SESSION['choose'] . "' ORDER BY dataAssinatura";
		$stmt = $conn->query($sqlVisited);
		$lojas = $stmt->fetchAll(); 

		if($_GET) 
		{
			if($_GET['id'])
			{
				$sqlVisited = "SELECT * FROM [whereisit_app].[Store] WHERE id = '" . $_GET['id'] . "' ORDER BY dataAssinatura";
				$stmt = $conn->query($sqlVisited);
				$loja = $stmt->fetchAll(); 

				$_SESSION['store'] = $loja[0];
				header("Location:dashboard.php");
			}
		}
	} 
	catch ( PDOException $e ) 
	{ 
		print("Houve um error, tente novamente ou volte mais tarde.");
		die(print_r($e));
	}

	function geraTimestamp($data) 
	{
		$partes = explode('/', $data);
		return mktime(0, 0, 0, $partes[1], $partes[0], $partes[2]);
	}

	function diferenca($data_inicial, $data_final)
	{
		$time_inicial = geraTimestamp($data_inicial);
		$time_final = geraTimestamp($data_final);

		$diferenca = $time_final - $time_inicial;

		$dias = (int)floor( $diferenca / (60 * 60 * 24));

		return $dias;
	}
?>

<!DOCTYPE html>
<html class="html">
	<head>
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8"/>
		<title>WhereiSit</title>

		<link rel="stylesheet" type="text/css" href="../css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="../css/bootstrap-theme.css"/>
		<link rel="stylesheet" type="text/css" href="../css/template.css" />

		<link rel="stylesheet" type="text/css" href="../plugins/timepicker/bootstrap-timepicker.min.css">
		<link rel="stylesheet" type="text/css" href="../plugins/datepicker/datepicker.css">
		<link rel="stylesheet" type="text/css" href="../plugins/daterange/daterangepicker.css">
		<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">

		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/jquery-ui.min.js"></script> 
		<script type="text/javascript" src="../js/bootstrap.min.js"></script>
		<script type="text/javascript" src="../js/highcharts.js"></script>
		<script type="text/javascript" src="../js/modules/exporting.js"></script>
		<script type="text/javascript" src="../plugins/timepicker/bootstrap-timepicker.min.js"></script> 
		<script type="text/javascript" src="../plugins/jquerymask/jquery.maskedinput.min.js"></script> 
	</head>

	<body>

		<div class="banner">
			<div class="logo"></div>
		</div>

		<div class="container-fluid" style="margin: 0 auto; width: 1000px;">
			<div class="row">
				<div class="col-sm-12 main" style="margin-top:100px;">
					<?php for($i = 0; $i < sizeof($lojas); $i++) { ?>
						<div class="well well-sm" style="float:left; margin-right: 10px; margin-bottom: 10px; width: 470px;">
							<a class="pull-left" href="choose.php?id=<?php echo $lojas[$i]['id']; ?>">
								<?php if($lojas[$i]['icon'] != '' && file_exists("../images/store/".$lojas[$i]['icon'])) { ?>
								<img class="media-object" src="../images/store/<?php echo $lojas[$i]['icon']; ?>" style="max-width:64px;max-height:64px;margin-right:10px">
								<?php } else { ?>
								<img class="media-object" src="../images/store/29f59451ccafbe6ab926e1b9023adef9.png" style="max-width:64px;max-height:64px;margin-right:10px">
								<?php } ?>
							</a>
							<div style="float: left; width: 370px;">
								<div class="media-body">
									<h4 class="media-heading">
										<a href="choose.php?id=<?php echo $lojas[$i]['id']; ?>" style="color:black;font-size:18px;"><?php echo $lojas[$i]['name'] . ', Bairro: ' . $lojas[$i]['bairro']; ?></a>
									</h4>
									<?php echo date("d/m/Y", strtotime($lojas[$i]['dataAssinatura'])); ?>
								</div>
								<h4>Essse é o <b><?php echo diferenca(date("d/m/Y", strtotime($lojas[$i]['dataAssinatura'])), date('d/m/Y')); ?>º</b> dia que o plano está ativado</h4>
							</div>
							<div class="clear"></div>
						</div>
					<?php } ?>
				</div>
			</div>
		</div>

		<div class="rodape">
			<ul>
				<li><a href="#"><img src="../images/facebook.png" /></a></li>
				<li><a href="#"><img src="../images/twitter.png" /></a></li>
				<li><a href="#"><img src="../images/instagram.png" /></a></li>
				<li><a href="#"><img src="../images/email.png" /></a></li>
				<div class="clear"></div>
			</ul>

			<div class="clear"></div>

			<div class="texto">Todos os direitos reservados © 2014 - WhereiSit</div>
		</div>

	</body>

</html>