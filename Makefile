NODE = node
PANDOC = pandoc --tab-stop=2
TARGETDIR = dist/

all: build gen

build:
	$(NODE) tools/make.js

gen:
	$(PANDOC) -V geometry:margin=1in constitution.md -o $(TARGETDIR)Constitution.pdf
	$(PANDOC) constitution.md -o $(TARGETDIR)Constitution.html
	$(PANDOC) constitution.md -o $(TARGETDIR)Constitution.epub
