<?php
require_once 'Bal/Payment/Payer.php';
require_once 'Bal/Payment/Cart.php';
class Bal_Payment_Order {
	public $Cart;
	public $Payer;
	public $status;
	public $id;
	public $last_modified;
	
	public function __construct ( $Cart, $Payer, $id = null ) {
		$this->Cart = $Cart;
		$this->Payer = $Payer;
		$this->id = $id;
		return $this;
	}
}
