<?php
	session_start();
	if($_SESSION['adm'] == '')
	{
		header("Location:index.php");
	}

	require("../connect.php");

	$resultados = array();
	for ($i=0; $i < sizeof($registrants); $i++) { 
		$resultados[$registrants[$i][0]] = $registrants[$i][1];
	}

	$sqlMenu = "SELECT * FROM store_type";
	$stmt = $conn->query($sqlMenu);
	$menu = $stmt->fetchAll(); 

	if($_POST)
	{
		$sql_insert = "INSERT INTO store_sub_type
						           (Store_Type_id, name) VALUES (?,?)";

	    $stmt = $conn->prepare($sql_insert);
	    $stmt->bindValue(1, $_POST['category']);
	    $stmt->bindValue(2, $_POST['name']);
	    $stmt->execute();

    	header("Location:subtypes.php?msg=sucesso");
	}

	if ($_GET) {
		if ($_GET['ac'] == 'remover') {
			$sql_insert = "DELETE FROM store_sub_type WHERE id = ?";

		    $stmt = $conn->prepare($sql_insert);
		    $stmt->bindValue(1, $_GET['id']);
		    $stmt->execute();

	    	header("Location:subtypes.php?msg=remover");
		}
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

		<div class="container">
			<div class="row">

				<div class="col-sm-12 main" id="horario">
					<div class="page-header">
						<h1 class="pull-left">Subcategorias</h1>
	                    <div class="btn-group margin-right pull-right" style="margin-top:20px;">
							<a href="adm.php" class="btn btn-default">Voltar</a>
	                    </div>
	                    <div class="clear"></div>
	                </div>
					<div class="row" id="menu">
						<div class="col-sm-12">
							<div class="panel panel-default">
								<div class="panel-heading">Adicionar item</div>
								<div class="panel-body">
									<?php 
										if($_GET)
										{
											if($_GET['msg'] == 'imagem') { echo '<div class="alert alert-danger">Selecione uma imagem</div>'; } else 
											if($_GET['msg'] == 'sucesso') { echo '<div class="alert alert-success">Adicionado com sucesso</div>'; } else
											if($_GET['msg'] == 'editar') { echo '<div class="alert alert-warning">Editadado com sucesso</div>'; } else
											if($_GET['msg'] == 'remover') { echo '<div class="alert alert-danger">Removido com sucesso</div>'; }
										}
									?>
									<form method="post" enctype="multipart/form-data">
										<table class="table">
											<tr>
												<th>Categoria</th>
												<th>Nome da Subcategoria</th>
											</tr>
											<tr>
												<td>
													<select class="form-control" name="category">
														<?php for ($i=0; $i < sizeof($menu); $i++) { ?>
														<option value="<?php echo $menu[$i]['id']; ?>"><?php echo utf8_encode($menu[$i]['name']); ?></option>
														<?php } ?>
													</select>
												</td>
												<td>
													<input id="name" name="name" type="text" class="form-control" placeholder="Nome da Subcategoria" required>
												</td>
											</tr>
										</table>
						                <input type="submit" class="btn btn-primary pull-right" value="Adicionar" />
									</form>
								</div>
							</div>
						</div>

						<div class="col-sm-12">
							<?php if(sizeof($menu) > 0) { ?>
								<?php for ($i=0; $i < sizeof($menu); $i++) { ?>
								<div class="well well-sm">
									<div>
										<h4 class="media-heading"><?php echo utf8_encode($menu[$i]['name']); ?></h4>
										<hr>
										<?php 
											$sqlSub = "SELECT * FROM store_sub_type WHERE Store_Type_id = " . $menu[$i]['id'];
											$sub = $conn->query($sqlSub)->fetchAll(); 
										for ($j=0; $j < sizeof($sub); $j++) { ?>
										<div><?php echo ($sub[$j]['name']); ?> --- <a href="subtypes.php?ac=remover&id=<?php echo $sub[$j]['id']; ?>" style="color:#03a9f4">Remover</a></div>
										<?php } ?>
									</div>
								</div>
								<?php } ?>
							<?php } ?>
						</div>
					</div>
					<br><br>
				</div>
			</div>
		</div>

	</body>

</html>