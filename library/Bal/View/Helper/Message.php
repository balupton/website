<?php
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
		if ( empty($messages) ) {
			throw new Zend_Exception('bal-view-helper-message-add-exception-invalid');
			return false;
		} elseif ( !empty($messages['title']) ) {
			$this->addMessage($messages['title'], $messages['status']);
		} elseif ( is_array($messages) ) {
			foreach ( $messages as $message ) {
				$this->add($message);
			}
		}
		return $this;
	}
	public function addMessage ( $title, $status ) {
		$this->messages[] = compact('title','status');
	}

	public function render ( ) {
		?><div id="message" class="updated fade">
	        <p>
	            Post updated. <a href="http://balupton.wordpress.com/2007/11/16/hello-world/">View post</a>
	        </p>
	    </div><?
	}

}