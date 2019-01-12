const gulp = require('gulp');
const run = require('gulp-run');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const argv = require('yargs').argv;

const paths = {
  chrome_manifest: './src/manifests/manifest-chrome.json',
  firefox_manifest: './src/manifests/manifest-firefox.json',

  dist: 'dist',
};

gulp.task('set:vendor', function (done) {
  if (argv.vendor != null)
    process.env.VENDOR = argv.vendor;

  done();
});

gulp.task('chrome:manifest', function () {
  let version = require('./package.json').version;

  return gulp.src(paths.chrome_manifest)
    .pipe(replace('{{version}}', version))
    .pipe(rename(function (file) {
      file.basename = 'manifest';
      file.extname = '.json';
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('delete:bg-html', function () {
  return run('rm -f dist/background.html').exec()
});

gulp.task('build', function () {
  return run(`npm run build --vendor=${argv.vendor}`).exec()
});

gulp.task('compile:chrome', gulp.series('set:vendor', 'build', 'chrome:manifest', 'delete:bg-html'));

gulp.task('watch:chrome', function () {
  gulp.watch(['./public/**/*', './src/**/*', 'manifest-chrome.json'], gulp.series('compile:chrome'));
});