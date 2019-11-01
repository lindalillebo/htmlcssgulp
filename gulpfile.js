var { src, dest, watch, series, parallel } = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var cleanCSS = require('gulp-clean-css');
sass.compiler = require('node-sass');
 

function copyTask() {
    return src('*.html')
    .pipe(dest('dist'));
}

function sassTask() {
    return src('sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

async function imageminTask() {
     src('images/*')
    .pipe(imagemin())
    .pipe(dest('dist/images'))
}

function browserSyncTask() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    watch('sass/*.scss', sassTask)
    watch('*.js').on('change', browserSync.reload);
    watch('*.html').on('change', series(copyTask, browserSync.reload));
    
}

exports.default = parallel(copyTask, sassTask, imageminTask, browserSyncTask);
