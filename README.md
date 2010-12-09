Welcome to BalCMS!
==================

**[BalCMS](http://www.balupton.com/projects/balcms)** is a [Zend Framework](http://framework.zend.com/) and [Doctrine ORM](http://www.doctrine-project.org/) powered [CMS](http://en.wikipedia.org/wiki/Cms). It supports such features as il8n, widget, caching, themes and modules. Modules is really important as you can just add your own module, a route to the module and bang you have just extended the CMS and you can add your own actions! Now this is cool, unlike wordpress plugins. :O


Creating a New BalCMS Website
------------------

1.	Create a new git repository for your server on GitHub.

2.	Run the following commands:
		
		mkdir mywebsite
		cd mywebsite
		curl -OL http://github.com/balupton/balcms/raw/master/Makefile
		make init
		make configure
		make install
		git remote add origin {your git repos read/write uri} ;
		make deploy

3.	Visit your new BalCMS Website.


Committing your Changes
------------------

1. Run the following commands:
		
		cd mywebsite
		git add -u
		git status (note: you will need to see which files need to be added, and use [git add {file}])
		git commit -m "My Changes... {this is your message}"
		git push origin --all
	

Pushing your Changes to the Live Site
------------------

1. Run the following commands:
		
		cd mywebsite
		make deploy
		

Upgrading your BalCMS Version
------------------

1. Run the following commands:
		
		cd mywebsite
		make update
		
