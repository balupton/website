<?php
	// ==========================================================================
	// Define basics
	
	error_reporting(E_ALL);
	ini_set('short_open_tag', false);
	date_default_timezone_set('Australia/Perth');
	
	$script_name = 'Heatseeker Ticket Availability Checker';
	$script_description = 'Checks ticket availability for a certain band on the heatseeker website.';
	$script_url = 'http://www.balupton.com/sandbox/checkers/heatseeker.php';
	$script_link = '<a href="'.$script_url.'">'.$script_name.'</a>';
	
	// ==========================================================================
	// Fix up any wierd get stuff
	
	if ( !empty($_GET['id']) || !empty($_GET['iid']) )
	{
		// We must apply some changes to get to standardize it
		foreach ( $_GET as $key => $value )
		{	// Cycle through get
			$value = str_replace('\\x', '%', $value);
			if ( $value )
				$_GET[$key] = $value;
			else
				unset($_GET[$key]);
		}
	}
	else
	{
		?><html>
			<head>
				<title><?php echo $script_name; ?></title>
			</head>
			<body>
				<h1><?php echo $script_link; ?></h1>
				<h3><?php echo $script_description; ?></h3>
				<form action="" method="get">
					<label for="id">Band (URL id): </label> <input type="text" value="" name="id" /><br />
					<label for="iid">URL iid: </label> <input type="text" value="" name="iid" /><br />
					<label for="email">Your email for notifications (optional): </label> <input type="text" value="" name="email" /><br />
					<input type="submit" name="submit" value="Submit" />
				</form>
			</body>
		</html><?php
		die;
	}
	
	// ==========================================================================
	// Get variables
	
	$id = $_GET['id'];
	$iid = $_GET['iid'];
	$debug = empty($_GET['debug']) ? false : true;
	$email = empty($_GET['email']) ? NULL : $_GET['email'];
	
	$request = 'http://www.heatseeker.com.au/gigs.aspx?id='.$_GET['id'].'&tid=2&iid='.$_GET['iid'];
	$result = file_get_contents($request);
	
	$file_path = dirname(__FILE__).'/heatseeker_'.$iid.'.txt';
	
	// ==========================================================================
	// Determine Availability
	
	$available = strstr($result, 'Buy Tickets');
	$available__str = $available ? 'true' : 'false';
	
	if ( $debug )
	{	// Stop here to debug
		header('Content-Type: text/plain');
		die("{$request}\n{$available__str}\n{$result}");
	}
	
	// ==========================================================================
	// Determine change and times
	
	$last_build_date = date(DATE_RFC822);
	$file = file_exists($file_path) ? file_get_contents($file_path) : false;
	if ( $file ) $file = explode('~', $file);
	if ( empty($file) || empty($file[0]) || $file[0] !== $available__str )
	{
		$status_changed = true;
		$pub_date = $last_build_date;
		file_put_contents($file_path, $available__str.'~'.$last_build_date);
	}
	else
	{
		$status_changed = false;
		$pub_date = $file[1];
	}
	
	// ==========================================================================
	// Define HTML
	
	if ( $available )
	{
		$available_html = '<strong style="color:green;">AVAILABLE</strong>';
		$link_html = '<a href="'.$request.'"><strong>BUY NOW</strong></a>';
	}
	else
	{
		$available_html = '<strong style="color:red;">UNAVAILABLE</strong>';
		$link_html = '<a href="'.$request.'">Check Manually</a>';
	}
	
	$item_html = '<strong>'.strtoupper($id).'</strong>';
	$title_text = $item_html.' tickets are currently '.$available_html;
	$title_html = '<p>'.$title_text.', '.$link_html.'.</p>';
	
	// ==========================================================================
	// Determine Email
	
	if ( $email && $status_changed )
	{
		$email_html =
			'<p style="color:gray; font-size:80%; font-style:italic;">'.
			'Because the status just changed an email was dispatched to '.$email.' informing you.'.
			'</p>';
		
		if ( $available )
		{
			$sent_email = true;
			$email_body = $title_html.'<p style="color:gray; font-size:80%; font-style:italic;">This email was brought to you by '.$script_link.'.</p>';
			$email_title = strip_tags($title_text);
			$email_headers =
				'MIME-Version: 1.0' . "\r\n".
				'Content-type: text/html; charset=iso-8859-1' . "\r\n";
			mail($email, $email_title, $email_body, $email_headers);
		}
	}
	else
	{	// Not available or not changed
		
		// Pre-Requisite
		function timeDiff ($timestamp,$detailed=false, $max_detail_levels=8, $precision_level='second')
		{	// Calculate a time difference
			
			$now = time();
			
			#If the difference is positive "ago" - negative "away"
			($timestamp >= $now) ? $action = 'away' : $action = 'ago';
			
			# Set the periods of time
			$periods = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
			$lengths = array(1, 60, 3600, 86400, 604800, 2630880, 31570560, 315705600);
			
			$diff = ($action == 'away' ? $timestamp - $now : $now - $timestamp);
			
			$prec_key = array_search($precision_level,$periods);
			
			# round diff to the precision_level
			$diff = round(($diff/$lengths[$prec_key]))*$lengths[$prec_key];
			
			# if the diff is very small, display for ex "just seconds ago"
			if ($diff <= 10) {
				$periodago = max(0,$prec_key-1);
				$agotxt = $periods[$periodago].'s';
				return "just $agotxt $action";
			}
			
			# Go from decades backwards to seconds
			$time = "";
			for ($i = (sizeof($lengths) - 1); $i>=0; $i--) {
				if($diff > $lengths[$i-1] && ($max_detail_levels > 0))
				{	# if the difference is greater than the length we are checking... continue
					$val = floor($diff / $lengths[$i-1]);    # 65 / 60 = 1.  That means one minute.  130 / 60 = 2. Two minutes.. etc
					$time .= $val ." ". $periods[$i-1].($val > 1 ? 's ' : ' ');  # The value, then the name associated, then add 's' if plural
					$diff -= ($val * $lengths[$i-1]);    # subtract the values we just used from the overall diff so we can find the rest of the information
					if (!$detailed) { $i = 0; }    # if detailed is turn off (default) only show the first set found, else show all information
					$max_detail_levels--;
				}
			}
			
			# Basic error checking.
			if($time == "") {
				return "Error-- Unable to calculate time.";
			} else {
				return $time.$action;
			}
		}
		
		$pub_date_time = strtotime($pub_date);
		$last_build_date_time = strtotime($last_build_date);
		
		$time_diff = timeDiff($pub_date_time);
		
		// Not actually sent in an email but to show extra rss information
		$email_html = '<p style="color:gray; font-size:80%; font-style:italic;">The last status change was at:<br />'.date('r', $pub_date_time).'<br/>Which was '.$time_diff.'.</p>';
	}
	
	$description_html = $title_html.$email_html.'<p style="color:gray; font-size:80%; font-style:italic;">This RSS 2.0 Feed was brought to you by '.$script_link.'.</p>';
	
	// ==========================================================================
	
	// Become an RSS Feed
	header('Content-Type: application/rss+xml');
	echo '<?xml version="1.0" ?>';
	
?><rss version="2.0"
	xmlns="http://backend.userland.com/rss2"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" >
  <channel>
    <title><?php echo $id.' - '.$script_name; ?></title>
    <link><?php echo htmlentities($script_url); ?></link>
    <description><?php echo $script_description; ?></description>
    <language>en-us</language>
    <pubDate><?php echo $last_build_date; ?></pubDate>
    <lastBuildDate><?php echo $last_build_date; ?></lastBuildDate>
    <docs>http://blogs.law.harvard.edu/tech/rss</docs>
	
    <generator>balupton</generator>
    <managingEditor>balupton@gmail.com</managingEditor>
    <webMaster>balupton@gmail.com</webMaster>
    
	<?php if ( true ) {	// Update twice hourly, so every 10 minutes ?>
    	<sy:updatePeriod>hourly</sy:updatePeriod>
		<sy:updateFrequency>6</sy:updateFrequency>
    <?php } ?>
	
    <item>
		<title><?php echo $title_text; ?></title>
		<link><?php echo htmlentities($request); ?></link>
		<description><?php echo htmlentities($description_html); ?></description>
		<pubDate><?php echo $last_build_date; ?></pubDate>
		<guid><?php echo htmlentities($request); ?></guid>
    </item>
    
  </channel>
</rss>