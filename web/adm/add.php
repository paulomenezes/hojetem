<?php
	session_start();
	if($_SESSION['adm'] == '')
	{
		header("Location:index.php");
	}

	$store = $_SESSION['store'];

	require("../connect.php");

	$sqlMenu = "SELECT * FROM store_type";
    $rowMenu = $conn->query($sqlMenu)->fetchAll();

	$sqlCity = "SELECT * FROM store_city";
    $rowCity = $conn->query($sqlCity)->fetchAll();

	if($_POST)
	{
		if($_POST['tipo'] == "estabelecimento") 
	    {
	      	if($_POST['senha'] == $_POST['resenha'])
	      	{
	      		$sub = ',';
	      		for ($i=0; $i < sizeof($_POST['estabelecimento']); $i++) { 
	      			$sub = $sub . $_POST['estabelecimento'][$i] . ',';
	      		}

				$sql_insert = "INSERT INTO store
								           (name, responsible , email, phone1, phone2, phone3,
								           	address, event_date, event_time, password, lista, 
								           	idStoreType, subtype, man, woman, description, bairro, cidade, top) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, $_POST['nome']);
			    $stmt->bindValue(2, $_POST['responsavel']);
			    $stmt->bindValue(3, $_POST['email']);
			    $stmt->bindValue(4, $_POST['telefone1']);
			    $stmt->bindValue(5, $_POST['telefone2']);
			    $stmt->bindValue(6, $_POST['telefone3']);
			    $stmt->bindValue(7, $_POST['endereco']);
			    $stmt->bindValue(8, $_POST['date']);
			    $stmt->bindValue(9, $_POST['time']);
			    $stmt->bindValue(10, md5($_POST['password']));
			    $stmt->bindValue(11, $_POST['lista']);
			    $stmt->bindValue(12, $_POST['estabelecimento'][0]);
			    $stmt->bindValue(13, $sub);
			    $stmt->bindValue(14, $_POST['man']);
			    $stmt->bindValue(15, $_POST['woman']);
			    $stmt->bindValue(16, $_POST['description']);
			    $stmt->bindValue(17, $_POST['bairro']);
			    $stmt->bindValue(18, $_POST['cidade']);
			    $stmt->bindValue(19, $_POST['top'] === null ? 0 : $_POST['top']);
			    $stmt->execute();

	        	$sqlStore = "SELECT * FROM store WHERE id = '".$conn->lastInsertId()."'";
				$stmt2 = $conn->query($sqlStore);
				$mStore = $stmt2->fetchAll(); 

				$_SESSION['store'] = $mStore[0];

	        	header("Location:info.php");
	      	} 
	      	else
	      	{
	        	header("Location:add.php?msg2=senha");
	      	}
	    }
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
		<link rel="stylesheet" type="text/css" href="plugins/timepicker/bootstrap-timepicker.css">
		<link rel="stylesheet" type="text/css" href="plugins/formswitch/css/bootstrap-switch.css">
		<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">

		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/jquery-ui.min.js"></script> 
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/highcharts.js"></script>
		<script type="text/javascript" src="js/modules/exporting.js"></script>
		<script type="text/javascript" src="js/jquery.maskMoney.min.js"></script>
		<script type="text/javascript" src="plugins/timepicker/bootstrap-timepicker.min.js"></script> 
		<script type="text/javascript" src="plugins/jquerymask/jquery.maskedinput.min.js"></script> 
		<script type="text/javascript" src="plugins/formswitch/js/bootstrap-switch.js"></script> 
		<script type="text/javascript" src="plugins/select2/js/select2.min.js"></script> 

		<link href="plugins/select2/css/select2.min.css" rel="stylesheet" />

		<script type="text/javascript">
			jQuery(document).ready(function() {
				$('.timepicker').timepicker();
				$('.select2').select2();

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
						<h1 class="pull-left">Estabelecimentos</h1>
	                    <div class="btn-group margin-right pull-right" style="margin-top:20px;">
							<a href="adm.php" class="btn btn-default">Voltar</a>
	                    </div>
	                    <div class="clear"></div>
	                </div>
					<div class="row" id="menu">
						<div class="panel panel-default">
							<div class="panel-heading">Adicionar Estabelecimento</div>
							<div class="panel-body">
								<?php if($_GET['msg2'] == 'senha') { ?>
									<div style="clear:both" class="alert alert-danger">Senhas não são iguais</div>
								<?php } ?>
								<form method="post" enctype="multipart/form-data">
									<div class="form-group">
										<div class="row">
											<div class="col-sm-3">
												<label>Nome na lista</label>
												<br>
						                        <div class="make-switch" data-on="sim" data-off="nao">
						                        	<input type="checkbox" value="sim" name="lista" >
						                        </div>
											</div>
											<div class="col-sm-3">
												<label>Topo</label>
												<br>
						                        <div class="make-switch" data-on="1" data-off="0">
						                        	<input type="checkbox" value="1" name="top" >
						                        </div>
											</div>
											<div class="col-sm-6">
												<select class="form-control select2" name="estabelecimento[]" required multiple="" placeholder="Categorias">
													<?php for($i = 0; $i < sizeof($rowMenu); $i++) { ?>
													<option value="<?php echo $rowMenu[$i]['id']; ?>"><?php echo ($rowMenu[$i]['name']); ?></option>
													<?php } ?>
												</select>
											</div>
										</div>
									</div>
									<hr />
									<div class="form-group">
										<div class="row">
											<div class="col-sm-6">
												<input type="text" class="form-control" name="nome" placeholder="Nome da Empresa" required >
											</div>
											<div class="col-sm-6">
												<input type="text" class="form-control" name="responsavel" placeholder="Nome do Responsável" required>
											</div>
										</div>
									</div>
									<hr />
									<div class="form-group">
										<div class="row">
											<div class="col-sm-6">
												<input type="email" class="form-control" name="email" placeholder="E-mail" >
											</div>
											<div class="col-sm-6">
												<input type="password" class="form-control" name="password" placeholder="Senha">
											</div>
										</div>
									</div>
									<hr />
									<div class="form-group">
										<div class="row">
											<div class="col-sm-4">
												<input type="text" class="form-control phone" name="telefone1" placeholder="Telefone 1">
											</div>
											<div class="col-sm-4">
												<input type="text" class="form-control phone" name="telefone2" placeholder="Telefone 2">
											</div>
											<div class="col-sm-4">
												<input type="text" class="form-control phone" name="telefone3" placeholder="Celular">
											</div>
										</div>
									</div>
									<hr />
									<div class="form-group">
										<div class="row">
											<div class="col-sm-12">
												<input type="text" class="form-control" name="endereco" placeholder="Endereço" required>
											</div>
										</div>
									</div>
									<div class="form-group">
										<div class="row">
											<div class="col-sm-6">
												<input type="text" class="form-control" name="bairro" placeholder="Bairro">
											</div>
											<div class="col-sm-6">
												<input type="text" class="form-control" name="cidade" placeholder="Cidade">
											</div>
										</div>
									</div>
									<hr />
									<div id="lanchonete">
										<div class="form-group">
											<div class="row">
												<div class="col-sm-6">
													<input type="date" class="form-control" name="date" placeholder="Data do evento">
												</div>
												<div class="col-sm-6">
													<input type="time" class="form-control" name="time" placeholder="Horário do evento">
												</div>
											</div>
										</div>
									</div>
									<div id="lanchonete">
										<hr />
										<div class="form-group">
											<div class="row">
												<div class="col-sm-6">
													<input type="text" class="form-control" name="man" placeholder="Masculino R$">
												</div>
												<div class="col-sm-6">
													<input type="text" class="form-control" name="woman" placeholder="Feminino R$">
												</div>
											</div>
										</div>
									</div>

									<div id="lanchonete">
										<hr />
										<div class="form-group">
											<div class="row">
												<div class="col-sm-12">
													<label>Descrição</label>
													<textarea class="form-control" name="description"></textarea>
												</div>
											</div>
										</div>
									</div>
									<input type="hidden" value="estabelecimento" name="tipo" />
									<button type="submit" class="btn btn-default">Cadastrar</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	</body>

</html>