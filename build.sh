#/bin/sh

browserify src/background.js -t babelify --outfile ./dists/background.js && \
  browserify src/options.js -t babelify --outfile ./dists/options.js && \
  browserify src/popup.js -t babelify --outfile ./dists/popup.js
