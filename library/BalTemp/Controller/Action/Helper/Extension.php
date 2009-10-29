<?php

class BAL_View_Helper_Extension extends Zend_View_Helper_Abstract {
	
	public function cond ( $this_value, $that_value ) {
		return $this_value ? $this_value : $that_value;
	}
	
}
