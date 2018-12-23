const gulp = require('gulp');
const minify = require("gulp-babel-minify");
const stripCode = require('gulp-strip-code');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const streamqueue = require('streamqueue');
const clean = require('gulp-rimraf');
const zip = require('gulp-zip');

const paths = {
  chrome_manifest: 'manifest-chrome.json',
  firefox_manifest: 'manifest-firefox.json',

  chrome_dist_parent: 'dist/chrome',
  chrome_dist_js: 'dist/chrome/js',
  chrome_dist_css: 'dist/chrome/css',

  firefox_dist_parent: 'dist/firefox',
  firefox_dist_js: 'dist/firefox/js',
  firefox_dist_css: 'dist/firefox/css',

  common: 'dist/common/',

  strip_scripts: ['dist/common/*.js', 'js/background.js', 'js/functions.js', 'js/keys.js', 'js/trend-analysis.js', 'js/vars.js'],
  concat_scripts: ['js/*.js', '!js/background.js', '!js/functions.js', '!js/keys.js', '!js/trend-analysis.js', '!js/vars.js'],

  concat_css: ['css/*.css', '!css/trend-analysis.css'],

  constants: ['index.html', '*vendor/**/*', '*pages/**/*', '*img/**/*']
};

gulp.task('strip-firefox', function () {
  return gulp.src(paths.strip_scripts)
    .pipe(stripCode({
      start_comment: "start-firefox",
      end_comment: "end-firefox"
    }))
    .pipe(minify({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(gulp.dest(paths.chrome_dist_js));
});

gulp.task('strip-firefox-dev', function () {
  return gulp.src(paths.strip_scripts)
    .pipe(stripCode({
      start_comment: "start-firefox",
      end_comment: "end-firefox"
    }))
    .pipe(gulp.dest(paths.chrome_dist_js));
});

gulp.task('chrome-manifest', function () {
  return gulp.src(paths.chrome_manifest)
    .pipe(rename(function (path) {
      path.basename = "manifest";
      path.extname = ".json";
    }))
    .pipe(gulp.dest(paths.chrome_dist_parent));
});

gulp.task('strip-chrome', function () {
  return gulp.src(paths.strip_scripts)
    .pipe(stripCode({
      start_comment: "start-chrome",
      end_comment: "end-chrome"
    }))
    .pipe(minify({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(gulp.dest(paths.firefox_dist_js));
});

gulp.task('strip-chrome-dev', function () {
  return gulp.src(paths.strip_scripts)
    .pipe(stripCode({
      start_comment: "start-chrome",
      end_comment: "end-chrome"
    }))
    .pipe(gulp.dest(paths.firefox_dist_js));
});

gulp.task('firefox-manifest', function () {
  return gulp.src(paths.firefox_manifest)
    .pipe(rename(function (path) {
      path.basename = "manifest";
      path.extname = ".json";
    }))
    .pipe(gulp.dest(paths.firefox_dist_parent));
});

gulp.task('concat-js', function () {
  return gulp.src(paths.concat_scripts)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.common));
});

gulp.task('concat-css', function () {
  return streamqueue({
        objectMode: true
      },
      gulp.src(paths.concat_css)
      .pipe(cleanCSS())
      .pipe(concat('main.css')),
      gulp.src('css/trend-analysis.css')
      .pipe(cleanCSS())
    )
    .pipe(gulp.dest('dist/chrome/css'))
    .pipe(gulp.dest('dist/firefox/css'));
});

gulp.task('copy-files', function () {
  return gulp.src(paths.constants)
    .pipe(gulp.dest(paths.chrome_dist_parent))
    .pipe(gulp.dest(paths.firefox_dist_parent));
});

gulp.task('clean', function () {
  return gulp.src(paths.common, {
      read: false
    })
    .pipe(clean());
});

gulp.task('build-chrome', function () {
  return gulp.src('dist/chrome/**/*')
    .pipe(zip('chrome-ext.zip'))
    .pipe(gulp.dest('../'))
});

gulp.task('build-firefox', function () {
  return gulp.src('dist/firefox/**/*')
    .pipe(zip('firefox-ext.zip'))
    .pipe(gulp.dest('../'))
});

gulp.task('compile-chrome', gulp.series('concat-js', 'concat-css', 'strip-firefox', 'chrome-manifest', 'copy-files', 'clean'));
gulp.task('compile-firefox', gulp.series('concat-js', 'concat-css', 'strip-chrome', 'firefox-manifest', 'copy-files', 'clean'));

gulp.task('compile-chrome-dev', gulp.series('concat-js', 'concat-css', 'strip-firefox-dev', 'chrome-manifest', 'copy-files'));
gulp.task('compile-firefox-dev', gulp.series('concat-js', 'concat-css', 'strip-chrome-dev', 'firefox-manifest', 'copy-files'));

gulp.task('watch-chrome', function () {
  gulp.watch(['index.html', 'pages/**/*', 'vendor/**/*', 'manifest-chrome.json', 'img/**/*', 'js/**/*', 'css/**/*'], gulp.series('compile-chrome-dev'));
});

gulp.task('watch-firefox', function () {
  gulp.watch(['index.html', 'pages/**/*', 'vendor/**/*', 'manifest-firefox.json', 'img/**/*', 'js/**/*', 'css/**/*'], gulp.series('compile-firefox-dev'));
});