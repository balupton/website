<?php
/**
 * This file is from the paypal system api.
 * It gets the information of the transaction over the multiple stages and ensures vailidty.
 * @todo this will need to be updated to be compatiable with balCMS systems, rather than just the Gates sytem.
 */

# Load
require_once(dirname(__FILE__).'/config.php');

# Load the response
$Paypal->loadResponse();

# Bootstrap Doctrine
$Application->bootstrap('script-paypal');

# Load the Details
$details = $Paypal->getDetails();
$Order = $details['Order'];
$id = $Order->id;
$status = $Order->status;
$modified = $Order->last_modified;

# Create the Payment
$Payment = Doctrine::getTable('Payment')->find($id); if ( empty($Payment) ) $Payment = new Payment();
$Payment->id = $Order->id;
$Payment->status = $status;
if ( empty($Payment->created) ) $Payment->created = doctrine_timestamp();
$Payment->modified =  date('Y-m-d H:i:s', $modified);
$Payment->details = $details;
$Payment->save();
/**
 * @todo Payments are not currently part of the balCMS systems, will need to be at some point
 */

# We may want to continue into other scripts, so don't die