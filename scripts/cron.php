<?php
# Load
if ( empty($GLOBALS['Application']) ) {
	# Bootstrap
	require_once(dirname(__FILE__).'/bootstrapr.php');
	$GLOBALS['Bootstrapr']->bootstrap('zend-application');
	# Headers
	header('Content-Type: text/plain');
}

# Load
$GLOBALS['Application']->bootstrap('ScriptCron');

# ==========================================
# Refresh Content Cache

# Retrieve Content to Update
$Contents = Doctrine_Query::create()
	->from('Content c')
	->where('c.last_refreshed IS NULL')
	->orWhere('c.last_refreshed < ?', doctrine_timestamp(strtotime('-2 days')))
	->orWhere('c.last_refreshed <= c.created_at')
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
