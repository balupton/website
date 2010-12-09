<?php /* Smarty version 2.6.18, created on 2008-02-15 18:47:27
         compiled from page/search.tpl */ ?>
<?php require_once(SMARTY_CORE_DIR . 'core.load_plugins.php');
smarty_core_load_plugins(array('plugins' => array(array('modifier', 'default', 'page/search.tpl', 22, false),)), $this); ?>
		<div class="search">
		
			<div class="search_intro">
			Welcome to Search
			</div>
		
			<div class="search_content">
			
			<?php if (! isset ( $this->_tpl_vars['results'] )): ?><?php $this->assign('results', 3); ?><?php endif; ?>
			<?php unset($this->_sections['result']);
$this->_sections['result']['name'] = 'result';
$this->_sections['result']['loop'] = is_array($_loop=$this->_tpl_vars['results']) ? count($_loop) : max(0, (int)$_loop); unset($_loop);
$this->_sections['result']['show'] = true;
$this->_sections['result']['max'] = $this->_sections['result']['loop'];
$this->_sections['result']['step'] = 1;
$this->_sections['result']['start'] = $this->_sections['result']['step'] > 0 ? 0 : $this->_sections['result']['loop']-1;
if ($this->_sections['result']['show']) {
    $this->_sections['result']['total'] = $this->_sections['result']['loop'];
    if ($this->_sections['result']['total'] == 0)
        $this->_sections['result']['show'] = false;
} else
    $this->_sections['result']['total'] = 0;
if ($this->_sections['result']['show']):

            for ($this->_sections['result']['index'] = $this->_sections['result']['start'], $this->_sections['result']['iteration'] = 1;
                 $this->_sections['result']['iteration'] <= $this->_sections['result']['total'];
                 $this->_sections['result']['index'] += $this->_sections['result']['step'], $this->_sections['result']['iteration']++):
$this->_sections['result']['rownum'] = $this->_sections['result']['iteration'];
$this->_sections['result']['index_prev'] = $this->_sections['result']['index'] - $this->_sections['result']['step'];
$this->_sections['result']['index_next'] = $this->_sections['result']['index'] + $this->_sections['result']['step'];
$this->_sections['result']['first']      = ($this->_sections['result']['iteration'] == 1);
$this->_sections['result']['last']       = ($this->_sections['result']['iteration'] == $this->_sections['result']['total']);
?>
				<?php $_smarty_tpl_vars = $this->_tpl_vars;
$this->_smarty_include(array('smarty_include_tpl_file' => "page/search/result.tpl", 'smarty_include_vars' => array()));
$this->_tpl_vars = $_smarty_tpl_vars;
unset($_smarty_tpl_vars);
 ?>
			<?php endfor; endif; ?>
				
			</div>
			
			<div class="search_outro">
			Goodbye from Search
			</div>
		
		</div>
		
		<script type="text/javascript">alert('You searched for: <?php echo ((is_array($_tmp=@$this->_tpl_vars['query'])) ? $this->_run_mod_handler('default', true, $_tmp, 'Unknown') : smarty_modifier_default($_tmp, 'Unknown')); ?>
');</script>