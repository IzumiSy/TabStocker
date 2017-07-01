#/bin/sh

html-minifier src/options.html -o dists/options.html -c _html-minifier.json
html-minifier src/popup.html -o dists/popup.html -c _html-minifier.json
echo "HTML minification has done"

browserify src/background.js -t babelify --outfile dists/background.js
browserify src/options.js -t babelify --outfile dists/options.js
browserify src/popup.js -t babelify --outfile dists/popup.js
echo "JS transforming with browserify has done"

uglifyjs dists/background.js -o dists/background.js
uglifyjs dists/options.js -o dists/options.js
uglifyjs dists/popup.js -o dists/popup.js
echo "JS uglification has done"

cleancss src/styles.css -o dists/styles.css
echo "CSS cleaning has done"
