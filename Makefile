# BalCMS Project Maker - By Benjamin "balupton" Lupton (MIT Licenced)
# Install:
# 	mkdir my-new-balcms-project
# 	cd my-new-balcms-project
# 	svn checkout my-new-balcms-project-svn-location .
# 	svn export https://balupton.springloops.com/source/balcms/trunk/Makefile Makefile ;
#	svn install


MAKEFLAGS = --no-print-directory --always-make
MAKE = make $(MAKEFLAGS)
COMMON_ROOT = /home/balupton/common
BALCMS_ROOT = $(COMMON_ROOT)/balcms-trunk
BALPHP_ROOT = $(COMMON_ROOT)/balphp-trunk
BALPHPLIB_ROOT = $(BALPHP_ROOT)/lib

	
clear:
	rm -Rf svn.externals application il8n library public scripts tests .htaccess robots.txt index.php ;
	
clear-common:
	rm -Rf common ;
	
clear-all:
	$(MAKE) clear ;
	$(MAKE) clear-common ;

refresh-make:
	svn export \
		https://balupton.springloops.com/source/balcms/trunk/Makefile \
		Makefile ;
	
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
		./application/modules ;
	
	# ./application/models
	echo "\
		Bal 		https://balupton.springloops.com/source/balphp/trunk/lib/models \n \
		Balcms		https://balupton.springloops.com/source/balcms/trunk/application/models/Balcms \
		" > svn.externals ;
	svn propset svn:externals -F svn.externals \
		./application/models ;
	
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
	
	# ./public/themes/balcmswp
	echo "\
		balcmswp 	https://balupton@balupton.springloops.com/source/balcms/trunk/public/themes/balcmswp \
		" > svn.externals ;
	svn propset svn:externals -F svn.externals \
		./public/themes ;
	
	# clear
	rm svn.externals ;
	
externals-symlink:
	rm -Rf ./common ;
	ln -s $(COMMON_ROOT) ./common ;
	
	rm -Rf ./application/config/balcms ;
	ln -s $(BALCMS_ROOT)/application/config/balcms ./application/config/balcms ;
	
	rm -Rf ./application/modules/balcms ;
	rm -Rf ./application/modules/default ;
	ln -s $(BALCMS_ROOT)/application/modules/balcms ./application/modules/balcms ;
	ln -s $(BALCMS_ROOT)/application/modules/default ./application/modules/default ;
	
	rm -Rf ./application/models/Bal ;
	rm -Rf ./application/models/Balcms ;
	ln -s $(BALCMS_ROOT)/application/models/Bal ./application/models/Bal ;
	ln -s $(BALCMS_ROOT)/application/models/Balcms ./application/models/Balcms ;

	rm -Rf ./scripts ;
	ln -s $(BALCMS_ROOT)/scripts ./scripts ;

	rm -Rf ./public/images ;
	rm -Rf ./public/scripts ;
	rm -Rf ./public/styles ;
	rm -Rf ./public/media ;
	ln -s $(BALCMS_ROOT)/public/images ./public/images ;
	ln -s $(BALCMS_ROOT)/public/scripts ./public/scripts ;
	ln -s $(BALCMS_ROOT)/public/styles ./public/styles ;
	ln -s $(BALCMS_ROOT)/public/media ./public/media ;

	rm -Rf ./public/themes/balcms ;
	ln -s $(BALCMS_ROOT)/public/themes/balcms ./public/themes/balcms ;


ingore:
	svn propset svn:ignore "common" .


update:
	svn update * --depth infinity;

update-common:
	svn update ./common --depth infinity;

update-all:
	$(MAKE) update;
	$(MAKE) update-common;


add:
	svn add * -q --depth infinity;

revert:
	svn revert * ;


permissions:
	php ./scripts/setup.php permissions ;


setup:
	php ./scripts/setup.php install ;


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

	svn commit -m "BalCMS Externals Imported." ;
	
	"Installation Completed" ;

install-common:
	$(MAKE) clear-common ;
	
	svn checkout https://balupton@balupton.springloops.com/source/htdocs/trunk/common ./common

install-all:
	$(MAKE) install;
	$(MAKE) install-common;
