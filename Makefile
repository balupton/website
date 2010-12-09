MAKEFLAGS = --no-print-directory --always-make
MAKE = make $(MAKEFLAGS)

default:
	$(MAKE) setup ;

all:
	$(MAKE) configure ;
	$(MAKE) install ;

configure:
	cp config.default.php config.php ;
	cp application/config/sample/* application/config ;
	cp application/data/fixtures/data.default.yml application/data/fixtures/data.yml
	cp application/data/schema/schema.default.yml application/data/schema/schema.yml
	php5 ./scripts/configure ;

permissions:
	php5 ./scripts/setup.php permissions ;

install:
	php5 ./scripts/setup.php install ;

setup:
	php5 ./scripts/setup.php ;

ignore:
	edit .gitignore ;

cron:
	php5 ./scripts/cron.php ;

add:
	git add -u ;

update:
	git checkout balcms; git pull balcms master; git checkout dev; git merge balcms;

deploy:
	git checkout master; git merge dev; git checkout dev; git push --all;