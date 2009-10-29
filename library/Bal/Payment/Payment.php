<?
class BAL_Basic {
	
	public function __get ( $key ) {
		$getter = 'get'.str_replace(' ','',ucwords(str_replace('_',' ',$key)));
		if ( method_exists($this, $getter) ) {
			return $this->$getter($key);
		} elseif ( property_exists($this, $key) ) {
			return $this->$key;
		} else {
			throw new Exception('Unkown property: '.$key);
		}
	}
	
	public function __set ( $key, $value ) {
		$setter = 'set'.str_replace(' ','',ucwords(str_replace('_',' ',$key)));
		if ( method_exists($this, $setter) ) {
			$this->$setter($value);
		} elseif ( property_exists($this, $key) ) {
			$this->$key = $value;
		} else {
			throw new Exception('Unkown property: '.$key);
		}
		return $this;
	}
	
	public function set ( $key, $value = null ) {
		if ( $value === null && is_array($key) ) {
			foreach ( $key as $_key => $_value ) {
				$this->set($_key, $_value);
			}
		} else {
			$this->$key = $value;
		}
		return $this;
	}
	
	public function __construct($data = null){
		if ( is_array($data) ) {
			$this->set($data);
		}
		return $this;
	}
}

class BAL_Payment_Item extends BAL_Basic {
	protected $id;
	protected $amount;
	protected $name;
	
	protected $quantity = 1.0;
	protected $shipping = 0.0;
	protected $shipping_additional = 0.0;
	protected $tax = 0.0;
	protected $tax_rate = 0.0;
	protected $weight = 0.0;
	protected $weight_unit = 'lbs';
	protected $handling = 0.0;
	
	protected $discount_amount = 0.0;
	protected $discount_rate = 0.0;
	
	public function getTotal ( ) {
		$total = $this->shipping + $this->quantity*$this->amount + ($this->quantity-1)*$this->shipping_additional;
		if ( $this->tax_rate ) $total *= $this->tax_rate;
		$total += $this->tax;
		return $total;
	}
	
	public function setWeightUnit ( $value ) {
		if ( !in_array($value, array('lbs','kgs')) ) {
			throw new Exception('Invalid weight unit: '.$value);
		}
		$this->weight_unit = $value;
		return $this;
	}
}

class BAL_Payment_Cart extends BAL_Basic {
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

class BAL_Payment_Payer extends BAL_Basic {
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

class BAL_Payment_Order {
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
