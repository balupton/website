<?php
require_once 'Zend/View/Helper/Abstract.php';
class Bal_View_Helper_Widget extends Zend_View_Helper_Abstract {
	
	public $view;
	public function setView (Zend_View_Interface $view) {
		$this->view = $view;
	}
	
	
	protected $widgets = array();
	
	public function widget ( ) {
		return $this;
	}
	
	public function addWidgets ( $widgets ) {
		foreach ( $widgets as $code => $params ) {
			$this->addWidget($code, $params);
		}
		return $this;
	}
	public function addWidget ( $code, $params = array() ) {
		$this->widgets[$code] = $params;
		return $this;
	}
	
	public function getWidget ( $code ) {
		return $this->widgets[$code];
	}
	
	public function render ( $code, $params = array() ) {
		// Prepare
		$widget = $this->getWidget($code);
		if ( !empty($widget['helper']) ) {
			$helper = $widget['helper'];
		} else {
			throw new Zend_Exception('Widget requires helper.');
		}
		if ( !empty($widget['name']) ) {
			$name = $widget['name'];
		} else {
			$name = $code;
		}
		if ( !empty($widget['action']) ) {
			$action = $widget['action'];
		} else {
			$action = 'render'.ucfirst($name).'Widget';
		}
		
		// Handle
		$render = $this->view->getHelper($helper)->$action($params);
		
		// Done
		return $render;
	}
	
	protected function renderAllReplace ( $code, $content = '', $params = array() ) {
		// Prepare
		$params = array(); // not supported yet
		
		// Handle
		$params['content'] = $content;
		
		// Render
		$render = $this->render($code, $params);
		
		// Done
		return $render;
	}
	
	public function renderAll ( $content ) {
		// Prepare
		
		// Search
		$matches = array();
		$search =
		'/' .
			'\['.
				'(?<code>'.
					'('.implode(array_keys($this->widgets),'|').')'.
				')'.
				'\s*(?<params>[^\]]*)'.
			'\]'.
			'('.
				'(?<content>[^\]]*)'.
				'\[\/' . '\1' . '\]' .
			')?'.
		'/e';
		$replace = '\$this->renderAllReplace( "${1}", "${5}", "${3}" )';
		$render = preg_replace($search, $replace, $content);
		
		// Done
		return $render;
	}
	
}