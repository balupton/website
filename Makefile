# ======================
# Standard Make Vars

MAKEFLAGS = --no-print-directory --always-make
MAKE = make $(MAKEFLAGS)

# ======================
# Special Variables

# Current BalCMS Version
BALCMS_VERSION = v1.0.0

# ======================
# Commands

default:
	$(MAKE) setup ;

all:
	$(MAKE) configure ;
	$(MAKE) install ;

clean:
	rm -Rf \
		application/config/compiled/* \
		application/data/schema/compiled/* \
		application/data/schema/compiled/* \
		application/modules/*/config/compiled/* \
		public/media/cache/*/* ;

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
	git checkout $(BALCMS_VERSION)-balcms; git pull balcms master; git checkout $(BALCMS_VERSION)-dev; git merge $(BALCMS_VERSION)-balcms;

deploy:
	git checkout $(BALCMS_VERSION); git merge $(BALCMS_VERSION)-dev; git checkout master; git merge $(BALCMS_VERSION); git checkout $(BALCMS_VERSION)-dev; git push origin --all;
