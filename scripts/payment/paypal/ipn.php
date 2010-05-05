<?php
/**
 * This file is from the paypal system api.
 * It gets the information of the transaction over the multiple stages and ensures vailidty.
 * @todo this will need to be updated to be compatiable with balCMS systems, rather than just the Gates sytem.
 */

# Load
require_once(dirname(__FILE__).'/config.php');

# Fetch the Payment Invoice
$PaymentInvoice = $Paypal->handleResponse();

# Process the Payment for the Doctrine Invoice
$Invoice = Bal_Doctrine_Core::fetchRecord('Invoice',array('Invoice'=>$PaymentInvoice->id));
$Invoice->processPaymentAndSave($PaymentInvoice);

# We may want to continue into other scripts, so don't die