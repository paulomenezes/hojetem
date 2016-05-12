<?php
	session_start();
	if($_SESSION['adm'] == '')
	{
		header("Location:index.php");
	}

	require("../connect.php");

	$sqlVisited = "SELECT * FROM account";
	$stmt = $conn->query($sqlVisited);
	$lojas = $stmt->fetchAll(); 
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
		<br><br>

		<div class="container-fluid" style="margin: 0 auto; width: 1000px;">
			<div class="row">
				<div class="col-sm-12 main">
					<?php $ctg = ""; for($i = 0; $i < sizeof($lojas); $i++) { ?>
						<div class="well well-sm" style="float:left; margin-right: 10px; margin-bottom: 10px; width: 470px;">
							<a class="pull-left" href="#">
								<?php if(substr($lojas[$i]['image'], 0, 4) == "http") { ?>
								<img class="media-object" src="<?php echo $lojas[$i]['image']; ?>" style="max-width:64px;max-height:64px;">
								<?php } else if(substr($lojas[$i]['image'], 0, 5) == "Where") { ?>
								<img class="media-object" src="../images/user/<?php echo $lojas[$i]['image']; ?>" style="max-width:64px;max-height:64px;">
								<?php } else { ?>
								<img class="media-object" src="../images/logo-sq.png" style="max-width:64px;max-height:64px;">
								<?php } ?>
							</a>
							<div style="float: left; width: 370px;">
								<div class="media-body">
									<h4 class="media-heading">
										<a href="https://www.facebook.com/<?php echo $lojas[$i]['facebookID']; ?>" target="_blank"><?php echo $lojas[$i]['name'] . ' ' . $lojas[$i]['last_name']; ?></a>
									</h4>
									ID: <?php echo $lojas[$i]['id']; ?>
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