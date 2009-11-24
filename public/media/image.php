<?php
# Init
$bootstrap = $run = false;
require_once(dirname(__FILE__).'/../../index.php');

# Requires
require_once(BALPHP_PATH.'/core/functions/_image.funcs.php');
require_once(BALPHP_PATH.'/core/functions/_files.funcs.php');

# Fetch
$image_location = $_GET['image'];
$height = intval(!empty($_GET['height']) ? $_GET['height'] : (!empty($_GET['h']) ? $_GET['h'] : 0));
$width = intval(!empty($_GET['width']) ? $_GET['width'] : (!empty($_GET['w']) ? $_GET['w'] : 0));
$quality = intval(!empty($_GET['quality']) ? $_GET['quality'] : (!empty($_GET['q']) ? $_GET['q'] : 90));

# Prepare
$image_path = realpath($image_location);
if ( strpos($image_path, dirname(__FILE__)) !== 0 ) {
	throw new Exception('Invalid image location was attempted. <'.$image_location.'>');
}
$image_filename_new = get_filename($image_location,true).'-'.$height.'x'.$width.'q'.$quality.'.'.get_extension($image_location);
$image_path_new = dirname(__FILE__).'/images/'.$image_filename_new;

# Check
if ( is_file($image_path_new) ) {
	# Done already
	$image = file_get_contents($image_path_new);
}
else {
	# Create
	
	# Arguments
	$image_args = array(
		'image' => $image_path,
		'resize_mode' => 'area',
		'width_new' => $width,
		'height_new' => $height,
		'quality' => $quality
	);
	
	# Resize
	$image = image_remake($image_args);
	if ( !$image ) {
		# Failed
		$image = file_get_contents($image_path);
	} else {
		# Save
		file_put_contents($image_path_new, $image);
	}
}

# Become the image
$mime = get_mime_type($image_path_new);
header('Content-Type: '.$mime);
die($image);
