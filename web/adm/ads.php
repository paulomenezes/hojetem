<?php
	session_start();
	if($_SESSION['adm'] == '')
	{
		header("Location:index.php");
	}

	require("../connect.php");

	try 
	{   
		$sqlVisited = "SELECT * FROM store ORDER BY name ASC";
		$stmt = $conn->query($sqlVisited);
		$lojas = $stmt->fetchAll(); 
	} 
	catch ( PDOException $e ) 
	{ 
		print("Houve um error, tente novamente ou volte mais tarde.");
		die(print_r($e));
	}
?>

<!DOCTYPE html>
<html class="html">
	<head>
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8"/>
		<title>Achow - Administração</title>

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
						<h1 class="pull-left">Anúncios</h1>
	                    <div class="btn-group margin-right pull-right" style="margin-top:20px;">
							<a href="adm.php" class="btn btn-default">Voltar</a>
	                    	<a href="ads-side.php" class="btn btn-warning">LATERAL LINK ESPECIFICO</a>
	                    	<a href="ads-carrousel.php" class="btn btn-danger">CARROUSEL LINK ESPECIFICO</a>
	                    	<a href="ads-shows.php" class="btn btn-success">PROMOÇÕES...</a>
	                    </div>
	                    <div class="clear"></div>
	                </div>

					<?php for($i = 0; $i < sizeof($lojas); $i++) { ?>
						<div class="well well-sm" style="float:left; margin-right: 10px; margin-bottom: 10px; width: 470px; height: 135px;">
							<a class="pull-left" href="ver.php?id=<?php echo $lojas[$i]['id']; ?>">
								<?php if($lojas[$i]['icon'] != '' && file_exists("../images/store/".$lojas[$i]['icon'])) { ?>
								<img class="media-object" src="../images/store/<?php echo $lojas[$i]['icon']; ?>" style="max-width:64px;max-height:64px;margin-right:10px">
								<?php } else { ?>
								<img class="media-object" src="../images/logo-sq.png" style="max-width:64px;max-height:64px;margin-right:10px">
								<?php } ?>
							</a>
							<div style="float: left; width: 370px;">
								<div class="media-body">
									<h4 class="media-heading">
										<a href="ver.php?id=<?php echo $lojas[$i]['id']; ?>" style="color:black;font-size:18px;"><?php echo $lojas[$i]['name'] . ', Responsável: ' . $lojas[$i]['responsible']; ?></a>
									</h4>
									<?php echo $lojas[$i]['city']; ?>

									<br><br>

									<a href="ads-side.php?id=<?php echo $lojas[$i]['id']; ?>" class="btn btn-warning">Anúncio LATERAL</a>
									<a href="ads-carrousel.php?id=<?php echo $lojas[$i]['id']; ?>" class="btn btn-danger">Anúncio CARROUSEL</a>
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