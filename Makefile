NODE = node
PANDOC = pandoc

all: build gen

build:
	$(NODE) tools/make.js

gen:
	$(PANDOC) -V geometry:margin=1in constitution.md -o Constitution.pdf
	$(PANDOC) constitution.md -o Constitution.html
	$(PANDOC) constitution.md -o Constitution.epub
