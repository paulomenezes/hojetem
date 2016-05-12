<?php
	session_start();
	if($_SESSION['store'] == '')
	{
		header("Location:index.php");
	}

	$store = $_SESSION['store'];

	try 
	{   
		require("../connect.php");

		$sqlMarmitas = "SELECT l.id AS IDMarmita, l.obs, l.troco,
							   l.date AS DataPedido, l.status AS StatusPedido,
							   l.telefone as Telefone, l.Endereco as Endereco,
							   u.name AS Nome, u.lastname AS Sobrenome, u.email AS Email
							   FROM store_order AS l 
						INNER JOIN account AS u ON l.idAccount = u.id WHERE idStore = '" . $store['id'] . "' ORDER BY l.id DESC";

		$rowMarmitas = $conn->query($sqlMarmitas)->fetchAll(); 

		if ($_POST) {
			if ($_POST['status']) {
				$sql_insert = "UPDATE store_order SET status= ? WHERE id = ?";

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, $_POST['status']);
			    $stmt->bindValue(2, $_POST['id']);
			    $stmt->execute();

			    header("Location: dashboard.php");
			} else {
				$sql_insert = "UPDATE store SET showRequests = ? WHERE id = ?";

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, $_POST['pedidos'] ? $_POST['pedidos'] : 'nao');
			    $stmt->bindValue(2, $store['id']);
			    $stmt->execute();

			    $store['showRequests'] = $_POST['pedidos'] ? $_POST['pedidos'] : 'nao';
			    $_SESSION['store'] = $store;

	        	header("Location:dashboard.php");
			}
		}

		if ($_GET) {
			if ($_GET['id']) {
				$sql_insert = "DELETE FROM store_order WHERE id = ?";

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, $_GET['id']);
			    $stmt->execute();

			    header("Location: dashboard.php");
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
		<title>Achow</title>

		<link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="css/bootstrap-theme.css"/>
		<link rel="stylesheet" type="text/css" href="css/template.css" />

		<link rel="stylesheet" type="text/css" href="plugins/timepicker/bootstrap-timepicker.min.css">
		<link rel="stylesheet" type="text/css" href="plugins/datepicker/datepicker.css">
		<link rel="stylesheet" type="text/css" href="plugins/daterange/daterangepicker.css">
		<link rel="stylesheet" type="text/css" href="plugins/formswitch/css/bootstrap-switch.css">
		<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">

		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/jquery-ui.min.js"></script> 
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/highcharts.js"></script>
		<script type="text/javascript" src="js/modules/exporting.js"></script>
		<script type="text/javascript" src="plugins/timepicker/bootstrap-timepicker.min.js"></script> 
		<script type="text/javascript" src="plugins/jquerymask/jquery.maskedinput.min.js"></script> 
		<script type="text/javascript" src="plugins/formswitch/js/bootstrap-switch.js"></script> 

		<script type="text/javascript">
			jQuery(document).ready(function() {
				$('.timepicker').timepicker();

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

				<div class="col-sm-12">
					<div class="jumbotron" style="margin: 10px 0; padding: 10px;">
						<form method="post">
							<label>Permitir Pedidos</label>
							<br>
							<div class="make-switch" data-on="sim" data-off="nao">
								<input type="checkbox" value="sim" name="pedidos" <?php echo $store['showRequests'] == 'sim' ? 'checked' : ''; ?>>
							</div>
							<input type="hidden" name="teste" value="1">
							<br><br>
							<button type="submit" class="btn btn-default">Salvar</button>
						</form>
					</div>
				</div>

				<h1 class="page-header">Pedidos Recebidos</h1>
				<div class="row">
					<?php for ($i = 0; $i < sizeof($rowMarmitas); $i++) { ?>
					<div class="col-sm-12">
						<div class="panel panel-default">
							<div class="panel-heading">Pedido de <?php echo $rowMarmitas[$i]['Nome'] . ' ' . $rowMarmitas[$i]['Sobrenome']; ?></div>
							<div class="panel-body">
								<div class="col-sm-2">
									<div class="media-body">
										<h4 class="media-heading">Cliente</h4>
										<h5>
											Nome: <b><?php echo $rowMarmitas[$i]['Nome'] . ' ' . $rowMarmitas[$i]['Sobrenome'] ?></b>
										</h5>
										<h6>Endereço: <?php echo $rowMarmitas[$i]['Endereco']; ?></h6>
										<h6>Telefone: <?php echo $rowMarmitas[$i]['Telefone']; ?></h6>
										<h6>E-mail: <?php echo $rowMarmitas[$i]['Email']; ?></h6>
									</div>
								</div>
								<div class="col-sm-6">
									<h4 class="media-heading">
										Itens do pedido
									</h4>
									<?php
										$totalPedido = 0;

										$sql = "SELECT * FROM store_order_item 
											    WHERE idOrder = '" . $rowMarmitas[$i]['IDMarmita'] . "' ORDER BY id DESC";
										$row = $conn->query($sql)->fetchAll();

										for ($k=0; $k < sizeof($row); $k++) { ?>
											<div class="col-sm-4" style="border:1px solid #CCC;border-radius:5px;margin-right:10px;margin-bottom:10px;">
												<?php 
													$sqlCarboidratos = "SELECT * FROM store_menu WHERE id = ".$row[$k]['idItem'];
													$rowCarboidratos = $conn->query($sqlCarboidratos)->fetchAll(); 
													for ($j = 0; $j < sizeof($rowCarboidratos); $j++) {
														echo "<h6>Produto: " . $rowCarboidratos[$j]['name'] . "</h6>";
														echo "<h6>Quantidade: " . $row[$k]['quantity'] . " itens</h6>";
														echo "<h6>Preço: R$ " . $rowCarboidratos[$j]['price'] . "</h6>";

														$totalPedido += ($rowCarboidratos[$j]['price'] * $row[$k]['quantity']);
													}
												?>
											</div>
									<?php } ?>
								</div>
								<div class="col-sm-4">
									<div class="media-body">
										<h4 class="media-heading">
											Pedido
										</h4>
										<h6>Valor do pedido: R$ <?php echo round($totalPedido, 2); ?></h6>
										<?php 
											date_default_timezone_set('America/Sao_Paulo');
											$originalDate = $rowMarmitas[$i]['DataPedido'];
											$newDate = date("d/m/Y", strtotime($originalDate));
										?>
										<h6>Pedido realizado em: <?php echo $newDate; ?></h6>
										<h6>Troco: <?php echo $rowMarmitas[$i]['troco']; ?></h6>
										<h6>Observação: <?php echo $rowMarmitas[$i]['obs']; ?></h6>
										<hr />
										<form method="post" class="form-inline">
											<select name="status" class="form-control">
												<option <?php echo $rowMarmitas[$i]['StatusPedido'] == "Pedido recebido" ? "selected" : ""; ?>>Pedido recebido</option>
												<option <?php echo $rowMarmitas[$i]['StatusPedido'] == "Pronto" ? "selected" : ""; ?>>Pronto</option>
												<option <?php echo $rowMarmitas[$i]['StatusPedido'] == "Saiu para entrega" ? "selected" : ""; ?>>Saiu para entrega</option>
												<option <?php echo $rowMarmitas[$i]['StatusPedido'] == "Entregue" ? "selected" : ""; ?>>Entregue</option>
											</select>
											<input type="hidden" name="id" value="<?php echo $rowMarmitas[$i]['IDMarmita']; ?>" />
											<button type="submit" class="btn btn-success">Atualizar</button>
										</form>
										<hr />
										<a href="dashboard.php?id=<?php echo $rowMarmitas[$i]['IDMarmita']; ?>" class="btn btn-danger" type="submit" onclick="return confirm('Certeza?')">
											Excluir
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<?php } ?>
				</div>
			</div>
		</div>

	</body>

</html>