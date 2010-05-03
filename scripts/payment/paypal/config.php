<?php
# Prepare
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
	
# Load
if ( empty($Application) ) {
	# Bootstrap
	$run = $bootstrap = false;
	require_once(dirname(__FILE__).'/../../../index.php');
}

# Boostrap
$Application->bootstrap('autoload');
$Application->bootstrap('balphp');
$Application->bootstrap('doctrine');

# Load
$payment = $Application->getOption('payment');
$paypal = array_merge($payment['default'], $payment['paypal']);
$Paypal = new Bal_Payment_Gateway_Paypal($paypal);