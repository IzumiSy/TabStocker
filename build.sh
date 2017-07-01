#/bin/sh

html-minifier src/options.html -o dists/options.html -c ./_html-minifier.json
html-minifier src/popup.html -o dists/popup.html -c ./_html-minifier.json

browserify src/background.js -t babelify --outfile ./dists/background.js
browserify src/options.js -t babelify --outfile ./dists/options.js
browserify src/popup.js -t babelify --outfile ./dists/popup.js