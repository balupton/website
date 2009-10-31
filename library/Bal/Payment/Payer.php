<?php
require_once 'Bal/Basic.php';
class Bal_Payment_Payer extends Bal_Basic {
	protected $id;
	
	protected $address1;
	protected $address2;
	protected $city;
	protected $country;
	protected $state;
	protected $postcode;
	
	protected $firstname;
	protected $lastname;
	protected $language = 'US';
	protected $charset;
	protected $phone;
}
