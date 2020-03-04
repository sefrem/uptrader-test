'use strict'

/* пути к исходным файлам (src), к готовым файлам (docs), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
  docs: {
      html: 'docs/',
      js: 'docs/js/',
      css: 'docs/css/',
      img: 'docs/img/',
      icons: 'docs/icons/'
  },
  src: {
      html: 'src/*.html',
      js: 'src/scripts/main.js',
      style: 'src/styles/main.scss',
      img: 'src/img/**/*.*',
      icons: 'src/icons/**/*.*'
  },
  watch: {
      html: 'src/*.html',
      js: 'src/scripts/**/*.js',
      css: 'src/styles/**/*.scss',
      img: 'src/img/**/*.*',
      icons: 'src/icons/**/*.*'
  },
  clean: './docs/*'
};

/* настройки сервера */
var config = {
  server: {
      baseDir: './docs'
  },
  notify: false
};

/* подключаем gulp и плагины */
var gulp = require('gulp'),  // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    terser = require('gulp-terser'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg	
    pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    rimraf = require('gulp-rimraf'), // плагин для удаления файлов и каталогов
    rename = require('gulp-rename');

  /* задачи */

// запуск сервера
gulp.task('webserver', function () {
  webserver(config);
});

gulp.task('html:docs', function () {
  return gulp.src(path.src.html) // выбор всех html файлов по указанному пути
      .pipe(plumber()) // отслеживание ошибок
      .pipe(rigger()) // импорт вложений
      .pipe(gulp.dest(path.docs.html)) // выкладывание готовых файлов
      .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
});

// сбор стилей
gulp.task('css:docs', function () {
  return gulp.src(path.src.style) // получим main.scss
      .pipe(plumber()) // для отслеживания ошибок
      .pipe(sourcemaps.init()) // инициализируем sourcemap
      .pipe(sass()) // scss -> css
      .pipe(autoprefixer()) // добавим префиксы
      .pipe(gulp.dest(path.docs.css))
      .pipe(rename({ suffix: '.min' }))
      .pipe(cleanCSS()) // минимизируем CSS
      .pipe(sourcemaps.write('./')) // записываем sourcemap
      .pipe(gulp.dest(path.docs.css)) // выгружаем в docs
      .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

// сбор js
gulp.task('js:docs', function () {
  return gulp.src(path.src.js) // получим файл main.js
      .pipe(plumber()) // для отслеживания ошибок
      .pipe(rigger()) // импортируем все указанные файлы в main.js
      .pipe(gulp.dest(path.docs.js))
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.init()) //инициализируем sourcemap
      .pipe(terser()) // минимизируем js
      .pipe(sourcemaps.write('./')) //  записываем sourcemap
      .pipe(gulp.dest(path.docs.js)) // положим готовый файл
      .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});


// обработка картинок
gulp.task('image:docs', function () {
  return gulp.src(path.src.img) // путь с исходниками картинок
      .pipe(cache(imagemin([ // сжатие изображений
          imagemin.gifsicle({ interlaced: true }),
          jpegrecompress({
              progressive: true,
              max: 90,
              min: 80
          }),
          pngquant(),
          imagemin.svgo({ plugins: [{ removeViewBox: false }] })
      ])))
      .pipe(gulp.dest(path.docs.img)); // выгрузка готовых файлов
});

gulp.task('icons:docs', function() {
  return gulp.src(path.src.icons)
          .pipe(gulp.dest(path.docs.icons));
})

// удаление каталога docs 
gulp.task('clean:docs', function () {
  return gulp.src(path.clean, { read: false })
      .pipe(rimraf());
});

// очистка кэша
gulp.task('cache:clear', function () {
  cache.clearAll();
});

// сборка
gulp.task('docs',
  gulp.series('clean:docs',
      gulp.parallel(
          'html:docs',
          'css:docs',
          'js:docs',
          'image:docs',
          'icons:docs'
      )
  )
);

// запуск задач при изменении файлов
gulp.task('watch', function () {
  gulp.watch(path.watch.html, gulp.series('html:docs'));
  gulp.watch(path.watch.css, gulp.series('css:docs'));
  gulp.watch(path.watch.js, gulp.series('js:docs'));
  gulp.watch(path.watch.img, gulp.series('image:docs'));
});

// задача по умолчанию
gulp.task('default', gulp.series(
  'docs',
  gulp.parallel('webserver','watch')      
));