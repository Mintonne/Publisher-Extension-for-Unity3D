const gulp = require('gulp')
const zip = require('gulp-zip')

gulp.task('zip', function () {
  const fileName = `${process.env.VENDOR}-ext.zip`

  return gulp.src('dist/**/*')
    .pipe(zip(fileName))
    .pipe(gulp.dest('dist'))
})
