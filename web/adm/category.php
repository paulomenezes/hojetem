<?php
	session_start();
	if($_SESSION['adm'] == '')
	{
		header("Location:index.php");
	}

	$store = $_SESSION['store'];

	require("../connect.php");

	try 
	{   
		$sqlMenu = "SELECT * FROM store_menu_type";
		$stmt = $conn->query($sqlMenu);
		$menu = $stmt->fetchAll(); 

		if($_POST)
		{
			$sql_insert = "INSERT INTO store_menu_type (name) VALUES (?)";

		    $stmt = $conn->prepare($sql_insert);
		    $stmt->bindValue(1, $_POST['name']);
		    $stmt->execute();

        	header("Location:category.php");
		}

		if($_GET)
		{
			$sql_insert = "DELETE FROM store_menu_type WHERE id = ?";

		    $stmt = $conn->prepare($sql_insert);
		    $stmt->bindValue(1, $_GET['id']);
		    $stmt->execute();

        	header("Location:category.php");
		}
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
		<title>WhereiSit</title>

		<link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="css/bootstrap-theme.css"/>
		<link rel="stylesheet" type="text/css" href="css/template.css" />

		<link rel="stylesheet" type="text/css" href="plugins/timepicker/bootstrap-timepicker.min.css">
		<link rel="stylesheet" type="text/css" href="plugins/datepicker/datepicker.css">
		<link rel="stylesheet" type="text/css" href="plugins/timepicker/bootstrap-timepicker.css">
		<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">

		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/jquery-ui.min.js"></script> 
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/highcharts.js"></script>
		<script type="text/javascript" src="js/modules/exporting.js"></script>
		<script type="text/javascript" src="js/jquery.maskMoney.min.js"></script>
		<script type="text/javascript" src="plugins/timepicker/bootstrap-timepicker.min.js"></script> 
		<script type="text/javascript" src="plugins/jquerymask/jquery.maskedinput.min.js"></script> 

		<script type="text/javascript">
			jQuery(document).ready(function() {
				$('.timepicker').timepicker();

			    $('.price').maskMoney();

				$('.phone').mask('(99) 9999-9999?9');
				$('.cnpj').mask('99.999.999/9999-99');
			});
		</script>
	</head>

	<body>

		<div class="banner">
			<div class="logo"></div>
		</div>

		<div class="container-fluid" style="margin: 0 auto; width: 1000px;">
			<div class="row">
				<div class="col-sm-12 main" id="horario">
					<div class="page-header">
						<h1 class="pull-left">Categorias</h1>
	                    <div class="btn-group margin-right pull-right" style="margin-top:20px;">
							<a href="adm.php" class="btn btn-default">Voltar</a>
	                    </div>
	                    <div class="clear"></div>
	                </div>
					<div class="row" id="menu">
						<div class="panel panel-default">
							<div class="panel-heading">Adicionar item</div>
							<div class="panel-body">
								<form method="post" enctype="multipart/form-data">
									<div class="form-group col-sm-4">
					                  	<input id="name" name="name" type="text" class="form-control" placeholder="Nome da nova categoria" required="" >
					                </div>
					                <input type="submit" class="btn btn-primary" value="Adicionar" />
								</form>
							</div>
						</div>

						<div class="clear"></div>

						<div class="row">
							<?php if(sizeof($menu) > 0) { ?>
								<?php for ($i=0; $i < sizeof($menu); $i++) { ?>
								<div class="well well-sm" style="width:500px;float:left;margin-right:10px;">
									<div class="pull-left">
										<h4 class="media-heading"><?php echo $menu[$i]['name']; ?></h4>
									</div>
									<div class="pull-right">
										<a href="category.php?id=<?php echo $menu[$i]['id']; ?>" class="btn btn-danger">Remover</a>
									</div>
									<div class="clear"></div>
								</div>
								<?php } ?>
							<?php } ?>	
						</div>
					</div>
				</div>
			</div>
		</div>

	</body>

</html>