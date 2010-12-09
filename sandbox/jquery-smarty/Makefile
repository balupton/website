# Javascript/CSS Compressor Makefile - By Benjamin "balupton" Lupton (MIT Licenced)

MAKEFLAGS = --no-print-directory --always-make
MAKE = make $(MAKEFLAGS)

BUILDDIR = ./build

YUIURL = http://yuilibrary.com/downloads/yuicompressor/yuicompressor-2.4.2.zip
YUIDIR = $(BUILDDIR)/yui
YUIFILE = $(YUIDIR)/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar

SMARTY_IN  = ./scripts/jquery.smarty.js
SMARTY_OUT = ./scripts/jquery.smarty.min.js
PHPJS_OUT  = ./scripts/php.full.min.js
OUTJS      = ./scripts/jquery.smarty.all.min.js

all:
	$(MAKE) build;
	$(MAKE) compress;
	$(MAKE) clean;

build:
	$(MAKE) clean;
	mkdir $(BUILDDIR) $(CLOSUREDIR) $(YUIDIR);
	cd $(YUIDIR); wget -q $(YUIURL) -O file.zip; tar -xf file.zip;
	
clean:
	rm -Rf ./build;
	
compress:
	java -jar $(YUIFILE) $(SMARTY_IN) -o $(SMARTY_OUT);
	cat $(SMARTY_OUT) $(PHPJS_OUT) > $(OUTJS);
	