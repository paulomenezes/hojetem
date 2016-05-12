<?php
	session_start();
	if($_SESSION['adm'] == '')
	{
		header("Location:index.php");
	}

	if ($_GET['id']) {
		$store = $_GET['id'];
	} else {
		$store = $_SESSION['store']['id'];
	}

	require("../connect.php");

	try 
	{   
		if ($_GET) {
			if ($_GET['removerEstabelecimento']) {
				$sql_insert = "DELETE FROM store WHERE id = ?";

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, $_GET['removerEstabelecimento']);
			    $stmt->execute();

			    header("Location:adm.php");
			}
		}

		$sqlStore = "SELECT * FROM store WHERE id = '".$store."'";
		$stmt2 = $conn->query($sqlStore);
		$mStore = $stmt2->fetchAll(); 

		$_SESSION['store'] = $mStore[0];
		$_SESSION['show'] = 0;

		$sqlVisited = "SELECT idVisitedType, count(*) as Contador FROM store_visited WHERE idStore = '".$store."' group by idVisitedType";
		$stmt = $conn->query($sqlVisited);
		$registrants = $stmt->fetchAll(); 

		$resultados = array();
		for ($i=0; $i < sizeof($registrants); $i++) { 
			$resultados[$registrants[$i][0]] = $registrants[$i][1];
		}

		$sqlComments = "SELECT c.id, c.idStore, c.message, c.date, ac.name, ac.lastname, ac.image FROM store_comment AS c 
						INNER JOIN account AS ac ON c.idAccount = ac.id WHERE idStore = '".$store."'";
		$stmt = $conn->query($sqlComments);
		$comentarios = $stmt->fetchAll(); 

		$sqlCheckin = "SELECT count(*) as Total FROM store_checkin WHERE idStore = '".$store."'";
		$stmt = $conn->query($sqlCheckin);
		$checkin = $stmt->fetchAll(); 

		$sqlDiasGrafico = "SELECT day(date) AS dia, month(date) AS mes, year(date) AS ano, date FROM store_visited 
						   WHERE idStore = '".$store."' GROUP BY date ORDER BY date ASC";
		$stmt = $conn->query($sqlDiasGrafico);
		$diasGrafico = $stmt->fetchAll(); 

		$dias = "";
		$diasAr = array();
		for ($i=0; $i < sizeof($diasGrafico); $i++) { 
			$dias = $dias . "'".$diasGrafico[$i][0] . "/" .$diasGrafico[$i][1]."',";
			$diasAr[] = $diasGrafico[$i];
		}

		$datas = array();

		for ($i=0; $i < sizeof($diasAr); $i++) { 
			$datas[] = $diasAr[$i]['date'];
		}

		$dadosGrafico = array();
		for ($i=1; $i <= 4; $i++) { 
			$sqlGrafico =  "select date, count(*) as Total from store_visited 
							where idStore = '".$store."' and idVisitedType = '".$i."' group by date";
			$stmt = $conn->query($sqlGrafico);
			$diasGrafico = $stmt->fetchAll(); 	

			$valores = array();
			for ($j=0; $j < sizeof($diasGrafico); $j++) { 
				$valores[$diasGrafico[$j]['date']] = $diasGrafico[$j]['Total'];
			}

			$dia = "";
			for ($j=0; $j < sizeof($datas); $j++) { 
				if(array_key_exists($datas[$j], $valores)) {
					$dia = $dia . $valores[$datas[$j]].",";
				} else {
					$dia = $dia . '0,';
				}
			}

			$dadosGrafico[$i] = $dia;
		}

		if($_GET['remover'] == 1) {
			$sql_insert = "DELETE FROM store_visited WHERE idStore = ?";

		    $stmt = $conn->prepare($sql_insert);
		    $stmt->bindValue(1, $_GET['id']);
		    $stmt->execute();

	    	$sql_insert = "UPDATE store SET avaliar = 0, avaliarGostei = 0, avaliarNaoGostei = 0, avaliarVouVoltar = 0 WHERE id = ?";

		    $stmt = $conn->prepare($sql_insert);
		    $stmt->bindValue(1, $_GET['id']);
		    $stmt->execute();

        	header("Location:ver.php?id=".$_GET['id']);
		} else if ($_GET['remover'] == 2) {
			$sql_insert = "DELETE FROM store_comment WHERE idStore = ?";

		    $stmt = $conn->prepare($sql_insert);
		    $stmt->bindValue(1, $_GET['id']);
		    $stmt->execute();

        	header("Location:ver.php?id=".$_GET['id']);
		} else if ($_GET['remover'] == 3) {
			$sql_insert = "UPDATE store SET showOnApp = 0 WHERE id = ?";

		    $stmt = $conn->prepare($sql_insert);
		    $stmt->bindValue(1, $_GET['id']);
		    $stmt->execute();

        	header("Location:ver.php?id=".$_GET['id']);
		} else if ($_GET['remover'] == 4) {
			$sql_insert = "UPDATE store SET showOnApp = 1 WHERE id = ?";

		    $stmt = $conn->prepare($sql_insert);
		    $stmt->bindValue(1, $_GET['id']);
		    $stmt->execute();

        	header("Location:ver.php?id=".$_GET['id']);
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

		<script type="text/javascript">
			jQuery(document).ready(function() {
				$('.timepicker').timepicker();

				$('.phone').mask('(99) 9999-9999?9');
				$('.cnpj').mask('99.999.999/9999-99');
			});
		</script>
		<script type="text/javascript">
			$(function () {
		        $('#grafico').highcharts({
		            title: {
		                text: 'Estatísticas',
		                x: -20 //center
		            },
		            xAxis: {
		                categories: [<?php echo $dias; ?>]
		            },
		            yAxis: {
		                title: {
		                    text: 'Usuários'
		                },
		                plotLines: [{
		                    value: 0,
		                    width: 1,
		                    color: '#808080'
		                }]
		            },
		            tooltip: {
		                valueSuffix: ' usuários'
		            },
		            legend: {
		                layout: 'horizontal',
		                align: 'center',
		                verticalAlign: 'bottom',
		                borderWidth: 0
		            },
		            series: [{
		            	name: 'Gostaram',
		                data: [<?php echo $dadosGrafico[1]; ?>]
		            }, {
		                name: 'Não gostaram',
		                data: [<?php echo $dadosGrafico[2]; ?>]
		            }]
		        });
		    });
		</script>
	</head>

	<body>

		<div class="banner">
			<div class="logo"></div>
		</div>

		<div class="container-fluid">
			<div class="row">
				<div class="col-sm-12 main">
					<div>
						<a href="adm.php" class="btn btn-default" style="margin-top:20px;">Voltar</a>
						<div class="btn-group margin-right pull-right" style="margin-top:20px;">
							<a href="ver.php?removerEstabelecimento=<?php echo $store; ?>" onclick="return confirm('Você tem certeza?? Essa ação NÃO poderá ser desfeita.')" class="btn btn-danger">EXCLUIR ESTABELECIMENTO</a>
						</div>
	                    <!--<div class="btn-group margin-right pull-right" style="margin-top:20px;">
							<a href="ver.php?id=<?php echo $_GET['id']; ?>&remover=1" class="btn btn-danger">Resetar estatísticas</a>
							<a href="ver.php?id=<?php echo $_GET['id']; ?>&remover=2" class="btn btn-danger">Resetar comentários</a>
							<?php if($mStore[0]['showOnApp'] == "1") { ?>
							<a href="ver.php?id=<?php echo $_GET['id']; ?>&remover=3" class="btn btn-danger">Esconder do aplicativo</a>
							<?php } else { ?>
							<a href="ver.php?id=<?php echo $_GET['id']; ?>&remover=4" class="btn btn-success">Mostrar no aplicativo</a>
							<?php } ?>
	                    </div>-->
	                </div>

					<?php include('menuadm.php'); ?>

					<!--<div class="col-sm-12 main">
						<h1 class="page-header">Notificações</h1>
						<ul class="nav nav-pills">
							<li class="active">
								<a href="javascript:;">
									<span class="badge pull-right"><?php echo $checkin[0]['Total']; ?></span>
									Pessoas estiveram aqui
								</a>
							</li>
							<li class="active">
								<a href="#">
									<span class="badge pull-right"><?php echo sizeof($comentarios); ?></span>
									Pessoas comentaram
								</a>
							</li>
							<li class="active">
								<a href="#">
									<span class="badge pull-right"><?php echo $resultados[1] ? $resultados[1] : '0'; ?></span>
									Pessoas gostaram
								</a>
							</li>
							<li class="active" style="margin-left:0px">
								<a href="#">
									<span class="badge pull-right"><?php echo $resultados[2] ? $resultados[2] : '0'; ?></span>
									Pessoas não gostaram
								</a>
							</li>
							<li class="active">
								<a style="background-color:black !important" href="notification.php?id=<?php echo $store; ?>">Informações detalhadas</a>
							</li>
						</ul>

						<h1 class="page-header">Resumo</h1>
						<div class="row">
							<?php if(sizeof($comentarios) > 0) { ?>
							<div class="col-sm-4">
								<div class="panel panel-default">
									<div class="panel-heading">Comentários</div>
									<div class="panel-body">
										<ul class="media-list">
											<?php 
												$total = sizeof($comentarios) > 7 ? 6 : sizeof($comentarios);
												for ($i=0; $i < $total; $i++) { 
											?>
											<li class="media">
												<a class="pull-left" href="#">
													<?php if(substr($comentarios[$i]['image'], 0, 4) == "http") { ?>
													<img class="media-object" src="<?php echo $comentarios[$i]['image']; ?>" style="max-width:64px;max-height:64px;">
													<?php } else if(substr($comentarios[$i]['image'], 0, 5) == "Where") { ?>
													<img class="media-object" src="../images/user/<?php echo $comentarios[$i]['image']; ?>" style="max-width:64px;max-height:64px;">
													<?php } else { ?>
													<img class="media-object" src="../images/logo-sq.png" style="max-width:64px;max-height:64px;">
													<?php } ?>
												</a>
												<div class="media-body" style="word-break: break-all;">
													<h4 class="media-heading"><?php echo $comentarios[$i]['name'] . ' ' . $comentarios[$i]['lastname']; ?></h4>
													<?php echo $comentarios[$i]['message']; ?>
												</div>
											</li>
											<?php } ?>
										</ul>
									</div>
								</div>
							</div>
							<?php } ?>		
							<div class="<?php echo sizeof($comentarios) > 0 ? 'col-sm-8' : 'col-sm-12'; ?>">
								<div class="panel panel-default">
									<div class="panel-heading">Estatísticas</div>
									<div class="panel-body">
										<div id="grafico" style="height:500px;">.</div>
									</div>
								</div>
							</div>
						</div>
					</div>-->
				</div>
			</div>
		</div>

	</body>

</html>