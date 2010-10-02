Welcome to BalCMS!
==================

**[BalCMS](http://www.balupton.com/projects/balcms)** is a [Zend Framework](http://framework.zend.com/) and [Doctrine ORM](http://www.doctrine-project.org/) powered [CMS](http://en.wikipedia.org/wiki/Cms). It supports such features as il8n, widget, caching, themes and modules. Modules is really important as you can just add your own module, a route to the module and bang you have just extended the CMS and you can add your own actions! Now this is cool, unlike wordpress plugins. :O


Installation
------------------

1.	Create a new git repository for your server on GitHub.

2.	Run the following commands:
		
		mkdir mynewgitrepo
		cd mynewgitrepo
		git init
		git remote add origin {your git repos read/write uri}
		git remote add balcms git://github.com/balupton/balcms.git
		git pull balcms master
		git push origin master


2.	Install your BalCMS application by running the following:

		make all


3.	Visit your new BalCMS Website.


Todo
------------------

1.	Get the Titan Theme Working

2.	Ensure the Backend Still Works

