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

		if($_GET)
		{
			if($_GET['ac'] && $_GET['ac'] == 'remover')
			{
				$sql_insert = "DELETE FROM store_menu WHERE id = ? and idStore = ?";

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, $_GET['id']);
			    $stmt->bindValue(2, $store['id']);
			    $stmt->execute();

				$res = $conn->query("SELECT * FROM store_menu WHERE idStore = '".$store['id']."'");

		    	if(sizeof($res->fetchAll()) <= 0) {
			    	$sql_insert = "UPDATE store SET hasMenu = 0 WHERE id = ?";

				    $stmt = $conn->prepare($sql_insert);
				    $stmt->bindValue(1, $store['id']);
				    $stmt->execute();
				}

	        	header("Location:cardapio.php?msg=remover");
			}
		}

		if($_POST)
		{
			if($_POST['type'] == 'menu')
			{
				//var_dump($_FILES);
				//die;

				for ($k=0; $k < 10; $k++) 
				{ 
					if(array_key_exists($k, $_POST['add']) && strlen($_POST['name'][$k]) > 0) 
					{
						$foto = $_FILES["image"];
						$nome_imagem = "";

						if (!empty($foto["name"][$k])) 
						{   
							if(!preg_match("/^image\/(pjpeg|jpeg|png|gif|bmp)$/", $foto["type"][$k]))
							{ 
								header("Location:cardapio.php?msg=imagem");
							}  
							else
							{
								preg_match("/\.(gif|bmp|png|jpg|jpeg){1}$/i", $foto["name"][$k], $ext);   
							
								$nome_imagem = md5(uniqid(time())) . "." . $ext[1];   
								$caminho_imagem = "../images/menu/" . $nome_imagem;   
							
								move_uploaded_file($foto["tmp_name"][$k], $caminho_imagem);   
							}
						}

						
						$sql_insert = "INSERT INTO store_menu
										           (idStore ,name ,image ,price ,type ,description) VALUES (?,?,?,?,?,?)";

					 
					    $stmt = $conn->prepare($sql_insert);
					    $stmt->bindValue(1, $store['id']);
					    $stmt->bindValue(2, $_POST['name'][$k]);
					    $stmt->bindValue(3, $nome_imagem);
					    $stmt->bindValue(4, $_POST['price'][$k]);
					    $stmt->bindValue(5, $_POST['tipo'][$k]);
					    $stmt->bindValue(6, $_POST['descricao'][$k]);
					    $stmt->execute();

				    	$sql_insert = "UPDATE store SET hasMenu = 1 WHERE id = ?";

					    $stmt = $conn->prepare($sql_insert);
					    $stmt->bindValue(1, $store['id']);
					    $stmt->execute();
					}
				}

	        	header("Location:cardapio.php?msg=sucesso");
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
					<h1 class="page-header">Cardápio</h1>
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
												<th>#</th>
												<th>Nome</th>
												<th width="200">Imagem</th>
												<th width="120">Tipo</th>
												<th width="100">Preço</th>
												<th>Descrição</th>
											</tr>
											<?php for($j = 0; $j < 10; $j++) { ?>
											<tr>
												<td><input id="add" name="add[<?php echo $j; ?>]" type="checkbox" value="1" checked style="margin: 10px"></td>
												<td><input id="name" name="name[<?php echo $j; ?>]" type="text" class="form-control" placeholder="Nome" ></td>
												<td><input id="image" name="image[<?php echo $j; ?>]" type="file" class="form-control" placeholder="Imagem"></td>
												<td>
													<select class="form-control" name="tipo[<?php echo $j; ?>]" required="">
														<?php for ($i=0; $i < sizeof($menuType); $i++) { ?>
														<option><?php echo $menuType[$i]['name']; ?></option>
														<?php } ?>
													</select>
												</td>
												<td><input id="price" value="0" name="price[<?php echo $j; ?>]" type="text" class="form-control price" placeholder="Preço"></td>
												<td><textarea id="descricao" name="descricao[<?php echo $j; ?>]" class="form-control" placeholder="Descrição"></textarea></td>
											</tr>
											<?php } ?>
										</table>
						                <input type="hidden" name="type" value="menu" />
						                <input type="submit" class="btn btn-primary pull-right" value="Adicionar" />
									</form>
								</div>
							</div>
						</div>

						<div class="col-sm-12">
							<?php if(sizeof($menu) > 0) { ?>
								<?php for ($i=0; $i < sizeof($menu); $i++) { ?>
								<div class="well well-sm">
									<a class="pull-left" href="#">
										<img class="media-object" src="../images/menu/<?php echo $menu[$i]['image']; ?>" style="max-width:64px;max-height:64px;margin-right:10px;">
									</a>
									<div class="pull-left">
										<h4 class="media-heading"><?php echo $menu[$i]['name']; ?></h4>
										<h6 class="media-heading">R$ <?php echo $menu[$i]['price']; ?></h6>
									</div>
									<div class="pull-right">
										<a href="cardapio.php?ac=remover&id=<?php echo $menu[$i]['id']; ?>#menu" class="btn btn-danger">Remover</a>
									</div>
									<div class="clear"></div>
									<div class="clear" style="margin-top: 10px;">
										<?php echo $menu[$i]['description']; ?>
									</div>
									<div class="clear"></div>
								</div>
								<?php } ?>
							<?php } else { ?>
							<div class="alert alert-info">Nenhum item adicionado ao cardapio</div>
							<?php } ?>	
						</div>
					</div>
					<br><br>
					<div class="col-sm-12 alert alert-danger">O Cardápio só aparecerá se o estabelecimento for marcado como VIP</div>
				</div>
			</div>
		</div>

	</body>

</html>