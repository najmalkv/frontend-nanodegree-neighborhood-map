
'use strict';


// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var path = require('path');
var fs = require('fs');
var glob = require('glob-all');
var pump = require('pump');
var packageJson = require('./package.json');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// production folder
var DIST = 'dist';

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};



// Task to get images production ready
var imageOptimizeTask = function(src, dest) {
  return gulp.src(src)
    .pipe($.imagemin([
      $.imagemin.gifsicle({interlaced: true}),
      imageminJpegRecompress({progressive: true, method: 'ms-ssim', quality: 'low'}),
      $.imagemin.optipng(),
      $.imagemin.svgo({plugins: [{cleanupIDs: false}]})
    ], {verbose: true}))
    .pipe(gulp.dest(dest))
    .pipe($.size({title: 'img'}));
};


// Task to get html production ready
var optimizeHtmlTask = function(src, dest) {


  return gulp.src(src)

    //minify inline JavaScript
    .pipe($.if('*.js', $.uglify({
      preserveComments: 'some'
    })))
    // minify inline styles
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.useref())
    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
    // Output files
    .pipe(gulp.dest(dest))
    .pipe($.size({
      title: 'html'
    }));
};

// Task to get css production ready
gulp.task('styles', function (cb) {
  pump([
        gulp.src('src/**/**/*.css'),
        $.minifyCss(),
        gulp.dest(dist())
    ],
    cb
  );
});

// Lint JavaScript
gulp.task('jshint', function() {
  return gulp.src(['app/scripts/**/*.js', 'app/styleguide/**/*.js'])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Task to get javascript production ready
gulp.task('compress', function (cb) {
  pump([
        gulp.src('src/js/*.js'),
        $.uglify(),
        gulp.dest(dist('js'))
    ],
    cb
  );
});

// Task to get javascript production ready
gulp.task('bower', function (cb) {
  pump([
        gulp.src('src/bower_components/**/*.js'),
        gulp.dest(dist('bower_components'))
    ],
    cb
  );
});

// Optimize images
gulp.task('images', function() {
  return imageOptimizeTask(['src/**/**/*.jpg','src/**/**/*.png', 'src/**/**/*.gif','src/**/**/*.svg'], dist());
});

// Copy all files at the root level (src)
gulp.task('copy', function() {
  var BenzyInfotech = gulp.src([
    'src/*'
  ], {
    dot: true
  }).pipe(gulp.dest(dist()));

});



// Scan your HTML for assets & optimize them
gulp.task('html', function() {
  return optimizeHtmlTask(
    ['src/**/*.html'],
    dist());
});


// Clean output directory
gulp.task('clean', function() {
  return del(['.tmp', dist()]);
});

// Watch Files For Changes & Reload
gulp.task('serve',  function() {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'FNMP',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'src',
    baseDir: 'src'
  });

  gulp.watch(['src/**/**/**/*.html'], reload);
  gulp.watch(['src/**/**/**/*.css'], reload);
  gulp.watch(['src/js/**/*.js'], ['jshint',reload]);
  gulp.watch(['src/img/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function() {
  browserSync({
    notify: false,
    logPrefix: 'FNMP',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    baseDir: "dist"
  });
});



// Build production files, the default task
gulp.task('default', ['clean'], function(cb) {
  // Uncomment 'cache-config' if you are going to use service workers.
  runSequence(
    [ 'jshint', 'copy', 'styles','compress'],
    ['images', 'html' ,'bower'],

    cb);
});