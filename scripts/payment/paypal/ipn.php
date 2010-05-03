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

# Save the Doctrine Invoice
$Invoice = Doctrine::getTable('Invoice')->find($PaymentInvoice->id);
$Invoice->payment_status	= $PaymentInvoice->payment_status;
$Invoice->payment_fee		= $PaymentInvoice->payment_fee;
$Invoice->paid_at			= doctrine_timestamp($PaymentInvoice->paid_at);
$Invoice->save();

# We may want to continue into other scripts, so don't die