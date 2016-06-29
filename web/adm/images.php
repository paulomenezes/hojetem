<?php
session_start();
if($_SESSION['adm'] == '')
{
	header("Location:index.php");
}

$store = $_SESSION['store'];

require("../connect.php");
/*
* Copyright (c) 2008 http://www.webmotionuk.com / http://www.webmotionuk.co.uk
* "PHP & Jquery image upload & crop"
* Date: 2008-11-21
* Ver 1.2
* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
* IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, 
* INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, 
* PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
* STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF 
* THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
*/
error_reporting (E_ALL ^ E_NOTICE);
session_start(); //Do not remove this
//only assign a new timestamp if the session variable is empty
if (!isset($_SESSION['random_key']) || strlen($_SESSION['random_key'])==0){
    $_SESSION['random_key'] = strtotime(date('Y-m-d H:i:s')); //assign the timestamp to the session variable
	$_SESSION['user_file_ext']= "";
}
#########################################################################################################
# CONSTANTS																								#
# You can alter the options below																		#
#########################################################################################################
$upload_dir = "../images/img"; 				// The directory for the images to be saved in
$upload_path = $upload_dir."/";				// The path to where the image will be saved
$large_image_prefix = "resize_"; 			// The prefix name to large image
$thumb_image_prefix = "thumbnail_";			// The prefix name to the thumb image
$large_image_name = $large_image_prefix;     // New name of the large image (append the timestamp to the filename)
$thumb_image_name = $thumb_image_prefix;     // New name of the thumbnail image (append the timestamp to the filename)
$max_file = "3"; 							// Maximum file size in MB
$max_width = "2000";							// Max width allowed for the large image
$thumb_width = "500";						// Width of thumbnail image
$thumb_height = "217";						// Height of thumbnail image
// Only one of these image types should be allowed for upload
$allowed_image_types = array('image/pjpeg'=>"jpg",'image/jpeg'=>"jpg",'image/jpg'=>"jpg",'image/png'=>"png",'image/x-png'=>"png",'image/gif'=>"gif");
$allowed_image_ext = array_unique($allowed_image_types); // do not change this
$image_ext = "";	// initialise variable, do not change this.
foreach ($allowed_image_ext as $mime_type => $ext) {
    $image_ext.= strtoupper($ext)." ";
}

//Image Locations
$large_image_location = $upload_path.$large_image_name;
$thumb_image_location = $upload_path.$thumb_image_name;

//Create the upload directory with the right permissions if it doesn't exist
if(!is_dir($upload_dir)){
	mkdir($upload_dir, 0777);
	chmod($upload_dir, 0777);
}

