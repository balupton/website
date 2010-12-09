<?php /* Smarty version 2.6.18, created on 2008-02-15 19:05:30
         compiled from index.tpl */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Templates: Level 7 - Dedicated</title>
	<?php if (! isset ( $this->_tpl_vars['jsmarty'] )): ?>
		<script type="text/javascript" src="js/template_selector.js"></script>
	<?php else: ?>
		<script type="text/javascript" src="js/jquery-1.2.1.min.js"></script>
		<script type="text/javascript" src="jsmarty/JSmarty.js?Compiler"></script>
		<script type="text/javascript" src="js/populate.js"></script>
	<?php endif; ?>
	<link rel="stylesheet" type="text/css" href="css/style.css" />
</head>
<body>

<div class="container">
	<div class="container_intro">
	Welcome to Container
	</div>
	<div class="container_content">

		<?php if (! isset ( $this->_tpl_vars['page'] )): ?><?php ob_start();
$_smarty_tpl_vars = $this->_tpl_vars;
$this->_smarty_include(array('smarty_include_tpl_file' => 'page/home.tpl', 'smarty_include_vars' => array()));
$this->_tpl_vars = $_smarty_tpl_vars;
unset($_smarty_tpl_vars);
$this->assign('page', ob_get_contents()); ob_end_clean();
 ?><?php endif; ?>
		<?php echo $this->_tpl_vars['page']; ?>

		
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