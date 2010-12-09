<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Templating System Concepts (the evolution)</title>
</head>
<body>
	<p>	<strong>Templating System Concepts (the evolution)</strong>
		<br /><em>By <a href="http://www.balupton.com/">Benjamin 'balupton' Lupton</a></em>
		<br /><a href="templates.zip">DOWNLOAD THE SOURCE</a>
		<br /><em>Current Build: 16/02/2008</em>
		<br /><a href="http://www.balupton.com/blogs/dev?title=templating_system_concepts">Read the backstory</a>
	</p>
	<p>	<a href="level_0__static/">Level 0 - Static:</a>
		<br />Level 0 is Static, so your basic htm website, with each individual file being a template.
	</p>
	<p>	<a href="level_1__includes/">Level 1 - Includes:</a>
		<br />With PHP you can split your website design into multiple files, and include them when needed.
		<br />So common parts of the website are then extracted and included where appropriate (eg. header, footer).
		<br />With pages still being split up into different files (eg. index.php, search.php).
	</p>
	<p>	<a href="level_1__param/">Level 1 - Conditional:</a>
		<br />The alternative of includes is conditions, so by using user input to figure out the desired page, we can display what is needed.
		<br />This pages are accessed like so instead: index.php?page=search
	</p>
	<p>	<a href="level_2__shortcuts/">Level 2 - Shortcuts:</a>
		<br />Level 2 uses shortcuts to display repetitive data.
		<br />This is done by using a template for a table row design, and an array for the table row data which is cycled through.
	</p>
	<p>	<a href="level_3__population/">Level 3 - Population:</a>
		<br />Level 3 expands on Level 2 by taking out the code from the template. So we have a template that is populated by data.
		<br />This is done by having a populate function that inports the template and data, and exports the populated result.
	</p>
	<p>	<a href="level_4_0__separation/">Level 4.0 - Separation:</a>
		<br />So the next step from level 3 is separating code from design.
		<br />We want to do this as it simplifies the design and code structure, and allows for designers to work on design and programmers the code.
		<br />It is done by having many template files, where the index template file is scanned and populated with the data.
	</p>
	<p>	<a href="level_4_1__separation_defaults/">Level 4.1 - Separation (Defaults):</a>
		<br />The problem with Level 4.0 is that we need data to have display.
		<br />Level 4.1 adds support for defaults, so that designs can run without data.
		<br />The benefit of this is that designers can then make fully functional designs based of default/test data.
	</p>
	<p>	<a href="level_4_2__separation_mixture/">Level 4.2 - Separation (Mixture):</a>
		<br />Extending Level 4.1, we allow the ability of having the templates be a mix of code and design.
		<br />This allows designers to use the shortcuts of code within designs.
	</p>
	<p>	<a href="level_5__dedicated/">Level 5 - Dedicated Solutions (Templating Engine):</a>
		<br />Level 5 brings forward dedications solutions, so including a system that is dedicated to templating.
		<br />The benefit of a dedicated solution is that they are well maintained and offer excessive features.
		<br />For this we are using <a href="http://www.smarty.net/whyuse.php">Smarty</a>
	</p>
	<p>	<a href="level_6__client/">Level 6 - Client Side Templating <strong>(Not Fully Functional)</strong>:</a>
		<br />Before all solutions have just been server side (running on the server), where with client side, population occurs on the client (within the browser).
		<br />The benefit of this is that data there is less overhead as only things that are needed to be updated on the page are.
		<br />This means that less resources are used as common things like headers and footers are not repetively processed.
		<br />For this we are using <a href="http://code.google.com/p/jsmarty/">JSmarty</a> (A javascript port of Smarty)
	</p>
	<p>	<a href="level_7__dual/">Level 7 - Dual Side Templating (Seperate Installations) <strong>(Not Fully Functional)</strong>:</a>
		<br />The problem with Level 6 is that if you do not have javascript enabled, population doesn't happen.
		<br />So by using both templating engine installations (smarty + jsmarty) we are able to solve this problem.
		<br />As Smarty runs initially, and then from then on JSmarty runs client-side if applicable.
	</p>
	<p>	<a href="level_8__single/">Level 8 - Dual Side Templating (Single Installation) <strong>(Not Fully Functional)</strong>:</a>
		<br />So the next step is making it so there is only one templating engine installation.
		<br />We want this as then only one then needs to be developed and maintained, as well as offering a complete uniformity between server and client side.
		<br />This is possible with the addition of <a href="http://aptana.com/jaxer">Jaxer</a> as it lets javascript run server, client and both sides.
		<br />So by using Jaxer with JSmarty we can accomplish this goal.
		<br /><strong>For this example, it must run on a Jaxer server. <span id="jaxer_status"></span>
			<script type="text/javascript" runat="server">document.getElementById('jaxer_status').innerHTML = 'Which this server IS'+(typeof Jaxer === 'undefined' ? ' NOT' : '')+'.';</script>
			</strong>
	</p>
	<p>	<strong>Note (16/02/2008):</strong>
		<br />Unfortunately, <a href="http://code.google.com/p/jsmarty/">JSmarty</a> is still not in a position to be usable, hence the "Not Fully Functional" notices. Hopefully this project will gain more attention and reach that stage. But for the purpose of showing a concept, it still works well.
	</p>
</body>
</html>