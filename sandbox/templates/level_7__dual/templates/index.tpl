<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Templates: Level 7 - Dual Side Templating (Seperate Installations) (Not Fully Functional)</title>
	{if !isset($jsmarty) }
		<script type="text/javascript" src="js/template_selector.js"></script>
	{else}
		<script type="text/javascript" src="js/jquery-1.2.1.min.js"></script>
		<script type="text/javascript" src="jsmarty/JSmarty.js?Compiler"></script>
		<script type="text/javascript" src="js/populate.js"></script>
	{/if}
	<link rel="stylesheet" type="text/css" href="css/style.css" />
</head>
<body>

<div class="container">
	<div class="container_intro">
	Welcome to Container
	</div>
	<div class="container_content">

		{if !isset($page)}{include file='page/home.tpl' assign='page'}{/if}
		{$page}
		
	</div>
	
	<div class="container_outro">
	Goodbye from Container
	</div>
	
</div>

<div class="links">
<a href="index.php?page=home">Home</a>
<a href="index.php?page=search">Search</a>
</div>

</body>
</html>