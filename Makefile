# BalCMS Project Maker - By Benjamin "balupton" Lupton (MIT Licenced)
# Install:
# 	mkdir my-new-balcms-project
# 	cd my-new-balcms-project
# 	svn checkout my-new-balcms-project-svn-location .
# 	svn export https://balupton.springloops.com/source/balcms/trunk/Makefile Makefile ;
#	svn install


MAKEFLAGS = --no-print-directory --always-make
MAKE = make $(MAKEFLAGS)

	
clear:
	rm -Rf svn.externals application il8n library public scripts tests .htaccess robots.txt index.php ;
	
	
refresh:
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/.htaccess \
		.htaccess ;
	
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/robots.txt \
		robots.txt ;
	
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/index.php \
		index.php ;
	
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/application/Bootstrap.php \
		application/Bootstrap.php ;
	
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/application/config/routes.ini \
		application/config/routes.ini ;
	
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/application/data/schema/_schema.yml \
		application/data/schema/_schema.yml ;
	
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/application/layouts/scripts/layout.phtml \
		application/layouts/scripts/layout.phtml ;
	
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/application/modules/sample \
		application/modules/sample ;
	
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/public/.htaccess \
		public/.htaccess ;
	
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/public/themes/sample \
		public/themes/sample ;


files:
	
	touch \
		.htaccess \
		robots.txt \
		index.php \
		application/Bootstrap.php \
		application/config/application.ini \
		application/config/nav.json \
		application/config/routes.ini \
		application/data/database/cache.db \
		application/data/database/development.db \
		application/data/database/production.db \
		application/data/database/testing.db \
		application/data/dump/data.yml \
		application/data/fixtures/data.yml \
		application/data/schema/_schema.yml \
		application/data/schema/schema.yml \
		application/layouts/scripts/layout.phtml \
		application/modules/sample/controllers/SampleController.php \
		il8n/en.php \
		public/.htaccess \
		public/themes/sample/favicon.ico \
		public/themes/sample/scripts/script.js \
		public/themes/sample/styles/style.css \
		public/themes/sample/styles/browser/ie6.css \
		public/themes/sample/styles/browser/ie7.css \
		public/themes/sample/styles/browser/ie8.css \
		public/themes/sample/styles/browser/firefox3.css \
		public/themes/sample/styles/browser/firefox2.css \
		public/themes/sample/styles/browser/firefox1.css \
		public/themes/sample/styles/browser/opera10.css \
		public/themes/sample/styles/browser/opera9.css \
		public/themes/sample/styles/browser/opera8.css \
		public/themes/sample/styles/browser/chrome6.css \
		public/themes/sample/styles/browser/chrome5.css \
		public/themes/sample/styles/browser/chrome4.css \
		public/themes/sample/styles/browser/safari.css \
		public/themes/sample/styles/browser/other.css \
		public/themes/sample/layouts/layout.phtml \
		;


dirs:

	mkdir \
		application \
		application/config \
		application/data \
		application/data/database \
		application/data/database/sql \
		application/data/dump \
		application/data/fixtures \
		application/data/index \
		application/data/logs \
		application/data/logs/payment \
		application/data/logs/paypal \
		application/data/migrations \
		application/data/schema \
		application/layouts \
		application/layouts/scripts \
		application/models \
		application/modules \
		application/modules/sample \
		application/modules/sample/config \
		application/modules/sample/controllers \
		application/modules/sample/models \
		application/modules/sample/views \
		application/modules/sample/views/filters \
		application/modules/sample/views/helpers \
		application/modules/sample/views/scripts \
		il8n \
		library \
		public \
		public/themes/ \
		public/themes/sample \
		public/themes/sample/images \
		public/themes/sample/layouts \
		public/themes/sample/scripts \
		public/themes/sample/styles \
		public/themes/sample/styles/browser \
		tests \
		;
	
	
structure:
	$(MAKE) dirs ;
	$(MAKE) files ;
	$(MAKE) refresh ;
	
externals:
	# ./application/config/balcms
	echo "\
		balcms 		https://balupton.springloops.com/source/balcms/trunk/application/config/balcms \
		" > svn.externals ;
	svn propset svn:externals -F svn.externals \
		./application/config ;
	
	# ./application/modules
	echo "\
		balcms 		https://balupton.springloops.com/source/balcms/trunk/application/modules/balcms \n \
		default		https://balupton.springloops.com/source/balcms/trunk/application/modules/default \
		" > svn.externals ;
	svn propset svn:externals -F svn.externals \
		./application ;
	
	# ./scripts
	echo "\
		scripts  	https://balupton.springloops.com/source/balcms/trunk/scripts \
		" > svn.externals ;
	svn propset svn:externals -F svn.externals \
		. ;
	
	# ./public/images ./public scripts ./public styles ./public media
	echo "\
		images			https://balupton.springloops.com/source/balcms/trunk/public/images \n \
		scripts			https://balupton.springloops.com/source/balcms/trunk/public/scripts \n \
		styles			https://balupton.springloops.com/source/balcms/trunk/public/styles \n \
		media			https://balupton.springloops.com/source/balcms/trunk/public/media \
		" > svn.externals ;
	svn propset svn:externals -F svn.externals \
		./public ;
	
	# ./library/csscaffold
	echo "\
		csscaffold		https://balupton.springloops.com/source/balcms/trunk/public/library/csscaffold \
		" > svn.externals ;
	svn propset svn:externals -F svn.externals \
		./library ;
	
	# ./public/themes/balcmswp
	echo "\
		balcmswp 	https://balupton@balupton.springloops.com/source/balcms/trunk/public/themes/balcmswp \
		" > svn.externals ;
	svn propset svn:externals -F svn.externals \
		./public/themes ;
	
	# clear
	rm svn.externals ;
	

update:
	svn update * --depth infinity;

add:
	svn add * -q --depth infinity;

revert:
	svn revert * ;


install:
	$(MAKE) clear ;
	
	$(MAKE) structure ;
	
	$(MAKE) update ;
	$(MAKE) add ;
	
	svn commit -m "BalCMS Structure Imported." ;
	
	$(MAKE) externals ;
	$(MAKE) update ;
	
	$(MAKE) externals ;
	$(MAKE) update ;

	svn commit -m "BalCMS Externals Imported. Setup Completed." ;
	
	"Setup Completed" ;

