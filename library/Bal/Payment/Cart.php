<?php
require_once 'Bal/Basic.php';
require_once 'Bal/Payment/Item.php';
class Bal_Payment_Cart extends Bal_Basic {
	public $Items = array();
	
	protected $id;
	
	protected $currency = 'AUD';
	protected $handling;
	protected $shipping;
	protected $tax;
	protected $weight;
	protected $weight_unit = 'lbs';
	
	protected $discount_amount;
	protected $discount_rate;
	
	protected $amount;
	
	public function getAmount ( ) {
		if ( !empty($this->amount) ) return $this->amount;
		return $this->total;
	}
	
	public function getTotal ( ) {
		$total = 0.0;
		foreach ( $this->Items as $Item ) {
			$total += $Item->total;
		}
		return $total;
	}
	
}