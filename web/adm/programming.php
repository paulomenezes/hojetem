<?php
	session_start();
	if($_SESSION['store'] == '')
	{
		header("Location:index.php");
	}

	$store = $_SESSION['store'];

	require("../connect.php");

	try 
	{   
		$sqlVisited = "SELECT idVisitedType, count(*) as Contador FROM store_visited WHERE idStore = '".$store['id']."' group by idVisitedType";
		$stmt = $conn->query($sqlVisited);
		$registrants = $stmt->fetchAll(); 

		$resultados = array();
		for ($i=0; $i < sizeof($registrants); $i++) { 
			$resultados[$registrants[$i][0]] = $registrants[$i][1];
		}

		$sqlMenu = "SELECT * FROM store_menu WHERE idStore = '".$store['id']."'";
		$stmt = $conn->query($sqlMenu);
		$menu = $stmt->fetchAll(); 

		$sqlMenuType = "SELECT * FROM store_menu_type";
		$stmt = $conn->query($sqlMenuType);
		$menuType = $stmt->fetchAll(); 

		$sqlHorario = "SELECT * FROM store_schedule WHERE idStore = '".$store['id']."'";
		$stmt = $conn->query($sqlHorario);
		$horario = $stmt->fetchAll(); 

		if($_POST)
		{
			$sql_delete = "DELETE FROM store_schedule WHERE idStore = '".$store['id']."'";
			$stmt = $conn->prepare($sql_delete);
			$stmt->execute();

			$sql_insert  = "INSERT INTO store_schedule (idStore, dayOfWeek, hourOpen, hourClose, closed) 
							VALUES ('".$store['id']."',1,'".$_POST['segunda']['abre']."','".$_POST['segunda']['fecha']."','".$_POST['segunda']['fechado']."')";

		    $conn->prepare($sql_insert)->execute();

		    $sql_insert  = "INSERT INTO store_schedule (idStore, dayOfWeek, hourOpen, hourClose, closed) 
							VALUES ('".$store['id']."',2,'".$_POST['terca']['abre']."','".$_POST['terca']['fecha']."','".$_POST['terca']['fechado']."')";

		    $conn->prepare($sql_insert)->execute();

		    $sql_insert  = "INSERT INTO store_schedule (idStore, dayOfWeek, hourOpen, hourClose, closed) 
							VALUES ('".$store['id']."',3,'".$_POST['quarta']['abre']."','".$_POST['quarta']['fecha']."','".$_POST['quarta']['fechado']."')";

		    $conn->prepare($sql_insert)->execute();

		    $sql_insert  = "INSERT INTO store_schedule (idStore, dayOfWeek, hourOpen, hourClose, closed) 
							VALUES ('".$store['id']."',4,'".$_POST['quinta']['abre']."','".$_POST['quinta']['fecha']."','".$_POST['quinta']['fechado']."')";

		    $conn->prepare($sql_insert)->execute();

		    $sql_insert  = "INSERT INTO store_schedule (idStore, dayOfWeek, hourOpen, hourClose, closed) 
							VALUES ('".$store['id']."',5,'".$_POST['sexta']['abre']."','".$_POST['sexta']['fecha']."','".$_POST['sexta']['fechado']."')";

		    $conn->prepare($sql_insert)->execute();

		    $sql_insert  = "INSERT INTO store_schedule (idStore, dayOfWeek, hourOpen, hourClose, closed) 
							VALUES ('".$store['id']."',6,'".$_POST['sabado']['abre']."','".$_POST['sabado']['fecha']."','".$_POST['sabado']['fechado']."')";

		    $conn->prepare($sql_insert)->execute();

		    $sql_insert  = "INSERT INTO store_schedule (idStore, dayOfWeek, hourOpen, hourClose, closed) 
							VALUES ('".$store['id']."',0,'".$_POST['domingo']['abre']."','".$_POST['domingo']['fecha']."','".$_POST['domingo']['fechado']."')";

		    $conn->prepare($sql_insert)->execute();

			header("Location:programming.php?msg=sucesso");
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
		<title>Achow - Administração</title>

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

		<div class="container-fluid">
			<div class="row">
				<?php include('menu.php'); ?>

				<div class="col-sm-12 main" id="horario">
					<h1 class="page-header">Horários</h1>
					<?php 
						if($_GET)
						{
							if($_GET['msg'] == 'sucesso') { echo '<div class="alert alert-success">Horário atualizado com sucesso.</div>'; }
						}
					?>
					<form method="post">
						<table class="table">
							<thead>
								<tr>
									<th></th>
									<th>Segunda</th>
									<th>Terça</th>
									<th>Quarta</th>
									<th>Quinta</th>
									<th>Sexta</th>
									<th>Sábado</th>
									<th>Domingo</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Abre</td>
									<td>
										<input name="segunda[abre]" type="text" class="form-control timepicker" 
											   value="<?php echo $horario ? $horario[0]['hourOpen'] : ''; ?>" />
									</td>
									<td>
										<input name="terca[abre]" type="text" class="form-control timepicker" 
											   value="<?php echo $horario ? $horario[1]['hourOpen'] : ''; ?>" />
									</td>
									<td>
										<input name="quarta[abre]" type="text" class="form-control timepicker" 
											   value="<?php echo $horario ? $horario[2]['hourOpen'] : ''; ?>" />
									</td>
									<td>
										<input name="quinta[abre]" type="text" class="form-control timepicker" 
											   value="<?php echo $horario ? $horario[3]['hourOpen'] : ''; ?>" />
									</td>
									<td>
										<input name="sexta[abre]" type="text" class="form-control timepicker" 
											   value="<?php echo $horario ? $horario[4]['hourOpen'] : ''; ?>" />
									</td>
									<td>
										<input name="sabado[abre]" type="text" class="form-control timepicker" 
											   value="<?php echo $horario ? $horario[5]['hourOpen'] : ''; ?>" />
									</td>
									<td>
										<input name="domingo[abre]" type="text" class="form-control timepicker" 
											   value="<?php echo $horario ? $horario[6]['hourOpen'] : ''; ?>" />
									</td>
								</tr>
								<tr>
									<td>Fecha</td>
									<td><input name="segunda[fecha]" type="text" class="form-control timepicker"
									value="<?php echo $horario ? $horario[0]['hourClose'] : ''; ?>" /></td>
									<td><input name="terca[fecha]" type="text" class="form-control timepicker"
									value="<?php echo $horario ? $horario[1]['hourClose'] : ''; ?>" /></td>
									<td><input name="quarta[fecha]" type="text" class="form-control timepicker"
									value="<?php echo $horario ? $horario[2]['hourClose'] : ''; ?>" /></td>
									<td><input name="quinta[fecha]" type="text" class="form-control timepicker"
									value="<?php echo $horario ? $horario[3]['hourClose'] : ''; ?>" /></td>
									<td><input name="sexta[fecha]" type="text" class="form-control timepicker"
									value="<?php echo $horario ? $horario[4]['hourClose'] : ''; ?>" /></td>
									<td><input name="sabado[fecha]" type="text" class="form-control timepicker"
									value="<?php echo $horario ? $horario[5]['hourClose'] : ''; ?>" /></td>
									<td><input name="domingo[fecha]" type="text" class="form-control timepicker"
									value="<?php echo $horario ? $horario[6]['hourClose'] : ''; ?>" /></td>
								</tr>
								<tr>
									<td>Fechado</td>
									<td><input name="segunda[fechado]" type="checkbox" value="1" 
										<?php echo $horario ? $horario[0]['closed'] == 1 ? 'checked' : '' : ''; ?> /></td>
									<td><input name="terca[fechado]" type="checkbox" value="1" 
										<?php echo $horario ? $horario[1]['closed'] == 1 ? 'checked' : '' : ''; ?> /></td>
									<td><input name="quarta[fechado]" type="checkbox" value="1" 
										<?php echo $horario ? $horario[2]['closed'] == 1 ? 'checked' : '' : ''; ?> /></td>
									<td><input name="quinta[fechado]" type="checkbox" value="1" 
										<?php echo $horario ? $horario[3]['closed'] == 1 ? 'checked' : '' : ''; ?> /></td>
									<td><input name="sexta[fechado]" type="checkbox" value="1" 
										<?php echo $horario ? $horario[4]['closed'] == 1 ? 'checked' : '' : ''; ?> /></td>
									<td><input name="sabado[fechado]" type="checkbox" value="1" 
										<?php echo $horario ? $horario[5]['closed'] == 1 ? 'checked' : '' : ''; ?> /></td>
									<td><input name="domingo[fechado]" type="checkbox" value="1" 
										<?php echo $horario ? $horario[6]['closed'] == 1 ? 'checked' : '' : ''; ?> /></td>
								</tr>
							</tbody>
						</table>
						<input type="hidden" name="type" value="horario" />
		                <input type="submit" class="btn btn-primary pull-right" value="Salvar horário" />
					</form>
				</div>
				<br><br>
				<div class="col-sm-12 alert alert-danger">A Programação só aparecerá se o estabelecimento for marcado como VIP</div>
			</div>
			
		</div>
	</body>

</html>