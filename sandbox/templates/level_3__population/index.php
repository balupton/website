<?php
function populate_prep ( $key )
{
	return '%'.$key.'%';
}
function populate ( $template, $data )
{
	$keys = array_keys($data);
	$values = array_values($data);
	$search = array_map('populate_prep', $keys);
	$display = str_replace($search, $values, $template);
	return $display;
}			
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Templates: Level 3 - Population</title>
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
	</div>
	<div class="container_content">

		<?php if ( empty($_GET['page']) || $_GET['page'] === 'home' ) { ?>
		<div class="home">
			<div class="home_intro">
			Welcome to Home
			</div>
			<div class="home_content">
			Home Contents
			</div>
			<div class="home_outro">
			Goodbye from Home
			</div>
		</div>
		<?php } elseif ( $_GET['page'] === 'search' ) { ?>
		<div class="search">
		
			<div class="search_intro">
			Welcome to Search
			</div>
		
			<div class="search_content">
			
				<?php
				ob_start(); ?>
				<div class="search_result">
					<div class="search_result_title">
					Welcome to Search Result %number%
					</div>
					<div class="search_result_content">
					Search Result %number% Contents
					</div>
					<div class="search_result_outro">
					Goodbye from Search Result %number%
					</div>
				</div><?php
				$template = ob_get_contents();
				ob_end_clean();
				
				$list = array(
					array('number'=>'One'),
					array('number'=>'Two'),
					array('number'=>'Three')
				);
				for ( $i = 0, $n = sizeof($list); $i < $n; ++$i )
				{
					$data = $list[$i];
					echo populate($template, $data);
				}
				?>
				
			</div>
			
			<div class="search_outro">
			Goodbye from Search
			</div>
		
		</div>
		<?php } ?>
			
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