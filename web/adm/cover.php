<?php
session_start();
if($_SESSION['store'] == '')
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
$upload_dir = "../images/store"; 				// The directory for the images to be saved in
$upload_path = $upload_dir."/";				// The path to where the image will be saved
$large_image_prefix = "resize_"; 			// The prefix name to large image
$thumb_image_prefix = "thumbnail_";			// The prefix name to the thumb image
$large_image_name = $large_image_prefix.$_SESSION['random_key'];     // New name of the large image (append the timestamp to the filename)
$thumb_image_name = $thumb_image_prefix.$_SESSION['random_key'];     // New name of the thumbnail image (append the timestamp to the filename)
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


##########################################################################################################
# IMAGE FUNCTIONS																						 #
# You do not need to alter these functions																 #
##########################################################################################################
function resizeImage($image,$width,$height,$scale) {
	list($imagewidth, $imageheight, $imageType) = getimagesize($image);
	$imageType = image_type_to_mime_type($imageType);
	$newImageWidth = ceil($width * $scale);
	$newImageHeight = ceil($height * $scale);
	$newImage = imagecreatetruecolor($newImageWidth,$newImageHeight);
	switch($imageType) {
		case "image/gif":
			$source=imagecreatefromgif($image); 
			break;
	    case "image/pjpeg":
		case "image/jpeg":
		case "image/jpg":
			$source=imagecreatefromjpeg($image); 
			break;
	    case "image/png":
		case "image/x-png":
			$source=imagecreatefrompng($image); 
			break;
  	}
	imagecopyresampled($newImage,$source,0,0,0,0,$newImageWidth,$newImageHeight,$width,$height);
	
	switch($imageType) {
		case "image/gif":
	  		imagegif($newImage,$image); 
			break;
      	case "image/pjpeg":
		case "image/jpeg":
		case "image/jpg":
	  		imagejpeg($newImage,$image,90); 
			break;
		case "image/png":
		case "image/x-png":
			imagepng($newImage,$image);  
			break;
    }
	
	chmod($image, 0777);
	return $image;
}
//You do not need to alter these functions
function resizeThumbnailImage($thumb_image_name, $image, $width, $height, $start_width, $start_height, $scale){
	list($imagewidth, $imageheight, $imageType) = getimagesize($image);
	$imageType = image_type_to_mime_type($imageType);
	
	$newImageWidth = ceil($width * $scale);
	$newImageHeight = ceil($height * $scale);
	$newImage = imagecreatetruecolor($newImageWidth,$newImageHeight);
	switch($imageType) {
		case "image/gif":
			$source=imagecreatefromgif($image); 
			break;
	    case "image/pjpeg":
		case "image/jpeg":
		case "image/jpg":
			$source=imagecreatefromjpeg($image); 
			break;
	    case "image/png":
		case "image/x-png":
			$source=imagecreatefrompng($image); 
			break;
  	}
	imagecopyresampled($newImage,$source,0,0,$start_width,$start_height,$newImageWidth,$newImageHeight,$width,$height);
	switch($imageType) {
		case "image/gif":
	  		imagegif($newImage,$thumb_image_name); 
			break;
      	case "image/pjpeg":
		case "image/jpeg":
		case "image/jpg":
	  		imagejpeg($newImage,$thumb_image_name,90); 
			break;
		case "image/png":
		case "image/x-png":
			imagepng($newImage,$thumb_image_name);  
			break;
    }
	chmod($thumb_image_name, 0777);
	return $thumb_image_name;
}
//You do not need to alter these functions
function getHeight($image) {
	$size = getimagesize($image);
	$height = $size[1];
	return $height;
}
//You do not need to alter these functions
function getWidth($image) {
	$size = getimagesize($image);
	$width = $size[0];
	return $width;
}

//Image Locations
$large_image_location = $upload_path.$large_image_name.$_SESSION['user_file_ext'];
$thumb_image_location = $upload_path.$thumb_image_name.$_SESSION['user_file_ext'];

//Create the upload directory with the right permissions if it doesn't exist
if(!is_dir($upload_dir)){
	mkdir($upload_dir, 0777);
	chmod($upload_dir, 0777);
}

//Check to see if any images with the same name already exist
if (file_exists($large_image_location)){
	if(file_exists($thumb_image_location)){
		$thumb_photo_exists = "<img src=\"".$upload_path.$thumb_image_name.$_SESSION['user_file_ext']."\" alt=\"Thumbnail Image\"/>";
	}else{
		$thumb_photo_exists = "";
	}
   	$large_photo_exists = "<img src=\"".$upload_path.$large_image_name.$_SESSION['user_file_ext']."\" alt=\"Large Image\"/>";
} else {
   	$large_photo_exists = "";
	$thumb_photo_exists = "";
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
			$large_image_location = $large_image_location.".".$file_ext;
			$thumb_image_location = $thumb_image_location.".".$file_ext;
			
			//put the file ext in the session so we know what file to look for once its uploaded
			$_SESSION['user_file_ext']=".".$file_ext;
			$_SESSION['position'] = $_POST['position'];
			
			move_uploaded_file($userfile_tmp, $large_image_location);
			chmod($large_image_location, 0777);
			
			$width = getWidth($large_image_location);
			$height = getHeight($large_image_location);
			//Scale the image if it is greater than the width set above
			if ($width > $max_width){
				$scale = $max_width/$width;
				$uploaded = resizeImage($large_image_location,$width,$height,$scale);
			}else{
				$scale = 1;
				$uploaded = resizeImage($large_image_location,$width,$height,$scale);
			}
			//Delete the thumbnail file so the user can create a new one
			if (file_exists($thumb_image_location)) {
				unlink($thumb_image_location);
			}
		}
		//Refresh the page to show the new uploaded image
		header("location:".$_SERVER["PHP_SELF"]);
		exit();
	}
}

