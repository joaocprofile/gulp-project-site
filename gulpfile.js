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
  app: {
    html: {
      src: './src/**/*.html',
      dist: './dist/'
    },
    styles: {
      src: './src/assets/scss/**/*.scss',
      dist: './dist/assets/css/',
      distName: 'main.min.css'
    },
    scripts: {
      src: './src/assets/js/**/*.js',
      dist: './dist/assets/js/',
      distName: 'scrips.min.js'
    }
  },
  deps: {    
    bootstrap: {
      css: {
        src: './src/assets/vendor/bootstrap/dist/css/bootstrap.min.css',                        
      },
      js: {
        src: './src/assets/vendor/bootstrap/dist/js/bootstrap.min.js',        
      }
    },
    fontAwesome: {
      css: {
        src: './src/assets/vendor/font-awesome/css/all.min.css',                     
      },
      fonts: {
        src: './src/assets/vendor/font-awesome/webfonts/*'
      }
    },
    dist: {
      path: './dist/assets/vendor/',            
      fontsPath: './dist/assets/vendor/fonts/',
      cssFinalName: 'deps.mim.css',
      jsFinalName: 'deps.mim.js',
    },
  }
}

// HTML tasks
function htmlTask() {
  return src(paths.app.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(paths.app.html.dist))
}

// JS tasks
function jsTask() {
  return src(paths.app.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      minified: true,
      comments: false,
      presets: ['@babel/env']
    }))
    .pipe(concat(paths.app.scripts.distName))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.app.scripts.dist))
    .on('error', function (err) { console.log(err) })
}

// Sass and Css task
function scssTask() {
  return src(paths.app.styles.src) // scss
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))    
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(concat(paths.app.styles.distName))
    .pipe(dest(paths.app.styles.dist))
}

// Deps Tasks
function depsCssBuild(){
  return src([paths.deps.bootstrap.css.src,
              paths.deps.fontAwesome.css.src])          
         .pipe(concat(paths.deps.dist.cssFinalName)) 
         .pipe(dest(paths.deps.dist.path))                  
}
function depsJsBuild(){
  return src([paths.deps.bootstrap.js.src])          
         .pipe(concat(paths.deps.dist.jsFinalName)) 
         .pipe(dest(paths.deps.dist.path))                  
}
function depsFontsBuild(){
  return src(paths.deps.fontAwesome.fonts.src)        
        .pipe(dest(paths.deps.dist.fontsPath))                
}

// Watch task
function watchTask() {
  watch([
    paths.app.html.src,
    paths.app.styles.src,    
    paths.app.scripts.src    
  ],
    parallel(htmlTask, scssTask, jsTask, depsCssBuild, depsJsBuild, depsFontsBuild))
}

// Default task
exports.default = series(
  parallel(htmlTask, scssTask, jsTask, depsCssBuild, depsJsBuild, depsFontsBuild),
  watchTask
)


