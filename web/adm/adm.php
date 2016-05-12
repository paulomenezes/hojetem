<?php
	session_start();
	if($_SESSION['adm'] == '')
	{
		header("Location:index.php");
	}

	require("../connect.php");

	$sqlVisited = "SELECT s.*, t.name as NomeCategoria FROM store AS s INNER JOIN store_type as t ON s.idStoreType = t.id ORDER BY s.idStoreType";
	$stmt = $conn->query($sqlVisited);
	$lojas = $stmt->fetchAll(); 

	$sqlVisited = "SELECT * FROM shows";
	$stmt = $conn->query($sqlVisited);
	$shows = $stmt->fetchAll(); 

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
		<script type="text/javascript" src="js/highcharts.js"></script>
		<script type="text/javascript" src="js/modules/exporting.js"></script>
		<script type="text/javascript" src="plugins/timepicker/bootstrap-timepicker.min.js"></script> 
		<script type="text/javascript" src="plugins/jquerymask/jquery.maskedinput.min.js"></script> 
	</head>

	<body>

		<div class="banner">
			<div class="logo"></div>
		</div>

		<div class="container-fluid" style="margin: 0 auto; width: 1000px;">
			<div class="row">
				<div class="col-sm-12 main">
					<div class="page-header">
						<h1 class="pull-left">Resumo</h1>
	                    <div class="btn-group margin-right pull-right" style="margin-top:20px;">
	                    	<a href="add.php" class="btn btn-info">Adicionar Novo Estabelecimento</a>
							<a disabled href="ads.php" class="btn btn-warning">Anúncios</a>
	                    </div>
	                    <div class="clear"></div>
	                </div>

	                <!--<a href="user.php" class="btn btn-warning">Usuários</a>

	                <div class="clear"></div><br><br>
	                Promoções, Shows e Eventos<br>
	                <hr>

	                <?php for($i = 0; $i < sizeof($shows); $i++) { ?>
	                	<div class="well well-sm" style="float:left; margin-right: 10px; margin-bottom: 10px; width: 470px;">
							<a class="pull-left" href="infoShow.php?id=<?php echo $shows[$i]['id']; ?>">
								<?php if($shows[$i]['icon'] != '' && file_exists("../images/store/".$shows[$i]['icon'])) { ?>
								<img class="media-object" src="../images/store/<?php echo $shows[$i]['icon']; ?>" style="max-width:64px;max-height:64px;margin-right:10px">
								<?php } else { ?>
								<img class="media-object" src="../images/logo-sq.png" style="max-width:64px;max-height:64px;margin-right:10px">
								<?php } ?>
							</a>
							<div style="float: left; width: 370px;">
								<div class="media-body">
									<h4 class="media-heading">
										<a href="infoShow.php?id=<?php echo $shows[$i]['id']; ?>" style="color:black;font-size:18px;"><?php echo $shows[$i]['name'] . ', Responsável: ' . $shows[$i]['responsible']; ?></a>
									</h4>
									<?php echo $shows[$i]['city']; ?>
								</div>
							</div>
							<div class="clear"></div>
						</div>
	                <?php } ?>-->

					<?php $ctg = ""; for($i = 0; $i < sizeof($lojas); $i++) { ?>
						<?php 
							if ($ctg != $lojas[$i]['NomeCategoria']) {
								$ctg = $lojas[$i]['NomeCategoria'];
								echo '<div class="clear"></div><br><br>';
								echo ($lojas[$i]['NomeCategoria']) . '<br>';
								echo '<hr>';
							}
						?>
						<div class="well well-sm" style="float:left; margin-right: 10px; margin-bottom: 10px; width: 470px;">
							<a class="pull-left" href="ver.php?id=<?php echo $lojas[$i]['id']; ?>">
								<?php if($lojas[$i]['icon'] != '' && file_exists("../images/store/".$lojas[$i]['icon'])) { ?>
								<img class="media-object" src="../images/store/<?php echo $lojas[$i]['icon']; ?>" style="max-width:64px;max-height:64px;margin-right:10px">
								<?php } else { ?>
								<img class="media-object" src="./images/logo.png" style="max-width:64px;max-height:64px;margin-right:10px">
								<?php } ?>
							</a>
							<div style="float: left; width: 370px;">
								<div class="media-body">
									<h4 class="media-heading">
										<a href="ver.php?id=<?php echo $lojas[$i]['id']; ?>" style="color:black;font-size:18px;"><?php echo $lojas[$i]['name'] . ', Responsável: ' . $lojas[$i]['responsible']; ?></a>
									</h4>
									<?php echo $lojas[$i]['city']; ?>
								</div>
							</div>
							<div class="clear"></div>
						</div>
					<?php } ?>
				</div>
			</div>
		</div>

	</body>

</html>