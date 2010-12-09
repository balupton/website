<?php
# Load
if ( empty($GLOBALS['Application']) ) {
	# Headers
	header('Content-Type: text/plain');
	# Bootstrap
	require_once(dirname(__FILE__).'/bootstrapr.php');
	$Bootstrapr = Bootstrapr::getInstance();
	# Configuration
	$Bootstrapr->bootstrap('configuration');
	# Determine if we need more memory
	$memory_has = preg_replace('/[^0-9]/','',ini_get('memory_limit'));
	$memory_required = 64;
	if ( $memory_has < $memory_required ) {
		if ( $_SERVER['CLI'] ) {
			echo
				"CLI does not have enough memory, sending a HTTP request...\n\n".
				file_get_contents(ROOT_URL.BASE_URL.'/scripts/cron.php');
			die;
		}
		else {
			echo
				"HTTP does not have enough memory, trying anyway...\n\n";
		}
	}
	# Continue with Bootstrap
	$Bootstrapr->bootstrap('zend-application');
}
else {
	$Bootstrapr = Bootstrapr::getInstance();
}

# Load
$GLOBALS['Application']->bootstrap('ScriptCron');

# ==========================================
# Refresh Content Cache

# Retrieve Content to Update
$ContentsQuery = Doctrine_Query::create()
	->from('Content c')
	->orderBy('c.last_refreshed ASC')
	->limit(25)
	;

# Retrieve Content to Update
echo 'Cron: First Content Run:'."\n";
$Contents = $ContentsQuery->execute();

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

# Retrieve Content to Update
echo "\n".'Cron: Second Content Run:'."\n";

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
	}
}

// When doing a second round, it will cause the tags to delete. So we don't do a second round.

# ==========================================
# Complete

echo "\n".'Cron: Completed'."\n";