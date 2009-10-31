<?php
class Bal_View_Helper_Bal extends Zend_View_Helper_Abstract {

	public $view;
	public function setView (Zend_View_Interface $view) {
		$this->view = $view;
	}

	public function bal ( ) {
		return $this;
	}

	public function getBaseUrl ( $area = 'front ') {
		$baseUrl = Zend_Controller_Front::getInstance()->getBaseUrl();
		$suffix = '';
		switch ( $area ) {
			case 'front':
				break;
			case 'back':
			case 'admin':
				$suffix = '/back';
				break;
			default:
				break;
		}
		return $baseUrl.$suffix;
	}

}