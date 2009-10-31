<?php
require_once 'Zend/Cotnroller/Action/Helper/Abstract.php';
/**
 * Action Helper for loading forms
 *
 * @uses Zend_Controller_Action_Helper_Abstract
 */
class Bal_Controller_Action_Helper_Transfer extends Zend_Controller_Action_Helper_Abstract {
	
	public function file ( $file_path, $buffer_size = null ) {
		
        $this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
        $this->getResponse()->clearAllHeaders();
	}
	
	public function data ( $file_data, $content_type = NULL, $file_name, $file_time ) {
		
	}
}
