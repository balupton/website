<?php
/**
 * Balupton's Resource Library (balPHP)
 * Copyright (C) 2008-2009 Benjamin Arthur Lupton
 * http://www.balupton.com/
 *
 * This file is part of Balupton's Resource Library (balPHP).
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Balupton's Resource Library (balPHP).  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package balphp
 * @subpackage core
 * @version 0.1.0-final, April 21, 2008
 * @since 0.1.0-final, April 21, 2008
 * @author Benjamin "balupton" Lupton <contact@balupton.com> - {@link http://www.balupton.com/}
 * @copyright Copyright (c) 2008-2009, Benjamin Arthur Lupton - {@link http://www.balupton.com/}
 * @license http://www.gnu.org/licenses/agpl.html GNU Affero General Public License
 */

class Bal_Locale {
	
	public $Zend_Locale;
	public $Zend_Translate;
	public $Zend_Currency;
	public $Session;
	
	public $timezone = null;
	public $format_datetime = Zend_Date::DATETIME;
	public $format_date = Zend_Date::DATES;
	public $format_time = Zend_Date::TIMES;
	
	protected $file;
	protected $map = array(
		'en' => 'en_GB',
		'ar' => 'ar_SD'
	);
	protected $languages_path;
	
	public function __construct ( $locale = null, $currency = null, $timezone = null ) {
		// Options
		if ( is_array($locale) ) {
			$localeConfig = $locale; $locale = null;
			if ( !empty($localeConfig['locale']) )		$locale   = $localeConfig['locale'];
			if ( !empty($localeConfig['currency']) )	$currency = $localeConfig['currency'];
			if ( !empty($localeConfig['timezone']) )	$timezone = $localeConfig['timezone'];
			unset($localeConfig);
		}
		
		// Prepare
		$this->Session = new Zend_Session_Namespace('Application');
		$this->Zend_Locale = new Zend_Locale();
		$this->languages_path = APPLICATION_PATH . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'languages' . DIRECTORY_SEPARATOR;
		
		// Detect
		if ( $this->Session->locale ) {
			Zend_Locale::setDefault($this->Session->locale);
		} elseif ( $locale !== null ) {
			Zend_Locale::setDefault($locale);
		}
		
		// Check
		$file = null;
		$locales = Zend_Locale::getOrder(Zend_Locale::ZFDEFAULT);
		foreach ( $locales as $locale => $weight ) {
			// Check Locale
			if ( $this->setLocale($locale) ) {
				break;
			}
		}
		
		// Apply
		$this->Session->locale = $locale = $this->getFullLocale();
		
		// Universal
	    Zend_Registry::set('Zend_Locale', $this->Zend_Locale);
		
		// Translate
	    $this->Zend_Translate = new Zend_Translate('array', $this->file, $locale);
	    Zend_Registry::set('Zend_Translate', $this->Zend_Translate);
		
		// Currency
	    $this->Zend_Currency = new Zend_Currency($this->getFullLocale(), $currency);
	    Zend_Registry::set('Zend_Currency', $this->Zend_Currency);
		
		// Registry
	    Zend_Registry::set('Locale', $this);
		
		// Formats
		$this->format_date = strclean(Zend_Locale_Format::getDateFormat($locale));
		$this->format_time = strclean(Zend_Locale_Format::getTimeFormat($locale));
		$this->format_datetime = strclean(Zend_Locale_Format::getDateTimeFormat($locale));
		
		// Timezone
		if ( $timezone ) $this->timezone = $timezone;
		
		// Done
		return $this;
	}

	public function clearLocale() {
		$this->Session->locale = null;
		return true;
	}
	public function setLocale($locale){
		// Check Locale
        $language = explode('_', $locale); $language = $language[0];
		if ( ($file = $this->hasFile($locale)) || ($file = $this->hasFile($language)) ) {
			$this->file = $file;
			$this->Zend_Locale->setLocale($locale);
			Zend_Locale::setDefault($locale);
			$this->Session->locale = $locale;
			return true;
		}
		// Done
		return false;
	}
	public function getFullLocale($locale = null){
		if ( $locale === null ) $locale = $this->Zend_Locale->toString();
		if ( strpos($locale, '_') !== false ) return $locale;
		return $this->map[$locale];
	}
	public function getLocale(){
		return $this->Zend_Locale->toString();
	}
	public function getLanguage(){
		return $this->Zend_Locale->getLanguage();
	}
	public function getRegion(){
		return $this->Zend_Locale->getRegion();
	}
	
	public function getFile ( $locale ) {
		return $this->languages_path.$locale.'.php';
	}
	public function hasFile ( $locale ) {
		$file = $this->getFile($locale);
		return file_exists($file) ? $file : false;
	}
	
	public function is ( $locale ) {
		return $locale === $this->Zend_Locale->toString() || $locale === $this->Zend_Locale->getLanguage();
	}

