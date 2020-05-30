// Initializa modules
const { src, dest, watch, series, parallel } = require('gulp')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')

const paths = {
    html: {
      src: './src/**/*.html',
      dest:'./dest/'
    },
    styles: {
      src: './src/assets/scss/**/*.scss',      
      srcVendor: './src/assets/css/**/*.css',      
      dest: './dest/assets/css/',
      destName: 'main.mim.css'   
    },
    scripts: {
      src: './src/assets/js/**/*.js',      
      dest: './dest/assets/js/',
      destName: 'scrips.min.js'  
    }
  };

  // HTML tasks
  function htmlTask(){
    return src(paths.html.src)
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(dest(paths.html.dest))
  }

// JS tasks
function jsTask() {
    return src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            minified: true,          
            comments: false,
            presets: ['@babel/env']
        }))        
        .pipe(concat(paths.scripts.destName))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.scripts.dest))   
        .on('error', function (err) { console.log(err) })     
}

// Sass and Css task
function scssTask() {
    return src(paths.styles.src) // scss
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))                
      .pipe(src(paths.styles.srcVendor)) // css vendor
      .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(sourcemaps.write('.'))
      .pipe(concat(paths.styles.destName))
      .pipe(dest(paths.styles.dest))
}

// Watch task
function watchTask() {
    watch([paths.styles.src, paths.styles.srcVendor, paths.scripts.src],
        parallel(htmlTask, scssTask, jsTask))
}

// Default task
exports.default = series(
    parallel(htmlTask, scssTask, jsTask),
    watchTask
)
