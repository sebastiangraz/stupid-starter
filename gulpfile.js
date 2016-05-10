var gulp =      require('gulp'),
jshint =    require('gulp-jshint'),
uglify =    require('gulp-uglify'),
rename =    require('gulp-rename'),
concat =    require('gulp-concat'),
plumber =   require('gulp-plumber'),
changed =   require('gulp-changed'),
imagemin =  require('gulp-imagemin'),
size =      require('gulp-size'),
postcss =   require('gulp-postcss'),
order =     require('gulp-order'),

cssnano =   require('cssnano'),
cssImport = require("postcss-import"),
del = require('del'),
browserSync = require('browser-sync'),
simplevars = require('postcss-simple-vars'),
autoprefixer = require('autoprefixer'),
nestedcss = require('postcss-nested'),
responsivetype = require('postcss-responsive-type');

gulp.task('styles', function() {
  var processors = [
    cssImport,
    simplevars,
    autoprefixer({
      browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
    }),
    nestedcss,
    responsivetype,
    cssnano
  ];
  return gulp.src('./src/stylesheets/index.css')
  .pipe(postcss(processors))
  .pipe(gulp.dest('./dist/stylesheets'));
});

gulp.task('scripts', function() {
  return gulp.src(['./src/js/**/*.js'])
  //.pipe(jshint('.jshintrc'))
  //.pipe(jshint.reporter('default'))
  .pipe(plumber())
  .pipe(order([
    "zepto.js",
    "app.js"
  ]))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// Optimizes the images that exists
gulp.task('images', function() {

  return gulp.src('src/images/**')
  .pipe(changed('dist/images'))
  .pipe(imagemin({
    // Lossless conversion to progressive JPGs
    progressive: true,
    // Interlace GIFs for progressive rendering
    interlaced: true
  }))

  .pipe(gulp.dest('dist/images'))

  .pipe(size({
    title: 'images'
  }));
});

gulp.task('html', function() {
  gulp.src('./src/**/*.html')
  .pipe(gulp.dest('dist/'))
});

gulp.task('browser-sync', ['styles', 'scripts'], function() {
  browserSync({
    server: {
      baseDir: "./dist/",
      injectChanges: true // this is new
    }
  });
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('src/**/*.html', ['html', browserSync.reload]);
  gulp.watch("dist/*.html").on('change', browserSync.reload);
  // Watch css files
  gulp.watch('src/stylesheets/**/*', ['styles', browserSync.reload]);
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts', browserSync.reload]);
  // Watch image files
  gulp.watch('src/images/**/*', ['images', browserSync.reload]);
});

gulp.task('clean', function() {
  return del(['dist/stylesheets', 'dist/js', 'dist/images'])
  cache.clearAll()
});


gulp.task('default', function() {
  gulp.start('styles', 'scripts', 'images', 'html', 'browser-sync', 'watch');
});
