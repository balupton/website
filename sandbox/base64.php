<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Base64 Encoder / Decoder</title>
</head>

<body>
<strong>Base64 Encoder / Decoder</strong><br />
<br />
<br />
<form action="base64.php" method="post">
Encode:<br />
<textarea style="width:90%; height:500px;" name="encode"><?php echo isset($_POST['encode']) ? stripslashes($_POST['encode']) : ''; ?></textarea><br />
Result:<br />
<textarea style="width:90%; height:100px;"><?php echo isset($_POST['encode']) ? base64_encode(stripslashes($_POST['encode'])) : ''; ?></textarea><br />
<br />
<br />
Decode:<br />
<textarea style="width:90%; height:100px;" name="decode"><?php echo isset($_POST['decode']) ? stripslashes($_POST['decode']) : ''; ?></textarea><br />
Result:<br />
<textarea style="width:90%; height:500px;"><?php echo isset($_POST['decode']) ? base64_decode(stripslashes($_POST['decode'])) : ''; ?></textarea><br />
<br />
<br />
<input type="submit" value="submit" />
</form>
</body>
</html>