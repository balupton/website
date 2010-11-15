<?php
# Load
if ( empty($GLOBALS['Application']) ) {
	# Headers
	header('Content-Type: text/plain');
	# Bootstrap
	require_once(dirname(__FILE__).'/bootstrapr.php');
	$GLOBALS['Bootstrapr']->bootstrap('zend-application');
}

# Load
$GLOBALS['Application']->bootstrap('ScriptCron');

# ==========================================
# Refresh Content Cache

# Retrieve Content to Update
$Contents = Doctrine_Query::create()
	->from('Content c')
	->orderBy('c.last_refreshed ASC')
	->limit(25)
	->execute()
	;

# Update their Cache
echo "\n".'Cron: First Content Run:'."\n";
foreach ( $Contents as $Content ) {
	if ( $Content->refresh() ) {
		echo 'Cron: Updated Content ['.$Content->code.'] Cache'."\n";
		$Content->save();
	}
	else {
		echo 'Cron: Ignored Content ['.$Content->code.'] Cache'."\n";
	}
	$Content->free(false);
}
$Contents->free(true);

# Update their Cache
echo "\n".'Cron: Second Content Run:'."\n";
foreach ( $Contents as $Content ) {
	if ( $Content->refresh() ) {
		echo 'Cron: Updated Content ['.$Content->code.'] Cache'."\n";
		$Content->save();
	}
	else {
		echo 'Cron: Ignored Content ['.$Content->code.'] Cache'."\n";
	}
	$Content->free(false);
}
$Contents->free(true);

# ==========================================
# Send Pending Messages
echo "\n".'Cron: Sending Any Pending Messages:'."\n";

# Retrieve Messages to Send
$Messages = Doctrine_Query::create()
	->from('Message m')
	->where('m.sent_on IS NULL')
	->andWhere('m.send_on < ?', doctrine_timestamp())
	->limit(25)
	->execute()
	;

# Send these Messages
if ( !count($Messages) ) {
	echo 'Cron: No Pending Messages To Be Sent'."\n";
} else {
	foreach ( $Messages as $Message ) {
		$Message->send()->save();
		echo 'Cron: Sent Message ['.$Message->code.'] to ['.$Message->UserFor->email.']'."\n";
		$Message->free(false);
	}
}
$Messages->free(true);

# ==========================================
# Complete

echo "\n".'Cron: Completed'."\n";