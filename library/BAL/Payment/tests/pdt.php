<?
// Load
require_once(dirname(__FILE__).'/config.php');

// Handle
$Paypal->loadResponse();

// Display
$Order = $Paypal->getOrder();

?><html><head>
	<title>Paypal PDT</title>
</head>
<body>
	<pre><?=var_export($Order, true)?></pre>
</body>
</html>