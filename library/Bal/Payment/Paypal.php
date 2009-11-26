<?php;
require_once 'Bal/Payment/Item.php';
require_once 'Bal/Payment/Payer.php';
require_once 'Bal/Payment/Cart.php';
require_once 'Bal/Payment/Order.php';
class Bal_Payment_Paypal {
	
	protected $request = array();
	protected $response = array();
	protected $response_type;
	protected $settings = array(
		'custom' => array()
	);
	protected $Order;
	
	public function __construct ( $settings = array() ) {
		$this->settings = array_merge($this->settings, $settings);
		if ( empty($this->settings['transactions_path']) ) $this->settings['transactions_path'] = dirname(__FILE__).'/transactions';
		if ( empty($this->settings['logs_path']) ) $this->settings['logs_path'] = dirname(__FILE__).'/logs';
		return $this;
	}
	
	public function getOrder ( ) {
		return $this->Order;
	}
	
	public function setting ( $var, $value = null ) {
		if ( $value === null ) return $this->settings[$var];
		else $this->settings[$var] = $value;
		return $this;
	}
	
	public function applyOrder ( $Order ) {
		$this->Order = $Order;
		return $this;
	}
	
	public function generateForm ( $type, $request = array(), $prepare = false ) {
		// Prepare
		if ( $type === 'auto' ) {
			if ( sizeof($this->Order->Cart->Items) > 1 ) {
				$type = 'cart';
			} else {
				$type = 'buynow';
			}
		}
		
		// Handle
		switch ( $type ) {
			case 'cart':
				$this->request['cmd'] = '_cart';
				$this->request['upload'] = '1';
				break;
			case 'buynow':
				$this->request['cmd'] = '_xclick';
				if ( sizeof($this->Order->Cart->Items) > 1 ) {
					throw new Exception('Too many items for buynow.');
				}
				break;
		}
		
		// Apply more data
		$this->request['business'] = $this->settings['business'];
		$params = array('notify_url', 'return');
		foreach ( $params as $param ) {
			if ( !empty($this->settings[$param]) ) $this->request[$param] = $this->settings[$param];
		}
		if ( $prepare ) $this->prepareRequest();
		if ( !empty($request) ) $this->applyRequest($request);
		
		// Save
		$Store = array(
			'custom' => $this->settings['custom'],
			'Order' => $this->Order,
			'request' => $this->request
		);
		$this->setStore($Store, $this->Order->id);
		
		// Display
		ob_start();
		?><form action="<?=$this->settings['url']?>" method="post">
			<!--[Values]-->
			<? foreach ( $this->request as $key => $value ) : ?>
				<? if ( false ) : ?><label><strong><?=$key?>:</strong> <?=$value?><? endif; ?>
					<input type="hidden" name="<?=$key?>" value="<?=$value?>" />
				<? if ( false ) : ?></label><br /><? endif; ?>
			<? endforeach; ?>
			<!--[Button]-->
			<input type="image" name="submit" border="0" src="https://www.paypal.com/en_US/i/btn/btn_buynow_LG.gif" alt="PayPal - The safer, easier way to pay online">
			<img alt="" border="0" width="1" height="1" src="https://www.paypal.com/en_US/i/scr/pixel.gif" >
		</form><?
		$form = ob_get_contents();
		ob_end_clean();
		
		// Done
		return $form;
	}
	
	public function applyRequest ( array $request ) {
		$this->request = array_merge($this->request, $request);
		return $this;
	}
	
