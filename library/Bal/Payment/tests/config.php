<?php
// Load
require_once(dirname(__FILE__).'/../Paypal.php');

// Create
$Paypal = new Bal_Payment_Paypal(array(
	'url' => 'https://www.sandbox.paypal.com/cgi-bin/webscr',
	'token' => '0ctkJcfypZk5536hrpk3TfV2goHrY1idPM67R4Z21KuFgKGeenh1MldQwUm',
	'business' => 'seller_1249741848_biz@balupton.com'
));
