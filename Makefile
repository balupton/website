MAKEFLAGS = --no-print-directory --always-make
MAKE = make $(MAKEFLAGS)

default:
	$(MAKE) setup ;

all:
	$(MAKE) configure ;
	$(MAKE) install ;

clean:
	rm -Rf \
		application/config/compiled \
		application/data/schema/compiled \
		application/data/schema/compiled \
		application/modules/*/config/compiled \
		public/media/cache/*/ ;

configure:
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
	git checkout v1.0.0-balcms; git pull balcms master; git checkout v1.0.0-dev; git merge v1.0.0-balcms;

deploy:
	git checkout v1.0.0; git merge v1.0.0-dev; git checkout master; git merge v1.0.0; git checkout v1.0.0-dev; git push origin --all;
