var gulp     = require('gulp')
var sass     = require('gulp-sass')
var prefix   = require('gulp-autoprefixer')
var sync     = require('browser-sync')
var sequence = require('run-sequence')
var exec     = require('child_process').exec

var paths = {
  source_css: '_scss/*.scss',
  source_js:  '_js/*.js',
  build_css:  '_site/css',
  build_js:   '_site/js'
}

gulp.task('sass', function() {
  return gulp.src(paths.source_css)
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix())
    .pipe(gulp.dest(paths.build_css))
    .pipe(sync.reload({ stream: true }))
})

gulp.task("scripts", function() {
  return gulp.src(paths.source_js)
    .pipe(gulp.dest(paths.build_js))
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
    sequence(['sass', 'scripts'])
    sync.reload()
  })
})

gulp.task('watch', function() {
  gulp.watch(paths.source_css, ['sass'])
  gulp.watch(paths.source_js, ['scripts'])
  gulp.watch([
    '_tools/*',
    '_includes/*',
    '_config.yml',
    'images/*',
    'index.html'
  ], ['build'])
})

gulp.task('default', ['sync', 'watch'])