	public function currencySymbol ( ) {
		return $this->Zend_Currency->getSymbol();
	}
	public function currency ( $amount ) {
		return $this->Zend_Currency->toCurrency($amount);
	}
	
	public function translationList ( $type ) {
		return $this->Zend_Locale->getTranslationList($type);
	}
	public function translation ( $text, $type ) {
		return $this->Zend_Locale->getTranslation($text, $type);
	}
	public function languages ( ) {
		$files = scan_dir($this->languages_path);
		$languages = array();
		foreach ( $files as $file ) {
			$language = substr($file, 0, strrpos($file, '.'));
			$languages[$language] = $this->language($language);
		}
		return $languages;
	}
	public function language ( $lang ) {
		return $this->translation($lang, 'language');
	}
	public function month ( $month ) {
		$Date = $this->getDate();
		$Date->setMonth($month);
		return $Date->get(Zend_Date::MONTH_NAME);
	}
	
	public function translate ( $text ) {
		$numargs = func_num_args();
		$args = func_get_args();
		if ( $numargs === 2 && is_array($args[1]) ) {
			// We are wanting to do advanced replace
			$data = $args[1];
			// Translate
			$text = $this->Zend_Translate->_($text);
			$text = preg_replace('/\$(\w+)/ie', '\$data[\'${1}\']', $text);
		} else {
			$text = $this->Zend_Translate->_($text);
			if ( $numargs !== 1 ) {
				$args[0] = $text;
				$text = call_user_func_array('sprintf', $args);
			}
		}
    	return $text;
	}
	
	public function getDate($timestamp = null, $timezone = null){
		$Date = new Zend_Date($timestamp);
		if ( $timezone ) {
			$Date->setTimezone($timezone);
		} elseif ( $this->timezone ) {
			$Date->setTimezone($this->timezone);
		}
		return $Date;
	}
	
	public function datetime ( $timestamp, $format_datetime = null, $locale = null ) {
		$Date = $this->getDate($timestamp);
		if ( $format_datetime === null ) $format_datetime = $this->format_datetime;
		return $Date->get($format_datetime, $locale);
	}
	public function dateandtime ( $timestamp, $format_date = null, $format_time = null, $locale = null ) {
		return $this->date($timestamp, $format_date, $locale).' '.$this->date($timestamp, $format_time, $locale);
	}
	public function date ( $timestamp, $format_date = null, $locale = null ) {
		$Date = $this->getDate($timestamp);
		if ( $format_date === null ) $format_date = $this->format_date;
		return $Date->get($format_date, $locale);
	}
	public function time ( $timestamp, $format_time = null, $locale = null ) {
		$Date = $this->getDate($timestamp);
		if ( $format_time === null ) $format_time = $this->format_time;
		return $Date->get($format_time, $locale);
	}
	public function timeago ( $timestamp ) {
		// http://www.php.net/manual/en/function.time.php#89415
	    $periods	= array('second', 'minute', 'hour', 'day', 'week', 'month', 'year', 'decade');
	    $lengths	= array(60,60,24,7,4.35,12,10);
	    $now		= time();
	    $timestamp	= strtotime($timestamp);
	    // is it future date or past date
	    if($now > $timestamp) {
	        $difference	= $now - $timestamp;
	        $tense		= 'ago';
	       
	    } else {
	        $difference	= $timestamp - $now;
	        $tense		= 'from now';
	    }
	    for($j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++) {
	        $difference /= $lengths[$j];
	    }
	    $difference = round($difference);
	    if($difference != 1) {
	    	$periods[$j].= 's';
	    }
	    return $this->translate('time-ago', $difference, $periods[$j], $tense);
	}
	
	/**
	 * Converts a filesize from bytes to human and translate into the locale
	 * @version 2, July 13, 2009
	 * @since 1.2, April 27, 2008
	 * @param int	$filesize						in bytes
	 * @param int	$round_up_after [optional]		round up after this value, so with 0.1 it turns 110 KB into 0.11 MB
	 * @return string Eg. "5.0 MB"
	 */
	public function filesize ( $filesize, $round_up_after = 0.100, $round_after = 2 ) {
		// Define our file size levels
		$levels = array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
		
		// Perform upsclaing
		$level = 0; $size = $filesize;
		while ( ($new_size = $size / 1024) >= $round_up_after ) {
			$size = $new_size;
			++$level;
		} $filesize = strval($size);
		
		// Format
		if ( $filesize >= $round_after ) $filesize = round($filesize);
		$determined_size = $this->number($filesize, array('precision' => 2));
		$determined_level = $levels[$level];
		
		// Translate
		return $this->translate('%s '.$determined_level, $determined_size);
	}
	
	public function number ( $number, $options = array() ) {
		return Zend_Locale_Format::getNumber($number, $options);
	}
}
