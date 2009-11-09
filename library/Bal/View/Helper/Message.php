<?php
require_once 'Zend/View/Helper/Abstract.php';
class Bal_View_Helper_Message extends Zend_View_Helper_Abstract {

	public $messages = array();

	public $view;
	public function setView (Zend_View_Interface $view) {
		$this->view = $view;
	}

	public function message ( ) {
		return $this;
	}

	public function add ( $messages = array() ) {
		if ( is_array($messages) ) {
			if ( array_key_exists('title', $messages) ) {
				// Message
				array_keys_ensure($messages, array('title','status'));
				$this->addMessage($messages['title'], $messages['status']);
			} else {
				// Messages - Recursion
				foreach ( $messages as $message ) {
					$this->add($message);
				}
			}
		}
		return $this;
	}
	
	public function addMessage ( $title, $status ) {
		$this->messages[] = compact('title','status');
		return $this;
	}

	public function render ( ) {
		$result = '<div id="messages" class="messages">';
		foreach ( $this->messages as $message ) {
			$result .= '<div class="message '.$message['status'].'">'.$message['title'].'</div>';
		}
		$result .= '</div>';
		return $result;
	}

}