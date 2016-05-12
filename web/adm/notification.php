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
		$sqlVisited = "SELECT idVisitedType, count(*) as Contador FROM store_visited WHERE idStore = '".$store['id']."' group by idVisitedType";
		$stmt = $conn->query($sqlVisited);
		$registrants = $stmt->fetchAll(); 

		$resultados = array();
		for ($i=0; $i < sizeof($registrants); $i++) { 
			$resultados[$registrants[$i][0]] = $registrants[$i][1];
		}

		$sqlComments = "SELECT c.id, c.idStore, c.message, c.date, ac.name, ac.lastname, ac.image FROM store_comment AS c 
						INNER JOIN account AS ac ON c.idAccount = ac.id WHERE idStore = '".$store['id']."'";
		$stmt = $conn->query($sqlComments);
		$comentarios = $stmt->fetchAll(); 

		$sqlCheckin =  "SELECT c.id, c.message, c.date, ac.name, ac.lastname, ac.image FROM store_checkin as c
						INNER JOIN account AS ac ON c.idAccount = ac.id WHERE idStore = '".$store['id']."'";
		$stmt = $conn->query($sqlCheckin);
		$checkin = $stmt->fetchAll();

		$sqlGostei 	 = "SELECT c.id, c.date, ac.name, ac.lastname, ac.image FROM store_visited as c
						INNER JOIN account AS ac ON c.idAccount = ac.id 
						WHERE idStore = '".$store['id']."' and idVisitedType = 1";
		$stmt = $conn->query($sqlGostei);
		$gostei = $stmt->fetchAll(); 

		$sqlNaoGostei 	 = "SELECT c.id, c.date, ac.name, ac.lastname, ac.image FROM store_visited as c
						INNER JOIN account AS ac ON c.idAccount = ac.id 
						WHERE idStore = '".$store['id']."' and idVisitedType = 2";
		$stmt = $conn->query($sqlNaoGostei);
		$naoGostei = $stmt->fetchAll(); 

		$sqlRecomendo   = "SELECT c.id, c.date, ac.name, ac.lastname, ac.image FROM store_visited as c
						INNER JOIN account AS ac ON c.idAccount = ac.id 
						WHERE idStore = '".$store['id']."' and idVisitedType = 3";
		$stmt = $conn->query($sqlRecomendo);
		$recomendo = $stmt->fetchAll(); 

		$sqlVoltar 	 = "SELECT c.id, c.date, ac.name, ac.lastname, ac.image FROM store_visited as c
						INNER JOIN account AS ac ON c.idAccount = ac.id 
						WHERE idStore = '".$store['id']."' and idVisitedType = 4";
		$stmt = $conn->query($sqlVoltar);
		$voltar = $stmt->fetchAll(); 

		if ($_GET) {
			if ($_GET['ac'] == "comentario") {
				$sql_insert = "DELETE FROM store_comment WHERE id = ?";

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, $_GET['id']);
			    $stmt->execute();

			    header("Location:notification.php?id=" . $_GET['id']);
			}
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
		<link rel="stylesheet" type="text/css" href="plugins/daterange/daterangepicker.css">
		<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">

		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/jquery-ui.min.js"></script> 
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/highcharts.js"></script>
		<script type="text/javascript" src="js/modules/exporting.js"></script>
		<script type="text/javascript" src="plugins/timepicker/bootstrap-timepicker.min.js"></script> 
		<script type="text/javascript" src="plugins/jquerymask/jquery.maskedinput.min.js"></script> 

		<script type="text/javascript">
			jQuery(document).ready(function() {
				$('.timepicker').timepicker();

				$('.phone').mask('(99) 9999-9999?9');
				$('.cnpj').mask('99.999.999/9999-99');

				$('#myTab a').click(function (e) {
				  	e.preventDefault();
				  	$(this).tab('show');
				});
			});
		</script>
		<style type="text/css">
			.nav-tabs li a span { margin-left: 10px; }
			.nav-tabs li a { color: black; }
			.nav-tabs li.active a { color: #b40000; }

			.tab-content .tab-pane { padding-top: 20px; }
		</style>
	</head>

	<body>

		<div class="banner">
			<div class="logo"></div>
		</div>

		<div class="container-fluid">
			<div class="row">
				<?php include('menu.php'); ?>

				<div class="col-sm-12 main">
					<h1 class="page-header">Estatísticas</h1>
					<div class="row">
						<!-- Nav tabs -->
						<ul class="nav nav-tabs">
							<li class="active">
								<a href="#checkin" data-toggle="tab">
									<span class="badge pull-right"><?php echo sizeof($checkin); ?></span>
									Check-ins
								</a>
							</li>
							<li>
								<a href="#comentarops" data-toggle="tab">
									<span class="badge pull-right"><?php echo sizeof($comentarios); ?></span>
									Comentários
								</a>
							</li>
							<li>
								<a href="#gostaram" data-toggle="tab">
									<span class="badge pull-right"><?php echo $resultados[1] ? $resultados[1] : '0'; ?></span>
									Gostaram
								</a>
							</li>
							<li>
								<a href="#naoGostaram" data-toggle="tab">
									<span class="badge pull-right"><?php echo $resultados[2] ? $resultados[2] : '0'; ?></span>
									Não gostaram
								</a>
							</li>
						</ul>

						<!-- Tab panes -->
						<div class="tab-content">
						  	<div class="tab-pane active" id="checkin">
						  		<?php if(sizeof($checkin) > 0) { ?>
									<?php for ($i=0; $i < sizeof($checkin); $i++) { ?>
									<div class="well well-sm">
										<a class="pull-left" href="#">
											<?php if(substr($checkin[$i]['image'], 0, 4) == "http") { ?>
											<img class="media-object" src="<?php echo $checkin[$i]['image']; ?>" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } else if(substr($checkin[$i]['image'], 0, 5) == "Where") { ?>
											<img class="media-object" src="../images/user/<?php echo $checkin[$i]['image']; ?>" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } else { ?>
											<img class="media-object" src="../images/logo-sq.png" style="max-width:64px;max-height:64px;;margin-right:10px;">
											<?php } ?>
										</a>
										<div class="media-body">
											<h4 class="media-heading"><?php echo $checkin[$i]['name'] . ' ' . $checkin[$i]['lastname']; ?></h4>
											<?php echo $checkin[$i]['message']; ?>
										</div>
										<div class="clear"></div>
									</div>
									<?php } ?>
								<?php } else { ?>
								<div class="alert alert-info">Nenhum check-in para esse estabelecimento</div>
								<?php } ?>	
						  	</div>
						  	<div class="tab-pane" id="comentarops">
							  	<?php if(sizeof($comentarios) > 0) { ?>
									<?php for ($i=0; $i < sizeof($comentarios); $i++) { ?>
									<div class="well well-sm">
										<a class="pull-left" href="#">
											<?php if(substr($comentarios[$i]['image'], 0, 4) == "http") { ?>
											<img class="media-object" src="<?php echo $comentarios[$i]['image']; ?>" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } else if(substr($comentarios[$i]['image'], 0, 5) == "Where") { ?>
											<img class="media-object" src="../images/user/<?php echo $comentarios[$i]['image']; ?>" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } else { ?>
											<img class="media-object" src="../images/logo-sq.png" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } ?>
										</a>
										<div class="media-body" style="word-break: break-all;">
											<h4 class="media-heading"><?php echo $comentarios[$i]['name'] . ' ' . $comentarios[$i]['lastname']; ?></h4>
											<?php echo $comentarios[$i]['message']; ?>

											<br><br>
											<a href="notification.php?ac=comentario&id=<?php echo $comentarios[$i]['id']; ?>" onclick="return confirm('Tem certeza?')" class="btn btn-danger">EXCLUIR COMENTÁRIO</a>
										</div>
										<div class="clear"></div>
									</div>
									<?php } ?>
								<?php } else { ?>
								<div class="alert alert-info">Nenhum comentário para esse estabelecimento</div>
								<?php } ?>	
							</div>
							<div class="tab-pane" id="gostaram">
								<?php if(sizeof($gostei) > 0) { ?>
									<?php for ($i=0; $i < sizeof($gostei); $i++) { ?>
									<div class="well well-sm" style="float:left; margin-right: 10px; margin-bottom: 10px; width: 250px;">
										<a class="pull-left" href="#">
											<?php if(substr($gostei[$i]['image'], 0, 4) == "http") { ?>
											<img class="media-object" src="<?php echo $gostei[$i]['image']; ?>" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } else if(substr($gostei[$i]['image'], 0, 5) == "Where") { ?>
											<img class="media-object" src="../images/user/<?php echo $gostei[$i]['image']; ?>" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } else { ?>
											<img class="media-object" src="../images/logo-sq.png" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } ?>
										</a>
										<div class="media-body">
											<h4 class="media-heading">
												<?php echo $gostei[$i]['name'] . ' ' . $gostei[$i]['lastname']; ?>
											</h4>
										</div>
										<div class="clear"></div>
									</div>
									<?php } ?>
								<?php } else { ?>
								<div class="alert alert-info">Não avaliado</div>
								<?php } ?>	
							</div>
							<div class="tab-pane" id="naoGostaram">
								<?php if(sizeof($naoGostei) > 0) { ?>
									<?php for ($i=0; $i < sizeof($naoGostei); $i++) { ?>
									<div class="well well-sm" style="float:left; margin-right: 10px; margin-bottom: 10px; width: 250px;">
										<a class="pull-left" href="#">
											<?php if(substr($naoGostei[$i]['image'], 0, 4) == "http") { ?>
											<img class="media-object" src="<?php echo $naoGostei[$i]['image']; ?>" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } else if(substr($naoGostei[$i]['image'], 0, 5) == "Where") { ?>
											<img class="media-object" src="../images/user/<?php echo $naoGostei[$i]['image']; ?>" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } else { ?>
											<img class="media-object" src="../images/logo-sq.png" style="max-width:64px;max-height:64px;margin-right:10px;">
											<?php } ?>
										</a>
										<div class="media-body">
											<h4 class="media-heading">
												<?php echo $naoGostei[$i]['name'] . ' ' . $naoGostei[$i]['lastname']; ?>
											</h4>
										</div>
										<div class="clear"></div>
									</div>
									<?php } ?>
								<?php } else { ?>
								<div class="alert alert-info">Não avaliado</div>
								<?php } ?>	
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	</body>

</html>