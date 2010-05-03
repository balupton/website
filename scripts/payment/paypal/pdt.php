<?php
/**
 * This file is the initial redirect after a paypal payment.
 * It is where the user will return to after successful payment.
 * @todo only successful?? or unsuccessful as well???
 * @todo this will need to be updated to be compatiable with balCMS systems, rather than just the Gates sytem.
 */

# Load
require_once(dirname(__FILE__).'/ipn.php');
// provides: PaymentInvoice, Invoice

# Redirect
header('Location: '.ROOT_URL.BASE_URL.'/payment/invoice/'.$Invoice->id);
die;