	public function prepareRequest ( ) {
		// Prepare
		$Order = $this->Order;
		
		// Map
		$map = array(
			'id' => 'invoice',
			'amount' => 'amount',
			'currency' => 'currency_code',
			'handling' => 'handling',
			'shipping' => 'shipping',
			'tax' => 'tax_cart',
			'weight' => 'weight_cart',
			'weight_unit' => 'weight_unit',
			'discount_amount' => 'discount_amount_cart',
			'discount_rate' => 'discount_rate_cart'
		);
		
		// Apply
		foreach ( $map as $field => $key ) {
			if ( !is_null($Order->Cart->$field) ) {
				$this->request[$key] = $Order->Cart->$field;
			}
		}
		
		// Map
		$map = array(
			'id' => 'item_number',
			'amount' => 'amount',
			'name' => 'item_name',
			
			'quantity' => 'quantity',
			'shipping' => 'shipping',
			'shipping_additional' => 'shipping2',
			'tax' => 'tax',
			'tax_rate' => 'tax_rate',
			'weight' => 'weight',
			'weight_unit' => 'weight_unit',
			'handling' => 'handling',
			
			'discount_amount' => 'discount_amount',
			'discount_rate' => 'discount_rate',
		);
		
		// Fetch
		$count = sizeof($Order->Cart->Items);
		if ( $count === 1 ) {
			$Item = $Order->Cart->Items[0];
			foreach ( $map as $field => $key ) {
				if ( !is_null($Item->$field) ) {
					$this->request[$key] = $Item->$field;
				}
			}
		} else {
			for ( $i=0,$n=$count; $i<$n; ++$i ) {
				$Item = $Order->Cart->Items[$i];
				foreach ( $map as $field => $key ) {
					if ( !is_null($Item->$field) ) {
						$key .= '_'.($i+1);
						$this->request[$key] = $Item->$field;
					}
				}
			}
		}
		
		// Map
		$map = array(
			'address1' => 'address1',
			'address2' => 'address2',
			'city' => 'city',
			'country' => 'country',
			'state' => 'state',
			'postcode' => 'zip',
			'firstname' => 'first_name',
			'lastname' => 'last_name',
			'language' => 'lc',
			'charset' => 'charset'
		);
		
		// Apply
		foreach ( $map as $field => $key ) {
			if ( !is_null($Order->Payer->$field) ) {
				$this->request[$key] = $Order->Payer->$field;
			}
		}
		
		// Phone
		if ( !empty($Order->Payer->phone) ) {
			$phone = $Order->Payer->phone;
			$z = strlen($phone)-1;
			$this->request['night_phone_c'] = substr($phone,-4);
			$this->request['night_phone_b'] = substr($phone,-7, 3);
			$this->request['night_phone_a'] = substr($phone,0,-7);
		}
		
		// Blah
		return $this;
	}
	
	public function loadResponse ( ) {
		$this->response = !empty($_POST) ? $_POST : $_GET;
		if ( empty($this->response['tx']) && empty($this->response['txn_id']) ) {
			return $this;
		}
		$this->response_type = !empty($this->response['tx']) ? 'pdt' : 'ipn';
		
		$this->log(array(
			'post' => $_POST,
			'get' => $_GET,
			'server' => $_SERVER
		), $this->response_type);
		
		switch ( $this->response_type ) {
			case 'pdt':
				// PDT Response
				$this->handlePDT();
				break;
			case 'ipn':
				// IPN Response
				$this->handleIPN();
				break;
			default:
				break;
		}
		
		// Done
		return $this;
	}
	
	public function handlePDT ( ) {
		// Check
		if ( empty($this->response['tx']) ) {
			// Error
			throw new Exception('PDT received an HTTP GET request without a transaction ID.');
			exit;
		}
		
		// Fields
		$fields = array(
			'cmd' => '_notify-synch',
			'tx' => $this->response['tx'],
			'at' => $this->settings['token'],
		);
		
		// Response
		$response = $this->PPHttpPost($this->settings['url'], $fields, true);
		
		// Check
		if( !$response['status']) {
			// Error
			throw new Exception($response['error_no'].': '.$response['error_msg']);
			exit;
		}
		
		// Fetch
		$httpParsedResponseAr = $response["httpParsedResponseAr"];
		
		// Transaction Numbers
		if ( $httpParsedResponseAr['txn_id'] !== $this->response['tx'] ) {
			// Error
			throw new Exception('Transaction IDs do not match.');
			exit;
		}
		
		// Merge
		$this->response = array_merge($this->response, $httpParsedResponseAr);
		$this->handleIPN();
	}
	
