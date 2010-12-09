<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Templates: Level 4.2 - Separation (Mixture)</title>
<style type="text/css">

links a { margin:5px; }

div { margin-left:10px; border-left:1px solid grey; margin-top:5px; margin-bottom:5px; padding-left:5px; }

.container { font-size:14px;  }
.container_intro { font-weight:bold; }
.container_content {  }
.container_outro { font-style:italic; }

	.home { font-size:smaller; }
	.home_intro { font-weight:bold; }
	.home_content {  }
	.home_outro { font-style:italic; }
	
	.search { font-size:smaller; }
	.search_intro { font-weight:bold; }
	.search_content {  }
	.search_outro { font-style:italic; }

		.search_result { font-size:smaller; }
		.search_result_title { font-weight:bold; }
		.search_result_content {  }
		.search_result_outro { font-style:italic; }

</style>
</head>
<body>

<div class="container">
	<div class="container_intro">
	Welcome to Container
	<br /><u>The date and time is <?php echo date('r'); ?></u>
	</div>
	<div class="container_content">

		<!--[page|page/home.htm]-->
			
	</div>
	
	<div class="container_outro">
	Goodbye from Container
	</div>
	
</div>

<div class="links">
<a href="index.php?page=home">Home</a>
<a href="index.php?page=search">Search</a>
</div>

</body>
</html>