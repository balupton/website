<?
// Load
require_once(dirname(__FILE__).'/config.php');

// Display
$Cart = new Bal_Payment_Cart(array(
	'id' => intval(rand(50,200)),
	'currency' => 'AUD',
	'Items' => array(
		new Bal_Payment_Item(array(
			'id' => 1,
			'name' => 'My New Item',
			'amount' => 20.00
		)),
		new Bal_Payment_Item(array(
			'id' => 2,
			'name' => 'My Second New Item',
			'amount' => 40.00
		))
	)
));
$Payer = new Bal_Payment_Payer(array(
	'firstname' => 'Benjamin',
	'lastname' => 'Lupton'
));
$Order = new Bal_Payment_Order($Cart, $Payer, $Cart->id);

// Request
$form = $Paypal->applyOrder($Order)->generateForm('auto', array(
	'return' => 'http://www.balupton.com/paypal/pdt.php',
	'notify_url' => 'http://www.balupton.com/paypal/ipn.php'
), true);

?><html><head><title>Test</title></head><body><?
echo $form
?></body></html><?

