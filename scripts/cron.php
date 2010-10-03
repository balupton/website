<?php
# Load
if ( empty($GLOBALS['Application']) ) {
	# Errors
	error_reporting(E_ALL | E_STRICT);
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	# Bootstrap
	require_once(dirname(__FILE__).'/bootstrapr.php');
	$GLOBALS['Bootstrapr']->bootstrap('zend-application');
	# Load
	$GLOBALS['Application']->bootstrap('ScriptCron');
	# Headers
	header('Content-Type: text/plain');
}


# ==========================================
# Refresh Content Cache

# Retrieve Content to Update
$Contents = Doctrine_Query::create()
	->from('Content c')
	->where('c.last_refreshed IS NULL')
	->orWhere('c.last_refreshed < ?', doctrine_timestamp(strtotime('-2 days')))
	->limit(25)
	->execute()
	;

# Update their Cache
foreach ( $Contents as $Content ) {
	if ( $Content->refresh() ) {
		echo 'Cron: Updated Content ['.$Content->code.'] Cache'."\n";
		$Content->save();
	}
	else {
		echo 'Cron: Ignored Content ['.$Content->code.'] Cache'."\n";
	}
}


# ==========================================
# Send Pending Messages

# Retrieve Messages to Send
$Messages = Doctrine_Query::create()
	->from('Message m')
	->where('m.sent_on IS NULL')
	->andWhere('m.send_on < ?', doctrine_timestamp())
	->limit(25)
	->execute()
	;

# Send these Messages
foreach ( $Messages as $Message ) {
	$Message->send()->save();
	echo 'Cron: Sent Message ['.$Message->code.'] to ['.$Message->UserFor->email.']'."\n";
}


# ==========================================
# Complete
