<?php if($_SESSION['adm'] != '') { include('menuadm.php'); } else { ?>
<style type="text/css">
	.row {
		margin: 0 auto;
		max-width: 1000px;
	}
	.nav-justified {
		margin-top: 20px;
		background-color: #eee;
		border: 1px solid #ccc;
		border-radius: 5px;
	}
	.nav-justified > li > a {
		padding-top: 15px;
		padding-bottom: 15px;
		margin-bottom: 0;
		font-weight: bold;
		color: #777;
		text-align: center;
		background-color: #e5e5e5; /* Old browsers */
		background-image:    -moz-linear-gradient(top, #f5f5f5 0%, #e5e5e5 100%); /* FF3.6+ */
		background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f5f5f5), color-stop(100%,#e5e5e5)); /* Chrome,Safari4+ */
		background-image: -webkit-linear-gradient(top, #f5f5f5 0%,#e5e5e5 100%); /* Chrome 10+,Safari 5.1+ */
		background-image:      -o-linear-gradient(top, #f5f5f5 0%,#e5e5e5 100%); /* Opera 11.10+ */
		background-image:         linear-gradient(top, #f5f5f5 0%,#e5e5e5 100%); /* W3C */
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f5f5f5', endColorstr='#e5e5e5',GradientType=0 ); /* IE6-9 */
		background-repeat: repeat-x; /* Repeat the gradient */
		border-bottom: 1px solid #d5d5d5;
	}
	.nav-justified > .active > a,
	.nav-justified > .active > a:hover,
	.nav-justified > .active > a:focus {
		background-color: #ddd;
		background-image: none;
		box-shadow: inset 0 3px 7px rgba(0,0,0,.15);
	}
	.nav-justified > li:first-child > a {
		border-radius: 5px 5px 0 0;
	}
	.nav-justified > li:last-child > a {
		border-bottom: 0;
		border-radius: 0 0 5px 5px;
	}
	@media (min-width: 768px) {
		.nav-justified {
			max-height: 52px;
		}
		.nav-justified > li > a {
			border-right: 1px solid #d5d5d5;
			border-left: 1px solid #fff;
		}
		.nav-justified > li:first-child > a {
			border-left: 0;
			border-radius: 5px 0 0 5px;
		}
		.nav-justified > li:last-child > a {
			border-right: 0;
			border-radius: 0 5px 5px 0;
		}
	}

	.nav-pills li
	{
		width: 33%;
		margin-top: 3px;
	}

	.nav-pills li a
	{
		font-size: 14px;	
	}

	.nav-pills li a .badge
	{
		color: black !important;
	}
</style>

<?php $pg = basename($_SERVER['PHP_SELF']); ?>

<div class="masthead">
	<ul class="nav nav-justified">
		<li <?php echo $pg == 'dashboard.php' ? 'class="active"' : ''; ?>><a href="dashboard.php">Pedidos</a></li>
		<li <?php echo $pg == 'cardapio.php' ? 'class="active"' : ''; ?>><a href="cardapio.php">Cardápio</a></li>
		<li><a href="logoff.php">Sair</a></li>
	</ul>
</div>
<?php } ?>