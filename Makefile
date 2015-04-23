NODE = node
MD_SOURCE = constitution.md
PANDOC = pandoc --tab-stop=2 $(MD_SOURCE)
TARGET_DIR = dist/

all: build gen

build:
	$(NODE) tools/make.js

gen:
	$(PANDOC) -V geometry:margin=1in -o $(TARGET_DIR)Constitution.pdf
	$(PANDOC) -o $(TARGET_DIR)Constitution.html
	$(PANDOC) -o $(TARGET_DIR)Constitution.epub
