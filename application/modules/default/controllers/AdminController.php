<?php

/**
 * AdminController
 * 
 * @author
 * @version 
 */

require_once 'Zend/Controller/Action.php';

class AdminController extends Zend_Controller_Action {

	public function init () {
		// Layout
		$this->getHelper('Layout')->setLayout('admin');
	}
	
	public function indexAction () {
	}

}
