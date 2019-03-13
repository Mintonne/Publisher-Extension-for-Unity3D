const gulp = require('gulp')
const run = require('gulp-run')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const argv = require('yargs').argv
const zip = require('gulp-zip')

const paths = {
  chrome_manifest: './src/manifests/manifest-chrome.json',
  firefox_manifest: './src/manifests/manifest-firefox.json',

  dist: 'dist'
}

gulp.task('set:vendor', function (done) {
  if (argv.vendor != null) {
    process.env.VENDOR = argv.vendor
  }

  done()
})

gulp.task('build', function () {
  return run(`npm run build --vendor=${argv.vendor}`).exec()
})

gulp.task('manifest', function () {
  let version = require('./package.json').version

  let manifest = argv.vendor === 'chrome' ? paths.chrome_manifest : paths.firefox_manifest

  return gulp.src(manifest)
    .pipe(replace('{{version}}', version))
    .pipe(rename(function (file) {
      file.basename = 'manifest'
      file.extname = '.json'
    }))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('zip', function () {
  let fileName = argv.vendor === 'chrome' ? 'chrome-ext' : 'firefox-ext'

  return gulp.src('dist/**/*')
    .pipe(zip(`${fileName}.zip`))
    .pipe(gulp.dest('../'))
})

gulp.task('compile', gulp.series('set:vendor', 'build', 'manifest'))
gulp.task('release', gulp.series('set:vendor', 'build', 'manifest', 'zip'))

gulp.task('watch', function () {
  gulp.watch(['./public/**/*', './src/**/*'], gulp.series('compile'))
})
