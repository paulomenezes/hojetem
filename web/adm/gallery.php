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
		if ($_SESSION['show'] == 0 ) {
			$sql_select = "SELECT * FROM store WHERE id = '".$store['id']."'";
		} else {
			$sql_select = "SELECT * FROM shows WHERE id = '".$store['id']."'";
		}
		$stmt = $conn->query($sql_select);
		$resultado = $stmt->fetchAll(); 

		if($_POST) 
		{
			if($_FILES['image1'])
			{
				$foto = $_FILES["image1"];
				$nome_imagem = '';

				if (!empty($foto["name"])) 
				{   
					if(!preg_match("/^image\/(pjpeg|jpeg|png|gif|bmp)$/", $foto["type"]))
					{ 
						header("Location:gallery.php?msg=imagem");
					}  
					else
					{
						preg_match("/\.(gif|bmp|png|jpg|jpeg){1}$/i", $foto["name"], $ext);   
					
						$nome_imagem = md5(uniqid(time())) . "." . $ext[1];   
						$caminho_imagem = "../images/store/" . $nome_imagem;   
					
						move_uploaded_file($foto["tmp_name"], $caminho_imagem);   

						if ($_SESSION['show'] == 0 ) {
							$sql_insert = "UPDATE store SET image1 = ? WHERE id = ?";
						} else {
							$sql_insert = "UPDATE shows SET image1 = ? WHERE id = ?";
						}

					    $stmt = $conn->prepare($sql_insert);
					    $stmt->bindValue(1, $nome_imagem);
					    $stmt->bindValue(2, $store['id']);
					    $stmt->execute();
					}
				}
			} 
			else if($_FILES['image2'])
			{
				$foto = $_FILES["image2"];
				$nome_imagem = '';

				if (!empty($foto["name"])) 
				{   
					if(!preg_match("/^image\/(pjpeg|jpeg|png|gif|bmp)$/", $foto["type"]))
					{ 
						header("Location:gallery.php?msg=imagem");
					}  
					else
					{
						preg_match("/\.(gif|bmp|png|jpg|jpeg){1}$/i", $foto["name"], $ext);   
					
						$nome_imagem = md5(uniqid(time())) . "." . $ext[1];   
						$caminho_imagem = "../images/store/" . $nome_imagem;   
					
						move_uploaded_file($foto["tmp_name"], $caminho_imagem);   

						if ($_SESSION['show'] == 0 ) {
							$sql_insert = "UPDATE store SET image2 = ? WHERE id = ?";
						} else {
							$sql_insert = "UPDATE shows SET image2 = ? WHERE id = ?";
						}

					    $stmt = $conn->prepare($sql_insert);
					    $stmt->bindValue(1, $nome_imagem);
					    $stmt->bindValue(2, $store['id']);
					    $stmt->execute();
					}
				}
			}
			else if($_FILES['image3'])
			{
				$foto = $_FILES["image3"];
				$nome_imagem = '';

				if (!empty($foto["name"])) 
				{   
					if(!preg_match("/^image\/(pjpeg|jpeg|png|gif|bmp)$/", $foto["type"]))
					{ 
						header("Location:gallery.php?msg=imagem");
					}  
					else
					{
						preg_match("/\.(gif|bmp|png|jpg|jpeg){1}$/i", $foto["name"], $ext);   
					
						$nome_imagem = md5(uniqid(time())) . "." . $ext[1];   
						$caminho_imagem = "../images/store/" . $nome_imagem;   
					
						move_uploaded_file($foto["tmp_name"], $caminho_imagem);   

						if ($_SESSION['show'] == 0 ) {
							$sql_insert = "UPDATE store SET image3 = ? WHERE id = ?";
						} else {
							$sql_insert = "UPDATE shows SET image3 = ? WHERE id = ?";
						}

					    $stmt = $conn->prepare($sql_insert);
					    $stmt->bindValue(1, $nome_imagem);
					    $stmt->bindValue(2, $store['id']);
					    $stmt->execute();
					}
				}
			}

			header("Location:gallery.php");
		}

		if ($_GET) {
			if ($_GET['img'] == 1) {
				if ($_SESSION['show'] == 0 ) {
					$sql_insert = "UPDATE store SET image1 = ? WHERE id = ?";
				} else {
					$sql_insert = "UPDATE shows SET image1 = ? WHERE id = ?";
				}

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, null);
			    $stmt->bindValue(2, $_GET['id']);
			    $stmt->execute();
			} else if ($_GET['img'] == 2) {
				if ($_SESSION['show'] == 0 ) {
					$sql_insert = "UPDATE store SET image2 = ? WHERE id = ?";
				} else {
					$sql_insert = "UPDATE shows SET image2 = ? WHERE id = ?";
				}

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, null);
			    $stmt->bindValue(2, $_GET['id']);
			    $stmt->execute();
			} else if ($_GET['img'] == 3) {
				if ($_SESSION['show'] == 0 ) {
					$sql_insert = "UPDATE store SET image3 = ? WHERE id = ?";
				} else {
					$sql_insert = "UPDATE shows SET image3 = ? WHERE id = ?";
				}

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, null);
			    $stmt->bindValue(2, $_GET['id']);
			    $stmt->execute();
			}

			header("Location:gallery.php");
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

		<script type="text/javascript" src="js/jquery-pack.js"></script>
		<script type="text/javascript" src="js/jquery.imgareaselect.min.js"></script>

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
				<?php $_SESSION['show'] == 0 ? include('menu.php') : include('menuShow.php'); ?>

				<h1 class="page-header">Enviar fotos</h1>
				<div class="alert alert-info">
					Envie fotos do seu estabelecimento, caso queia substituir alguma delas, apenas envie outra foto. Máximo de 3 fotos, além da foto de cover.<br />
					<b>Envie uma foto de cada vez.</b>
				</div>
				<div class="row" id="menu">
					<h2 class="page-header">Foto 1</h2>
					<form name="photo" enctype="multipart/form-data" method="post">
						<div class="col-sm-5">
							<input type="file" name="image1" class="form-control" /> 
						</div>
						<input type="submit" name="upload" value="Enviar Foto 1" class="col-sm-2 btn btn-default" />
					</form>
					<br />
					<?php 
						if($resultado[0]['image1'] != '') {
							echo '<img src="../images/store/' . $resultado[0]['image1'] .'" style="max-width:1000px; margin: 10px 0 10px 0; border: 1px solid #b40000" />';

							echo '<a href="gallery.php?img=1&id=' . $resultado[0]['id'] .'" class="btn btn-default">Excluir</a>';
						}
					?>
				</div>
				<div class="row" id="menu">
					<h2 class="page-header">Foto 2</h2>
					<form name="photo" enctype="multipart/form-data" method="post">
						<div class="col-sm-5">
							<input type="file" name="image2" class="form-control" /> 
						</div>
						<input type="submit" name="upload" value="Enviar Foto 2" class="col-sm-2 btn btn-default" />
					</form>
					<br />
					<?php 
						if($resultado[0]['image2'] != '') {
							echo '<img src="../images/store/' . $resultado[0]['image2'] .'" style="max-width:1000px; margin: 10px 0 10px 0; border: 1px solid #b40000" />';

							echo '<a href="gallery.php?img=2&id=' . $resultado[0]['id'] .'" class="btn btn-default">Excluir</a>';
						}
					?>
				</div>
				<div class="row" id="menu">
					<h2 class="page-header">Foto 3</h2>
					<form name="photo" enctype="multipart/form-data" method="post">
						<div class="col-sm-5">
							<input type="file" name="image3" class="form-control" /> 
						</div>
						<input type="submit" name="upload" value="Enviar Foto 3" class="col-sm-2 btn btn-default" />
					</form>
					<br />
					<?php 
						if($resultado[0]['image3'] != '') {
							echo '<img src="../images/store/' . $resultado[0]['image3'] .'" style="max-width:1000px; margin: 10px 0 10px 0; border: 1px solid #b40000" />';

							echo '<a href="gallery.php?img=3&id=' . $resultado[0]['id'] .'" class="btn btn-default">Excluir</a>';
						}
					?>
				</div>

				<br><br><br><br><br>
			</div>
		</div>

	</body>

</html>