if (isset($_POST["upload_thumbnail"]) && strlen($large_photo_exists)>0) {
	//Get the new coordinates to crop the image.
	$x1 = $_POST["x1"];
	$y1 = $_POST["y1"];
	$x2 = $_POST["x2"];
	$y2 = $_POST["y2"];
	$w = $_POST["w"];
	$h = $_POST["h"];
	//Scale the image to the thumb_width set above
	$scale = $thumb_width/$w;
	$cropped = resizeThumbnailImage($thumb_image_location, $large_image_location,$w,$h,$x1,$y1,$scale);

	//
	try 
	{   
		if ($_SESSION['show'] == 0 ) {
			$table = 'store';
		} else {
			$table = 'shows';
		}

		if ($_POST['position'] == 1) {
			$pos = "image";
		} else if ($_POST['position'] == 2) {
			$pos = "image1";
		} else if ($_POST['position'] == 3) {
			$pos = "image2";
		} else if ($_POST['position'] == 4) {
			$pos = "image3";
		}

		$sql_insert = "UPDATE " . $table . " SET " . $pos . " = ? WHERE id = '".$store['id']."'";

	    $stmt = $conn->prepare($sql_insert);
	    $stmt->bindValue(1, explode("/", $cropped)[sizeof(explode("/", $cropped)) - 1]);
	    $stmt->execute();
	}
	catch ( PDOException $e ) 
	{ 
		print("Houve um error, tente novamente ou volte mais tarde.");
		die(print_r($e));
	}
	//

	//Reload the page again to view the thumbnail
	header("location:".$_SERVER["PHP_SELF"]);
	exit();
}


if ($_GET['a']=="delete" && strlen($_GET['t'])>0){
//get the file locations 
	$large_image_location = $upload_path.$large_image_prefix.$_GET['t'];
	$thumb_image_location = $upload_path.$thumb_image_prefix.$_GET['t'];
	if (file_exists($large_image_location)) {
		unlink($large_image_location);
	}
	if (file_exists($thumb_image_location)) {
		unlink($thumb_image_location);
	}

	//
	try 
	{   
		if ($_SESSION['show'] == 0 ) {
			$sql_insert = "UPDATE store SET image = ? WHERE id = '".$store['id']."'";
		} else {
			$sql_insert = "UPDATE shows SET image = ? WHERE id = '".$store['id']."'";
		}

	    $stmt = $conn->prepare($sql_insert);
	    $stmt->bindValue(1, '');
	    $stmt->execute();
	}
	catch ( PDOException $e ) 
	{ 
		print("Houve um error, tente novamente ou volte mais tarde.");
		die(print_r($e));
	}
	//

	header("location:".$_SERVER["PHP_SELF"]);
	exit(); 
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

				<div class="row" id="menu">
					<div class="row">
						<div class="col-sm-3">
							<h2 class="page-header">Alterar Cover</h2>
							<?php 
								if ($_SESSION['show'] == 0 ) {
									$sqlHorario = "SELECT * FROM store WHERE id = '".$store['id']."'";
								} else {
									$sqlHorario = "SELECT * FROM shows WHERE id = '".$store['id']."'";
								}
								$stmt = $conn->query($sqlHorario);
								$horario = $stmt->fetchAll(); 

								if($horario[0]['image'] != "")
									echo '<img src="../images/store/'.$horario[0]['image'].'" style="width:100%" /><hr />';
								else
									echo 'Nenhuma imagem encontrada';
							?>
						</div>
						<div class="col-sm-3">
							<h2 class="page-header">Galeria 1</h2>
							<?php 
								if ($_SESSION['show'] == 0 ) {
									$sqlHorario = "SELECT * FROM store WHERE id = '".$store['id']."'";
								} else {
									$sqlHorario = "SELECT * FROM shows WHERE id = '".$store['id']."'";
								}
								$stmt = $conn->query($sqlHorario);
								$horario = $stmt->fetchAll(); 

								if($horario[0]['image1'] != "")
									echo '<img src="../images/store/'.$horario[0]['image1'].'" style="width:100%" /><hr />';
								else
									echo 'Nenhuma imagem encontrada';
							?>
						</div>
						<div class="col-sm-3">
							<h2 class="page-header">Galeria 2</h2>
							<?php 
								if ($_SESSION['show'] == 0 ) {
									$sqlHorario = "SELECT * FROM store WHERE id = '".$store['id']."'";
								} else {
									$sqlHorario = "SELECT * FROM shows WHERE id = '".$store['id']."'";
								}
								$stmt = $conn->query($sqlHorario);
								$horario = $stmt->fetchAll(); 

								if($horario[0]['image2'] != "")
									echo '<img src="../images/store/'.$horario[0]['image2'].'" style="width:100%" /><hr />';
								else
									echo 'Nenhuma imagem encontrada';
							?>
						</div>
						<div class="col-sm-3">
							<h2 class="page-header">Galeria 3</h2>
							<?php 
								if ($_SESSION['show'] == 0 ) {
									$sqlHorario = "SELECT * FROM store WHERE id = '".$store['id']."'";
								} else {
									$sqlHorario = "SELECT * FROM shows WHERE id = '".$store['id']."'";
								}
								$stmt = $conn->query($sqlHorario);
								$horario = $stmt->fetchAll(); 

								if($horario[0]['image3'] != "")
									echo '<img src="../images/store/'.$horario[0]['image3'].'" style="width:100%" /><hr />';
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
									<option value="1">COVER</option>
									<option value="2">GALERIA 1</option>
									<option value="3">GALERIA 2</option>
									<option value="4">GALERIA 3</option>
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