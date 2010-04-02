<?php
# Prepare
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
	
# Load
if ( empty($Application) ) {
	# Bootstrap
	$run = $bootstrap = false;
	require_once(dirname(__FILE__).'/../../index.php');
}

# Load
$paypal = $Application->getOption('paypal');
$Paypal = new BAL_Payment_Paypal($paypal);