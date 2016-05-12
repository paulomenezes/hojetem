<?php
	session_start();
	if($_SESSION['adm'] == '')
	{
		header("Location:index.php");
	}

	$store = $_GET['id'];

	require("../connect.php");

	try 
	{   
		$sql_select = "SELECT * FROM store WHERE id = '".$store."'";
		$stmt = $conn->query($sql_select);
		$resultado = $stmt->fetchAll(); 

		$sql_ads = "SELECT * FROM ads WHERE position = 'side'";
		$ads_query = $conn->query($sql_ads);
		$ads = $ads_query->fetchAll(); 

		if($_GET) {
			if ($_GET['ac'] == "remover") {
				if ($_GET['di']) {
					$sql_insert = "DELETE FROM ads WHERE id = ?";

				    $stmt = $conn->prepare($sql_insert);
				    $stmt->bindValue(1, $_GET['di']);
				    $stmt->execute();

				    header("Location:ads-side.php?msg=remover");
				}
			}
		}

		if($_POST) 
		{
			if($_FILES['image'])
			{
				$foto = $_FILES["image"];
				$nome_imagem = '';

				if (!empty($foto["name"])) 
				{   
					if(!preg_match("/^image\/(pjpeg|jpeg|png|gif|bmp)$/", $foto["type"]))
					{ 
						header("Location:ads-side.php?msg=imagem");
					}  
					else
					{
						$image_info = getimagesize($foto["tmp_name"]);
						$image_width = $image_info[0];
						$image_height = $image_info[1];

						if ($image_width == "248" && $image_height == "209") {
							preg_match("/\.(gif|bmp|png|jpg|jpeg){1}$/i", $foto["name"], $ext);   
						
							$nome_imagem = md5(uniqid(time())) . "." . $ext[1];   
							$caminho_imagem = "../images/top/side/" . $nome_imagem;   
						
							move_uploaded_file($foto["tmp_name"], $caminho_imagem);   

							$sql_insert = "INSERT INTO ads (idstore, type, file, link, position) VALUEs (?, ?, ?, ?, 'side')";

						    $stmt = $conn->prepare($sql_insert);
						    $stmt->bindValue(1, $store);
						    $stmt->bindValue(2, $_POST['type']);
						    $stmt->bindValue(3, $nome_imagem);
						    $stmt->bindValue(4, $_POST['link']);
						    $stmt->execute();

						    header("Location:ads-side.php?msg=sucesso");
						} else {
							header("Location:ads-side.php?msg=tamanho");
						}
					}
				} else {
					header("Location:ads-side.php?msg=name");					
				}
			} else {
				header("Location:ads-side.php?msg=image");					
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

		<div class="container-fluid" style="margin: 0 auto; width: 1000px;">
			<div class="row">
				<a href="ads.php" class="btn btn-default" style="margin-top:10px;">Voltar</a>

				<h1 class="page-header">Enviar anúncio lateral</h1>
				<div class="alert alert-info">Tamanho da imagem: 248 x 209 pixels</div>

				<?php 
					if($_GET)
					{
						if($_GET['msg'] == 'imagem') { echo '<div class="alert alert-danger">Selecione uma imagem</div>'; } else 
						if($_GET['msg'] == 'tamanho') { echo '<div class="alert alert-danger">Tamanho da imagem é inválido</div>'; } else 
						if($_GET['msg'] == 'sucesso') { echo '<div class="alert alert-success">Adicionado com sucesso</div>'; } else
						if($_GET['msg'] == 'remover') { echo '<div class="alert alert-danger">Removido com sucesso</div>'; }
					}
				?>

				<div id="menu">
					<form name="photo" enctype="multipart/form-data" method="post">
						<?php if ($_GET['id']) { ?>
						<div class="form-group row">
							<div class="col-sm-12">
								<label>Estabelecimento</label>
								<input type="text" class="form-control" value="<?php echo $resultado[0]['name'] . ': ' . $resultado[0]['responsible']; ?>" disabled>
							</div>
						</div>

						<input type="hidden" name="type" class="form-control" value="store" />
						<?php } else { ?>
						<div class="form-group row">
							<div class="col-sm-12">
								<label>Link (colocar link com o http://)</label>
								<input type="text" class="form-control" name="link" >
							</div>
						</div>

						<input type="hidden" name="type" class="form-control" value="link" />
						<?php } ?>

						<div class="form-group row">
							<div class="col-sm-12">
								<label>Link</label>
								<input type="file" name="image" class="form-control" />
							</div> 
						</div>

						<div class="form-group row">
							<div class="col-sm-12">
								<input type="submit" value="Cadastrar add" class="col-sm-2 btn btn-default" />
							</div>
						</div>
					</form>

					<h1 class="page-header">Anúncios já cadastrados</h1>
					<br />

					<?php for($i = 0; $i < sizeof($ads); $i++) { ?>
						<div class="well well-sm" style="margin-bottom: 10px; height: 230px;">
							<a class="pull-left" href="">
								<img class="media-object" src="../images/top/side/<?php echo $ads[$i]['file']; ?>" style="width:248px;height:209px;margin-right:10px">
							</a>
							<div style="float: left; width: 370px;">
								<div class="media-body">
									<b>Lateral</b><br>
									<?php if ($ads[$i]['idstore'] != null) {
										$sql = "SELECT * FROM store WHERE id = '".intval($ads[$i]['idstore'])."'";
										$stm = $conn->query($sql);
										$res = $stm->fetchAll(); 
									?>
										<b>Estabelecimento:</b> <?php echo $res[0]['name']; ?><br>
										<b>Responsável:</b> <?php echo $res[0]['responsible']; ?><br>
										<b>Telefone:</b> <?php echo $res[0]['phone1']; ?><br>
									<?php } else { ?>
										<b>Link:</b> <?php echo $ads[$i]['link']; ?><br>
									<?php } ?>

									<b>Data criação:</b> <?php echo date("d/m/Y", strtotime($ads[$i]['__createdAt'])); ?><br>

									<br><br>

									<a href="ads-side.php?ac=remover&di=<?php echo $ads[$i]['id']; ?>" onclick="return confirm('Tem certeza?')" class="btn btn-danger">Remover</a>
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