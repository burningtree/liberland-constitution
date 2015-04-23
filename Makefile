NODE = node
NAME = Liberland-constitution
TARGET_DIR = dist/
PANDOC = pandoc --tab-stop=2 $(NAME).md

all: build gen

build:
	$(NODE) tools/make.js

gen:
	$(PANDOC) -V geometry:margin=1in -o $(TARGET_DIR)$(NAME).pdf
	$(PANDOC) -o $(TARGET_DIR)$(NAME).html
	$(PANDOC) -o $(TARGET_DIR)$(NAME).epub
