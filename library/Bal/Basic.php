<?php
class Bal_Basic {
	
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