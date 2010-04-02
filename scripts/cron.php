<?php
# Prepare
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
	
# Load
if ( empty($Application) ) {
	# Bootstrap
	$run = $bootstrap = false;
	require_once(dirname(__FILE__).'/../index.php');
}
header('Content-Type: text/plain');

# Load
$Application->bootstrap('script-cron');

# ==========================================
# Get to Work

# Retrieve Messages to Send
$Messages = Doctrine_Query::create()
	->from('Message m')
	->where('m.sent_on IS NULL')
	->andWhere('m.send_on < ?', doctrine_timestamp()
	->limit(25)
	->execute()
	;

# Send these Messages
foreach ( $Messages as $Message ) {
	$Message->send()->save();
}


# ==========================================
# Complete
