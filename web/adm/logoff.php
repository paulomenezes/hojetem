<?php
	session_start();

	$_SESSION['store'] = '';
	$_SESSION['adm'] = '';

	header("Location:index.php");
?>