'use strict';
const _ = require('lodash');
const gulp = require('gulp');
const prefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const del = require('del');
const watch = require('gulp-watch');
const browserSync = require('browser-sync');

const reload = browserSync.reload;
const path = {
    build: {
        html: 'dist/',
        sass: 'dist/static/css/',
        js: 'dist/static/js/',
        img: 'dist/static/assets/img/',
        fonts: 'dist/static/assets/fonts/',
        icons: 'dist/static/icons/'
    },
    src: {
        html: 'src/**/*.html',
        js: 'src/scripts/**/*.js',
        sass: 'src/styles/**/*.scss',
        img: 'src/assets/img/**/*.*',
        fonts: 'src/assets/fonts/**/*.*',
        icons: 'src/assets/icons/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/scripts/**/*.js',
        sass: 'src/styles/**/*.scss',
        img: 'src/assets/img/**/*.*',
        fonts: 'src/assets/fonts/**/*.*',
        icons: 'src/assets/icons/*.*'
    },
    clean: ['dist/static/**'],
    sassIncludes: _.flatten([
        require('bourbon-neat').includePaths,
        require('bourbon').includePaths
    ])
};

const config = {
    server: {
        baseDir: './dist'
    },
    tunnel: true,
    host: 'localhost',
    port: 9000
};

gulp.task('html:build', () => (
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({ stream: true }))
));

gulp.task('js:build', () => (
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream: true }))
));

gulp.task('sass:build', () => (
    gulp.src(path.src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: path.sassIncludes}))
            .on('error', sass.logError)
        .pipe(prefixer('last 2 version', 'ie >= 9'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(path.build.sass))
        .pipe(reload({ stream: true }))
));

gulp.task('img:build', () => (
    gulp.src(path.src.img)
        .pipe(imagemin([imagemin.svgo(), mozjpeg({ quality: 90 }), pngquant({ quality: 90 })], {
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}))
));

gulp.task('fonts:build', () => (
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
));

gulp.task('build', [
    'html:build',
    'js:build',
    'sass:build',
    'img:build',
    'fonts:build',
    'icons:build'
]);

gulp.task('watch', () => {
    for (let item in path.watch)
        if (path.watch.hasOwnProperty(item))
            watch([path.watch[item]], () => gulp.start(`${item}:build`))
});

gulp.task('start', () => browserSync(config));
gulp.task('clean', () => del(path.clean));
gulp.task('default', ['build', 'start', 'watch']);

