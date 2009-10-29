<?
// Load
require_once(dirname(__FILE__).'/config.php');

// Handle
$Paypal->loadResponse();

// Order
$Order = $Paypal->getOrder();
if ( $Order && $Order->status ) {
	// We have a order worthy of storing
}