	public function handleIPN ( ) {
		// Map
		$map = array(
			'id' => 'item_number',
			'amount' => 'mc_gross_',
			'name' => 'item_name',
			'quantity' => 'quantity',
			'shipping' => 'mc_shipping',
			'tax' => 'tax',
			'handling' => 'mc_handling'
		);
		
		// Fetch
		$multiple = !empty($this->response['item_name1']);
		$Items = array();
		if ( !$multiple ) {
			$Item = new Bal_Payment_Item();
			foreach ( $map as $field => $key ) {
				$key = trim($key, '_');
				if ( isset($this->response[$key]) ) {
					$Item->$field = $this->response[$key];
				}
			}
			$Items[] = $Item;
		} else {
			for ( $i=1; true; ++$i ) {
				if ( !isset($this->response['item_name'.$i]) ) {
					// No more
					break;
				}
				$Item = new Bal_Payment_Item();
				foreach ( $map as $field => $key ) {
					$key .= $i;
					if ( isset($this->response[$key]) ) {
						$Item->$field = $this->response[$key];
					}
				}
				$Items[] = $Item;
			}
		}
		
		// Map
		$map = array(
			'id' => 'invoice',
			'amount' => 'mc_gross',
			'currency' => 'mc_currency',
			'handling' => array('handling_amount','mc_handling'),
			'shipping' => array('shipping','mc_shipping'),
			'tax' => 'tax'
		);
		
		// Fetch
		$Cart = new Bal_Payment_Cart();
		foreach ( $map as $field => $key ) {
			if ( !is_array($key) ) {
				$keys = array($key);
			} else {
				$keys = $key;
			}
			foreach ( $keys as $key ) {
				if ( isset($this->response[$key]) ) {
					$Cart->$field = $this->response[$key];
				}
			}
		}
		
		// Apply
		$Cart->Items = $Items;
		
		// Map
		$map = array(
			'address1' => 'address_street',
			'address2' => 'address_street2',
			'city' => 'address_city',
			'country' => 'address_country', // 'address_country_code',
			'state' => 'address_state',
			'postcode' => 'address_zip',
			'firstname' => 'first_name',
			'lastname' => 'last_name',
			'charset' => 'charset',
			'phone' => 'contact_phone'
		);
		
		// Apply
		$Payer = new Bal_Payment_Payer();
		foreach ( $map as $field => $key ) {
			if ( isset($this->response[$key]) ) {
				$Payer->$field = $this->response[$key];
			}
		}
		
		// Rebuild
		$Order = new Bal_Payment_Order($Cart, $Payer, $Cart->id);
		$Store = $this->getStore($Order->id);
		$this->Order = $Store['Order'];
		
		// Check dates
		$modified = strtotime($this->response['payment_date']);
		if ( $this->Order->last_modified > $modified ) {
			throw new Exception('Resource out of sync: ['.date('r',$this->Order->last_modified).']['.date('r',$modified));
		} else {
			$this->Order->last_modified = $modified;
		}
		
		// Log
		$this->log(array(
			'Order' => $Order,
			'$this->Order' => $this->Order,
			'Store' => $Store,
			'response' => $this->response
		));
		
		// Check
		$cart_checks = array(
			'id', 'amount', 'currency', 'handling', 'shipping', 'tax'
		);
		$item_checks = array(
			'id', 'amount', 'quantity', 'shipping', 'tax', 'handling'
		);
		$response_checks = array(
			'business' => $this->settings['business']
		);
		
		// Validate Cart
		foreach ( $cart_checks as $check ) {
			$value1 = $Order->Cart->$check;
			$value2 = $this->Order->Cart->$check;
			if ( is_numeric($value1) ) $value1 = intval($value1);
			if ( is_numeric($value2) ) $value2 = intval($value2);
			$valid = ($value1 === $value2) || (empty($value1) && empty($value2));
			if ( !$valid ) {
				throw new Exception('Cart check failed on: '.$check.' ['.$value1.'|'.$value2.']');
				exit;
			}
		}
		// Validate Items
		if ( sizeof($Order->Cart->Items) !== sizeof($Order->Cart->Items) ) {
			throw new Exception('Cart items size mismatch.');
		}
		$i = -1; foreach ( $Order->Cart->Items as $Item1 ) { ++$i;
			$Item2 = $this->Order->Cart->Items[$i];
			foreach ( $item_checks as $check ) {
				$value1 = $Item1->$check;
				$value2 = $Item2->$check;
				if ( is_numeric($value1) ) $value1 = intval($value1);
				if ( is_numeric($value2) ) $value2 = intval($value2);
				$valid = ($value1 === $value2) || (empty($value1) && empty($value2));
				if ( !$valid ) {
					throw new Exception('Item check failed on: '.$check.' ['.$value1.'|'.$value2.']');
					exit;
				}
			}
		}
		// Validate Response
		foreach ( $response_checks as $check => $value ) {
			$value1 = isset($this->response[$check]) ? $this->response[$check] : null;
			$value2 = $value;
			if ( is_numeric($value1) ) $value1 = intval($value1);
			if ( is_numeric($value2) ) $value2 = intval($value2);
			$valid = ($value1 === $value2) || (empty($value1) && empty($value2));
			if ( !$valid ) {
				throw new Exception('Response check failed on: '.$check.' ['.$value1.'|'.$value2.']');
				exit;
			}
		}
		
		// Update order
		$status = strtolower($this->response['payment_status']);
		switch ( $status ) {
			case 'canceled_reversal':
				// Canceled_Reversal: A reversal has been canceled. For example, you won a dispute with the customer, and the funds for the transaction that was reversed have been returned to you.
				throw new Exception('Canceled_Reversal: A reversal has been canceled. For example, you won a dispute with the customer, and the funds for the transaction that was reversed have been returned to you.');
				break;
			case 'denied':
				// Denied: You denied the payment. This happens only if the payment was previously pending because of possible reasons described for the pending_reason variable or the Fraud_Management_Filters_x variable.
				throw new Exception('Denied: You denied the payment. This happens only if the payment was previously pending because of possible reasons described for the pending_reason variable or the Fraud_Management_Filters_x variable.');
				break;
			case 'expired':
				// Expired: This authorization has expired and cannot be captured.
				throw new Exception('Expired: This authorization has expired and cannot be captured.');
				break;
			case 'failed':
				// Failed: The payment has failed. This happens only if the payment was made from your customer’s bank account.
				throw new Exception('Failed: The payment has failed. This happens only if the payment was made from your customer’s bank account.');
				break;
			case 'voided':
				// Voided: This authorization has been voided.
				throw new Exception('Voided: This authorization has been voided.');
				break;
			case 'reversed':
				// Reversed: A payment was reversed due to a chargeback or other type of reversal. The funds have been removed from your account balance and returned to the buyer. The reason for the reversal is specified in the ReasonCode element.
				throw new Exception('Reversed: A payment was reversed due to a chargeback or other type of reversal. The funds have been removed from your account balance and returned to the buyer. The reason for the reversal is specified in the ReasonCode element.');
				break;
			
			case 'created':
				// Created: A German ELV payment is made using Express Checkout.
			case 'pending':
				// Pending: The payment is pending. See pending_reason for more information.
			case 'refunded':
				// Refunded: You refunded the payment.
			case 'processed':
				// Processed: A payment has been accepted.
			case 'completed':
				// Completed: The payment has been completed, and the funds have been added successfully to your account balance.
				break;
		}
		
		// Apply
		$this->Order->status = $status;
		
		// Save
		$Store['Order'] = $this->Order;
		$Store['response'] = $this->response;
		$this->setStore($Store, $this->Order->id);
		
		// Done
		return $this;
	}
	
