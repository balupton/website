<?php /* Smarty version 2.6.18, created on 2008-02-15 18:47:27
         compiled from page/search/result.tpl */ ?>
<?php require_once(SMARTY_CORE_DIR . 'core.load_plugins.php');
smarty_core_load_plugins(array('plugins' => array(array('modifier', 'default', 'page/search/result.tpl', 3, false),)), $this); ?>
				<div class="search_result">
					<div class="search_result_title">
					Welcome to Search Result <?php echo ((is_array($_tmp=@$this->_tpl_vars['results'][$this->_sections['result']['index']]['number'])) ? $this->_run_mod_handler('default', true, $_tmp, 'Unknown') : smarty_modifier_default($_tmp, 'Unknown')); ?>

					</div>
					<div class="search_result_content">
					Search Result <?php echo ((is_array($_tmp=@$this->_tpl_vars['results'][$this->_sections['result']['index']]['number'])) ? $this->_run_mod_handler('default', true, $_tmp, 'Unknown') : smarty_modifier_default($_tmp, 'Unknown')); ?>
 Contents
					</div>
					<div class="search_result_outro">
					Goodbye from Search Result <?php echo ((is_array($_tmp=@$this->_tpl_vars['results'][$this->_sections['result']['index']]['number'])) ? $this->_run_mod_handler('default', true, $_tmp, 'Unknown') : smarty_modifier_default($_tmp, 'Unknown')); ?>

					</div>
				</div>