MAKEFLAGS = --no-print-directory --always-make
MAKE = make $(MAKEFLAGS)

default:
	$(MAKE) setup ;
	
all:
	$(MAKE) configure ;
	$(MAKE) install ;
	
configure:
	php ./scripts/configure ;

permissions:
	php ./scripts/setup.php permissions ;

install:
	php ./scripts/setup.php install ;

setup:
	php ./scripts/setup.php ;

ignore:
	edit .gitignore ;

cron:
	php ./scripts/cron.php ;

add:
	git add .gitignore .htaccess * ;

update:
	git pull ;
