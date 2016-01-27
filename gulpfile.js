var gulp     = require('gulp')
var sass     = require('gulp-sass')
var prefix   = require('gulp-autoprefixer')
var sync     = require('browser-sync')
var sequence = require('run-sequence')
var exec     = require('child_process').exec

var paths = {
  source_scss: '_scss/*.scss',
  source_css:  'css',
  build_css:  '_site/css'
}

gulp.task('sass', function() {
  return gulp.src(paths.source_scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix())
    .pipe(gulp.dest(paths.source_css))
    .pipe(gulp.dest(paths.build_css))
    .pipe(sync.reload({ stream: true }))
})

gulp.task('sync', ['build'], function() {
  sync({
    server: { baseDir: '_site' },
    ghostMode: false,
    notify: false
  })
})

gulp.task('build', function(cb) {
  exec('jekyll build', function(err, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)
    cb(err)
    sequence('sass')
    sync.reload()
  })
})

gulp.task('watch', function() {
  gulp.watch(paths.source_scss, ['sass'])
  gulp.watch([
    '_tools/*',
    '_includes/*',
    '_config.yml',
    'images/*',
    'index.html'
  ], ['build'])
})

gulp.task('default', ['sync', 'watch'])