<?php
require_once 'Doctrine/Record/Listener.php';
class Bal_Doctrine_Record_Listener_Html extends Doctrine_Record_Listener {
	
	protected $_default = false;
	protected $Purifier;
	
	/**
	 * Construct our HTML santizer for Doctrine Record
	 * @param object $default [optional]
	 * @return
	 */
	public function __construct ( $default = false ) {
		$this->_default = $default;
		// Require Necessary
		require_once(HTMLPURIFIER_PATH.'/HTMLPurifier.auto.php');
		$this->Purifier = HTMLPurifier::getInstance();
	}
	
	/**
	 * Apply HTML sanitization automaticly on a save.
	 * @param object $event
	 * @return
	 */
    public function preSave (Doctrine_Event $event) {
    	$Record = $event->getInvoker();
    	$Table = $Record->getTable();
		$columns = $Table->getColumns();
		foreach ( $columns as $column => $properties ) {
			$value = $Record->get($column);
			if ( empty($value) || $properties['type'] !== 'string' ) continue;
			$html = isset($properties['extra']['html']) ? $properties['extra']['html'] : $this->_default;
			if ( !$html ) $html = 'none'; elseif ( $html === true ) $html = 'normal';
			switch ( $html ) {
				case 'raw':
					// Allow for raw html
					break;
				case 'simple':
					// Only allow simple tags without attributes
				case 'rich':
					// Allow advanced shiz, bbcode etc
				case 'normal':
					// Allow html, strip javascript
					$value = $this->Purifier->purify($value);
					break;
				case 'none':
				default:
					// No html
					$value = strip_tags($value);
					break;
			}
			$Record->set($column, $value);
		}
		
		// Done
		return true;
    }
}