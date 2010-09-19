MAKEFLAGS = --no-print-directory --always-make
MAKE = make $(MAKEFLAGS)

default:
	$(MAKE) setup ;
	
permissions:
	php ./scripts/setup.php permissions ;

install:
	php ./scripts/setup.php install ;

setup:
	php ./scripts/setup.php ;

ignore:
	edit .gitignore ;

add:
	git add * ;

update:
	git pull ;
