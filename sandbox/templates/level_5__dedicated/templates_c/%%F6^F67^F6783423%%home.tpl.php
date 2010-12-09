<?php /* Smarty version 2.6.18, created on 2008-02-15 18:47:25
         compiled from page/home.tpl */ ?>
<?php require_once(SMARTY_CORE_DIR . 'core.load_plugins.php');
smarty_core_load_plugins(array('plugins' => array(array('modifier', 'default', 'page/home.tpl', 3, false),)), $this); ?>
		<div class="home">
			<div class="home_intro">
			<?php echo ((is_array($_tmp=@$this->_tpl_vars['intro'])) ? $this->_run_mod_handler('default', true, $_tmp, 'Welcome to <u>Unkown Home</u>') : smarty_modifier_default($_tmp, 'Welcome to <u>Unkown Home</u>')); ?>

			</div>
			<div class="home_content">
			Home Contents
			</div>
			<div class="home_outro">
			<?php $_smarty_tpl_vars = $this->_tpl_vars;
$this->_smarty_include(array('smarty_include_tpl_file' => 'page/home/outro.tpl', 'smarty_include_vars' => array()));
$this->_tpl_vars = $_smarty_tpl_vars;
unset($_smarty_tpl_vars);
 ?>
			</div>
		</div>