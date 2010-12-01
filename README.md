Welcome to BalCMS!
==================

**[BalCMS](http://www.balupton.com/projects/balcms)** is a [Zend Framework](http://framework.zend.com/) and [Doctrine ORM](http://www.doctrine-project.org/) powered [CMS](http://en.wikipedia.org/wiki/Cms). It supports such features as il8n, widget, caching, themes and modules. Modules is really important as you can just add your own module, a route to the module and bang you have just extended the CMS and you can add your own actions! Now this is cool, unlike wordpress plugins. :O


Creating a New BalCMS Website
------------------

1.	Create a new git repository for your server on GitHub.

2.	Run the following commands:
		
		mkdir mywebsite
		cd mywebsite
		git init
		git remote add origin {your git repos read/write uri}
		git remote add balcms git://github.com/balupton/balcms.git
		git pull balcms master
		git push origin master
		git branch balcms
		git branch dev
		git branch production
		git checkout dev
		make all

3.	Visit your new BalCMS Website.


Working with an Existing BalCMS Website
------------------

1. Run the following commands:
		
		git clone {your git repos read/write uri} mynewwebite
		cd mynewwebsite
		git remote add balcms git://github.com/balupton/balcms.git
		git checkout dev
	

Committing your Changes and Pushing to the Development Site
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
		git checkout production
		git merge dev (note: if there are conflicts resolve them with [git mergetool])
		git checkout dev
		git push origin -all
		

Upgrading your BalCMS Version
------------------

1. Run the following commands:
		
		cd mywebsite
		git checkout balcms
		git pull balcms master
		git checkout dev
		git merge balcms (note: if there are conflicts resolve them with [git mergetool])
		