if (isset($_POST["upload"])) { 
	//Get the file information
	$userfile_name = $_FILES['image']['name'];
	$userfile_tmp = $_FILES['image']['tmp_name'];
	$userfile_size = $_FILES['image']['size'];
	$userfile_type = $_FILES['image']['type'];
	$filename = basename($_FILES['image']['name']);
	$file_ext = strtolower(substr($filename, strrpos($filename, '.') + 1));
	
	//Only process if the file is a JPG, PNG or GIF and below the allowed limit
	if((!empty($_FILES["image"])) && ($_FILES['image']['error'] == 0)) {
		
		foreach ($allowed_image_types as $mime_type => $ext) {
			//loop through the specified image types and if they match the extension then break out
			//everything is ok so go and check file size
			if($file_ext==$ext && $userfile_type==$mime_type){
				$error = "";
				break;
			}else{
				$error = "Por favor, envie apenas imagens (<strong>".$image_ext."</strong>)<br />";
			}
		}
		//check if the file size is above the allowed limit
		if ($userfile_size > ($max_file*1048576)) {
			$error.= "Imagens com no máximo ".$max_file."MB";
		}
		
	}else{
		$error= "Por favor selecione uma imagem";
	}
	//Everything is ok, so we can upload the image.
	if (strlen($error)==0){
		
		if (isset($_FILES['image']['name'])){
			//this file could now has an unknown file extension (we hope it's one of the ones set above!)
			$large_image_location = "../images/img/show_".$_POST['position'].".".$file_ext;
			
			//put the file ext in the session so we know what file to look for once its uploaded
			$_SESSION['user_file_ext']=".".$file_ext;
			$_SESSION['position'] = $_POST['position'];
			
			move_uploaded_file($userfile_tmp, $large_image_location);
			chmod($large_image_location, 0777);

			try 
			{   
				$sql_insert = "UPDATE images SET image = ? WHERE id = '".$_POST['position']."'";

			    $stmt = $conn->prepare($sql_insert);
			    $stmt->bindValue(1, 'images/img/' . "show_" . $_POST['position'].".".$file_ext);
			    $stmt->execute();
			}
			catch ( PDOException $e ) 
			{ 
				print("Houve um error, tente novamente ou volte mais tarde.");
				die(print_r($e));
			}
		}
		//Refresh the page to show the new uploaded image
		header("location:".$_SERVER["PHP_SELF"]);
		exit();
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

		<script type="text/javascript" src="js/jquery-pack.js"></script>
		<script type="text/javascript" src="js/jquery.imgareaselect.min.js"></script>
	</head>

	<body>

		<div class="banner">
			<div class="logo"></div>
		</div>

		<div class="container-fluid">
			<div class="row">

				<div class="row" id="menu" style="width: 1000px;margin: 0 auto;">
					<div class="row">
						<div class="col-sm-3">
							<h2 class="page-header">Hoje</h2>
							<?php 
								$sqlHorario = "SELECT * FROM images WHERE id = 1";
								$stmt = $conn->query($sqlHorario);
								$horario = $stmt->fetchAll(); 

								if($horario[0]['image'] != "")
									echo '<img src="/'.$horario[0]['image'].'" style="width:100%" /><hr />';
								else
									echo 'Nenhuma imagem encontrada';
							?>
						</div>
						<div class="col-sm-3">
							<h2 class="page-header">Essa semana</h2>
							<?php 
								$sqlHorario = "SELECT * FROM images WHERE id = 2";
								$stmt = $conn->query($sqlHorario);
								$horario = $stmt->fetchAll(); 

								if($horario[0]['image'] != "")
									echo '<img src="/'.$horario[0]['image'].'" style="width:100%" /><hr />';
								else
									echo 'Nenhuma imagem encontrada';
							?>
						</div>
						<div class="col-sm-3">
							<h2 class="page-header">Esse mês</h2>
							<?php 
								$sqlHorario = "SELECT * FROM images WHERE id = 3";
								$stmt = $conn->query($sqlHorario);
								$horario = $stmt->fetchAll(); 

								if($horario[0]['image'] != "")
									echo '<img src="/'.$horario[0]['image'].'" style="width:100%" /><hr />';
								else
									echo 'Nenhuma imagem encontrada';
							?>
						</div>
						<div class="col-sm-3">
							<h2 class="page-header">Mais</h2>
							<?php 
								$sqlHorario = "SELECT * FROM images WHERE id = 4";
								$stmt = $conn->query($sqlHorario);
								$horario = $stmt->fetchAll(); 

								if($horario[0]['image'] != "")
									echo '<img src="/'.$horario[0]['image'].'" style="width:100%" /><hr />';
								else
									echo 'Nenhuma imagem encontrada';
							?>
						</div>

					</div>
					<div class="clear"></div>
					<?php
					//Only display the javacript if an image has been uploaded
					if(strlen($large_photo_exists)>0){
						$current_large_image_width = getWidth($large_image_location);
						$current_large_image_height = getHeight($large_image_location);?>
					<script type="text/javascript">
					function preview(img, selection) { 
						var scaleX = <?php echo $thumb_width;?> / selection.width; 
						var scaleY = <?php echo $thumb_height;?> / selection.height; 
						
						$('#thumbnail + div > img').css({ 
							width: Math.round(scaleX * <?php echo $current_large_image_width;?>) + 'px', 
							height: Math.round(scaleY * <?php echo $current_large_image_height;?>) + 'px',
							marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px', 
							marginTop: '-' + Math.round(scaleY * selection.y1) + 'px' 
						});
						$('#x1').val(selection.x1);
						$('#y1').val(selection.y1);
						$('#x2').val(selection.x2);
						$('#y2').val(selection.y2);
						$('#w').val(selection.width);
						$('#h').val(selection.height);
					} 

					$(document).ready(function () { 
						$('#save_thumb').click(function() {
							var x1 = $('#x1').val();
							var y1 = $('#y1').val();
							var x2 = $('#x2').val();
							var y2 = $('#y2').val();
							var w = $('#w').val();
							var h = $('#h').val();
							if(x1=="" || y1=="" || x2=="" || y2=="" || w=="" || h==""){
								alert("Selecione uma miniatura");
								return false;
							}else{
								return true;
							}
						});
					}); 

					$(window).load(function () { 
						$('#thumbnail').imgAreaSelect({ aspectRatio: '1:<?php echo $thumb_height/$thumb_width;?>', onSelectChange: preview }); 
					});

					</script>
					<?php }?>
					<?php
					//Display error message if there are any
					if(strlen($error)>0){
						echo "<h3>Houve um error:</h3><div class='alert alert-danger'>".$error."</div>";
					}
					if(strlen($large_photo_exists)>0 && strlen($thumb_photo_exists)>0){
						echo $thumb_photo_exists;
						echo "<p><a class='btn btn-danger' href=\"".$_SERVER["PHP_SELF"]."?a=delete&t=".$_SESSION['random_key'].$_SESSION['user_file_ext']."\">Deletar imagem</a></p>";
						echo "<p><a class='btn btn-primary' href=\"".$_SERVER["PHP_SELF"]."\">Enviar outra imagem</a></p>";
						//Clear the time stamp session and user file extension
						$_SESSION['random_key']= "";
						$_SESSION['user_file_ext']= "";
					}else{
							if(strlen($large_photo_exists)>0){?>
							<h2>Criar miniatura</h2>
							<div align="center">
								<img src="<?php echo $upload_path.$large_image_name.$_SESSION['user_file_ext'];?>" style="float: left; margin-right: 10px;" id="thumbnail" alt="Criar miniatura" />

								<div style="border:1px #e5e5e5 solid; float:left; position:relative; overflow:hidden; width:<?php echo $thumb_width;?>px; height:<?php echo $thumb_height;?>px;">
									<img src="<?php echo $upload_path.$large_image_name.$_SESSION['user_file_ext'];?>" style="position: relative;" alt="Visualização de miniatura" />
								</div>
								<form name="thumbnail" action="<?php echo $_SERVER["PHP_SELF"];?>" method="post">
									<input type="hidden" name="x1" value="" id="x1" />
									<input type="hidden" name="y1" value="" id="y1" />
									<input type="hidden" name="x2" value="" id="x2" />
									<input type="hidden" name="y2" value="" id="y2" />
									<input type="hidden" name="w" value="" id="w" />
									<input type="hidden" name="h" value="" id="h" />
									<input type="hidden" name="position" value="<?php echo $_SESSION['position']; ?>" id="position" />
									<input type="submit" name="upload_thumbnail" value="Salvar miniatura" id="save_thumb" class="btn btn-default" style="margin-right: 10px; margin-top: 10px; float:right" />
									<div style="margin: 10px; float:left" class="alert alert-info">Arraste sobre a imagem para criar uma miniatura</div>
								</form>
								<div style="clear:both"></div>
							</div>
						<hr />
						<?php 	} ?>
						<h2>Selecionar uma imagem</h2>
						<form name="photo" enctype="multipart/form-data" action="<?php echo $_SERVER["PHP_SELF"];?>" method="post">
							<div class="col-sm-5">
								<input type="file" name="image" class="form-control" /> 
							</div>
							<div class="col-sm-3">
								<select name="position" class="form-control">
									<option value="1">Hoje</option>
									<option value="2">Essa semana</option>
									<option value="3">Esse mês</option>
									<option value="4">Mais</option>
								</select>
							</div>
							<input type="submit" name="upload" value="Enviar" class="col-sm-2 btn btn-default" />
						</form>
					<?php } ?>
				</div>
			</div>
		</div>

	</body>

</html>