	public function getDetails ( ) {
		return $this->getStore($this->Order->id);
	}
	
	public function setStore ( $store, $file = 'store' ) {
		// Log
		$file = $this->settings['transactions_path'].'/'.$file.'.txt';
		file_put_contents($file, serialize($store));
		// Done
		return $this;
	}
	public function getStore ( $file = 'store' ) {
		// Log
		$file = $this->settings['transactions_path'].'/'.$file.'.txt';
		return unserialize(file_get_contents($file));
	}
	
	public function log ( $stuff, $file = 'log' ) {
		// Log
		$file = $this->settings['logs_path'].'/'.$file.'.txt';
		file_put_contents($file, "\n\n----\n".var_export($stuff,true), FILE_APPEND);
		// Done
		return $this;
	}
	
	/**
	 * Send HTTP POST Request
	 * @param	string	The request URL
	 * @param	string	The POST Message fields in &name=value pair format
	 * @param	bool		determines whether to return a parsed array (true) or a raw array (false)
	 * @return	array		Contains a bool status, error_msg, error_no, and the HTTP Response body(parsed=httpParsedResponseAr  or non-parsed=httpResponse) if successful
	 * @access	public
	 * @static
	 */
	public function PPHttpPost ($url, $fields, $parsed) {
		// Prepare
		if ( is_array($fields) ) {
			foreach ( $fields as $key => $value ) {
				$fields[$key] = $key.'='.rawurlencode(htmlspecialchars($value));
			}
			$fields = implode('&', $fields);
		}
		
		//setting the curl parameters.
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_VERBOSE, 1);
		
		//turning off the server and peer verification(TrustManager Concept).
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POST, 1);
		
		//setting the nvpreq as POST FIELD to curl
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
		
		//getting response from server
		$httpResponse = curl_exec($ch);
		
		if(!$httpResponse) {
			return array("status" => false, "error_msg" => curl_error($ch), "error_no" => curl_errno($ch));
		}
		
		if(!$parsed) {
			return array("status" => true, "httpResponse" => $httpResponse);
		}
		
		$httpResponseAr = explode("\n", $httpResponse);
		
		$httpParsedResponseAr = array();
		foreach ($httpResponseAr as $i => $value) {
			$tmpAr = explode("=", $value);
			if(sizeof($tmpAr) > 1) {
				$httpParsedResponseAr[$tmpAr[0]] = urldecode($tmpAr[1]);
			}
		}
		
		if(0 == sizeof($httpParsedResponseAr)) {
			$error = "Invalid HTTP Response for POST request($fields) to $url.";
			return array("status" => false, "error_msg" => $error, "error_no" => 0);
		}
		
		return array("status" => true, "httpParsedResponseAr" => $httpParsedResponseAr);
	}

}
