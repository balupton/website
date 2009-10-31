<?php

class Bal_Framework {
	
	public static function import ( $libraries = array() ) {
		$balphp__sub_packages = $libraries;
		$file = 'balphp.php';
		if ( file_exists($file) ) {
			require($file);
		} elseif ( defined('BALPHP_PATH') && file_exists(BALPHP_PATH.DIRECTORY_SEPARATOR.$file) ) {
			require(BALPHP_PATH.DIRECTORY_SEPARATOR.$file);
		} else {
			var_dump(get_include_path());
			throw new Zend_Exception ('Could not find balPHP');
		}
	}
	
}
