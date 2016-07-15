<?php
	session_start();
	if($_SESSION['store'] == '')
	{
		header("Location:index.php");
	}

	$store = $_SESSION['store'];

	require("../connect.php");

	$extra = array("Reservas", "Cartões de crédito", "Mesas ao ar livre", "Área privada",
				   "Música", "WiFi", "Estacionamento", "Chapelaria", "Banheiro", 
				   "Acessível para Cadeirantes", "TVs", "Caixa eletrônico", "Permitido fumar",
				   "Serviço de mesa", "Serviço de bar", "Para viagem", "Entrega", "Drive-thru",
				   "Rodízio");

	try 
	{   

		$sqlVisited = "SELECT * FROM store WHERE id = '".$store['id']."'";
		$stmt = $conn->query($sqlVisited);
		$estabelecimento = $stmt->fetchAll()[0]; 

		$sqlMenu = "SELECT * FROM store_type";
        $rowMenu = $conn->query($sqlMenu)->fetchAll();

		$sqlCity = "SELECT * FROM store_city";
        $rowCity = $conn->query($sqlCity)->fetchAll();

		if($_POST)
		{
      		$sub = ',';
      		for ($i=0; $i < sizeof($_POST['estabelecimento']); $i++) { 
      			$sub = $sub . $_POST['estabelecimento'][$i] . ',';
      		}

			$sql_insert = "UPDATE store SET
							           name = ?, responsible = ?,
							           phone1 = ?, phone2 = ?, phone3 = ?, address = ?, event_date = ?, event_time = ?,
							           lat = ?, longitude = ?, email = ?, password = ?, lista = ?, idStoreType = ?,
							           description = ?, subtype = ?, man = ?, woman = ?  
							           WHERE id = ?";

		    $stmt = $conn->prepare($sql_insert);
		    $stmt->bindValue(1, $_POST['nome']);
		    $stmt->bindValue(2, $_POST['responsavel']);
		    $stmt->bindValue(3, $_POST['telefone1']);
		    $stmt->bindValue(4, $_POST['telefone2']);
		    $stmt->bindValue(5, $_POST['telefone3']);
		    $stmt->bindValue(6, $_POST['endereco']);
		    $stmt->bindValue(7, $_POST['date']);
		    $stmt->bindValue(8, $_POST['time']);
		    $stmt->bindValue(9, $_POST['lat']);
		    $stmt->bindValue(10, $_POST['longitude']);
		    $stmt->bindValue(11, $_POST['email']);
		    $stmt->bindValue(12, md5($_POST['password']));
		    $stmt->bindValue(13, $_POST['lista']);
		    $stmt->bindValue(14, $_POST['estabelecimento'][0]);
		    $stmt->bindValue(15, $_POST['description']);
		    $stmt->bindValue(16, $sub);
		    $stmt->bindValue(17, $_POST['man']);
		    $stmt->bindValue(18, $_POST['woman']);
		    $stmt->bindValue(19, $store['id']);
		    $stmt->execute();

        	header("Location:info.php?msg=sucesso");
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
		<script type="text/javascript" src="plugins/select2/js/select2.min.js"></script> 

		<script type="text/javascript" src='http://maps.google.com/maps/api/js?sensor=false&libraries=places'></script>
		<script src="plugins/locationpicker/dist/locationpicker.jquery.min.js"></script>

		<link href="plugins/select2/css/select2.min.css" rel="stylesheet" />

		<script type="text/javascript">
			jQuery(document).ready(function() {
				$('.select2').select2();

				$('.timepicker').timepicker();

				$('.phone').mask('(99) 9999-9999?9');
				$('.cnpj').mask('99.999.999/9999-99');
				$('.cep').mask('99999-999');

				$("select[name=estabelecimento]").change(function() {
					$("select[name=estabelecimento] option:selected").each(function () {
						if($(this).attr('value') == 4) {
							$("select[name=plano] option:eq(0)").html('45 Dias Grátis');
							/*$("select[name=plano] option:eq(1)").html('60 Dias - R$ 0,00');
							$("select[name=plano] option:eq(2)").html('90 Dias - R$ 0,00');
							$("select[name=plano] option:eq(3)").html('180 Dias - R$ 0,00');

							if($("select[name=plano] option:eq(4)").text() == "")
								$("select[name=plano]").append('<option>360 Dias - R$ 0,00</option>');
							else
								$("select[name=plano] option:eq(4)").html('360 Dias - R$ 0,00');*/

							$("#lanchonete").hide();
							$("input[name=responsavel]").attr('placeholder', 'Nome Responsável');
						} else if($(this).attr('value') == 8) {
							$("select[name=plano] option:eq(0)").html('15 Dias Antes - R$ 0,00');
							/*$("select[name=plano] option:eq(1)").html('30 Dias Antes - R$ 0,00');
							$("select[name=plano] option:eq(2)").html('60 Dias Antes - R$ 0,00');
							$("select[name=plano] option:eq(3)").html('90 Dias Antes - R$ 0,00');
							$("select[name=plano] option:eq(4)").remove();*/

							$("input[name=responsavel]").attr('placeholder', 'Nome do Evento/Show')
						} else {
							$("select[name=plano] option:eq(0)").html('45 Dias Grátis');
							/*$("select[name=plano] option:eq(1)").html('60 Dias - R$ 0,00');
							$("select[name=plano] option:eq(2)").html('90 Dias - R$ 0,00');
							$("select[name=plano] option:eq(3)").html('180 Dias - R$ 0,00');

							if($("select[name=plano] option:eq(4)").text() == "")
								$("select[name=plano]").append('<option>360 Dias - R$ 0,00</option>');
							else
								$("select[name=plano] option:eq(4)").html('360 Dias - R$ 0,00');*/

							$("#lanchonete").show();
							$("input[name=responsavel]").attr('placeholder', 'Nome Responsável');
						}
					});
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
				<?php include('menu.php'); ?>

				<div class="col-sm-12 main">
					<h1 class="page-header">Editar informações</h1>
					<div class="row">
						<form role="form" method="post" enctype="multipart/form-data">
						<?php 
							if($_GET) { 
								if($_GET['msg'] == 'sucesso') { ?>
							<div style="clear:both" class="alert alert-success">Estabelecimento atualizado com suscesso</div>
						<?php } else if($_GET['msg'] == 'senha') { ?>
							<div style="clear:both" class="alert alert-danger">Senhas incorretas</div>
						<?php } } ?>
						<div class="col-sm-12">
							<div class="form-group">
								<div class="row">
									<div class="col-sm-5">
										<label>Nome da empresa</label>
										<input type="text" class="form-control" name="nome" required value="<?php echo $estabelecimento['name']; ?>" >
									</div>
									<div class="col-sm-5">
										<label>Categoria</label>
										<select class="form-control select2" name="estabelecimento[]" required multiple="">
											<?php for($i = 0; $i < sizeof($rowMenu); $i++) { ?>
											<option value="<?php echo $rowMenu[$i]['id']; ?>" <?php echo strpos($estabelecimento['subtype'], ','.$rowMenu[$i]['id'].',') !== false ? 'selected' : ''; ?>><?php echo ($rowMenu[$i]['name']); ?></option>
											<?php } ?>
										</select>
									</div>
									<div class="col-sm-2">
										<label>Nome na lista</label>
										<br>
				                        <div class="make-switch" data-on="sim" data-off="nao">
				                        	<input type="checkbox" value="sim" name="lista" <?php echo $estabelecimento['lista'] == 'sim' ? 'checked' : ''; ?>>
				                        </div>
									</div>
								</div>
							</div>
							<hr />
							<div class="form-group">
								<div class="row">
									<div class="col-sm-6">
										<label>E-mail</label>
										<input type="email" class="form-control" name="email" value="<?php echo $estabelecimento['email']; ?>" >
									</div>
									<div class="col-sm-6">
										<label>Senha</label>
										<input type="password" class="form-control" name="password" >
									</div>
								</div>
							</div>
							<hr />
							<div class="form-group">
								<div class="row">
									<div class="col-sm-6">
										<label>Nome do responsável</label>
										<input type="text" class="form-control" name="responsavel" required value="<?php echo $estabelecimento['responsible']; ?>" >
									</div>
									<div class="col-sm-6">
										<label>Telefone 1</label>
										<input type="text" class="form-control phone" name="telefone1" value="<?php echo $estabelecimento['phone1']; ?>" >
									</div>
								</div>
							</div>
							<hr />
							<div class="form-group">
								<div class="row">
									<div class="col-sm-6">
										<label>Telefone 2</label>
										<input type="text" class="form-control phone" name="telefone2" value="<?php echo $estabelecimento['phone2']; ?>" >
									</div>
									<div class="col-sm-6">
										<label>Celular</label>
										<input type="text" class="form-control phone" name="telefone3" value="<?php echo $estabelecimento['phone3']; ?>" >
									</div>
								</div>
							</div>
							<hr />
							<div id="us5" style="width: 485x; height: 400px;"></div>
							<hr />
							<div class="form-group row">
								<div class="col-sm-12">
									<label>Endereço</label>
									<input type="text" class="form-control" id="endereco" name="endereco" required value="<?php echo $estabelecimento['address']; ?>" >
								</div>
							</div>
							<div class="form-group row">
								<div class="col-sm-6">
									<label>Latitude</label>
									<input type="text" class="form-control" id="latView" value="<?php echo $estabelecimento['lat']; ?>" disabled>
								</div>
								<div class="col-sm-6">
									<label>Longitude</label>
									<input type="text" class="form-control" id="longitudeView" value="<?php echo $estabelecimento['longitude']; ?>" disabled>
								</div>
							</div>

							<input type="hidden" id="lat" name="lat">
							<input type="hidden" id="longitude" name="longitude">

							<div id="lanchonete">
								<hr />
								<div class="form-group">
									<div class="row">
										<div class="col-sm-6">
											<label>Data</label>
											<input type="date" class="form-control" name="date" value="<?php echo $estabelecimento['event_date']; ?>" >
										</div>
										<div class="col-sm-6">
											<label>Hora</label>
											<input type="time" class="form-control" name="time" value="<?php echo $estabelecimento['event_time']; ?>" >
										</div>
									</div>
								</div>
							</div>

							<div id="lanchonete">
								<hr />
								<div class="form-group">
									<div class="row">
										<div class="col-sm-6">
											<label>Masculino R$</label>
											<input type="text" class="form-control" name="man" value="<?php echo $estabelecimento['man']; ?>" >
										</div>
										<div class="col-sm-6">
											<label>Feminino R$</label>
											<input type="text" class="form-control" name="woman" value="<?php echo $estabelecimento['woman']; ?>" >
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
											<textarea class="form-control" name="description"><?php echo $estabelecimento['description']; ?></textarea>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="clear"></div>

						<hr />

						<button type="submit" class="btn btn-default pull-right">Atualizar</button>
					</form>

					</div>
				</div>
			</div>
		</div>

		<script>
            function updateControls(addressComponents, lat, longitude) {
                // $('#endereco').val(addressComponents.addressLine1);
                // $('#cidade').val(addressComponents.city);
                // $('#estado').val(addressComponents.stateOrProvince);
                // $('#cep').val(addressComponents.postalCode);
                // $('#bairro').val("");
                $('#lat').val(lat);
                $('#longitude').val(longitude);

                $('#latView').val(lat);
                $('#longitudeView').val(longitude);
            }
            $('#us5').locationpicker({
                location: {
                	latitude: <?php echo $estabelecimento['lat'] == "" ? "-8.063124160508963" : $estabelecimento['lat']; ?>, 
                	longitude: <?php echo $estabelecimento['longitude'] == "" ? "-34.871167497375495" : $estabelecimento['longitude']; ?>
                },
                radius: 10,
                onchanged: function (currentLocation, radius, isMarkerDropped) {
                    var addressComponents = $(this).locationpicker('map').location.addressComponents;
                    updateControls(addressComponents, currentLocation.latitude, currentLocation.longitude);
                },
                oninitialized: function(component) {
                    var addressComponents = $(component).locationpicker('map').location.addressComponents;
                    updateControls(addressComponents, <?php echo $estabelecimento['lat'] == "" ? "-8.063124160508963" : $estabelecimento['lat']; ?>, <?php echo $estabelecimento['longitude'] == "" ? "-34.871167497375495" : $estabelecimento['longitude']; ?>);
                }
            });
        </script>

	</body>
</html>