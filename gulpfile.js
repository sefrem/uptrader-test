"use strict";

var path = {
  docs: {
    html: "docs/",
    js: "docs/js/",
    css: "docs/css/",
    img: "docs/img/",
    icons: "docs/icons/"
  },
  src: {
    html: "src/*.html",
    js: "src/scripts/main.js",
    style: "src/styles/main.scss",
    img: "src/img/**/*.*",
    icons: "src/icons/**/*.*"
  },
  watch: {
    html: "src/*.html",
    js: "src/scripts/**/*.js",
    css: "src/styles/**/*.scss",
    img: "src/img/**/*.*",
    icons: "src/icons/**/*.*"
  },
  clean: "./docs/*"
};

var config = {
  server: {
    baseDir: "./docs"
  },
  notify: false
};

var gulp = require("gulp"),
  webserver = require("browser-sync"),
  plumber = require("gulp-plumber"),
  rigger = require("gulp-rigger"),
  sourcemaps = require("gulp-sourcemaps"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  terser = require("gulp-terser"),
  cache = require("gulp-cache"),
  imagemin = require("gulp-imagemin"),
  jpegrecompress = require("imagemin-jpeg-recompress"),
  pngquant = require("imagemin-pngquant"),
  rimraf = require("gulp-rimraf"),
  rename = require("gulp-rename");

gulp.task("webserver", function() {
  webserver(config);
});

gulp.task("html:docs", function() {
  return gulp
    .src(path.src.html)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.docs.html))
    .pipe(webserver.reload({ stream: true }));
});

gulp.task("css:docs", function() {
  return gulp
    .src(path.src.style)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
        cascade: true
      })
    )
    .pipe(gulp.dest(path.docs.css))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(path.docs.css))
    .pipe(webserver.reload({ stream: true }));
});

gulp.task("js:docs", function() {
  return gulp
    .src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.docs.js))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(path.docs.js))
    .pipe(webserver.reload({ stream: true }));
});

gulp.task("image:docs", function() {
  return gulp
    .src(path.src.img)
    .pipe(
      cache(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          jpegrecompress({
            progressive: true,
            max: 90,
            min: 80
          }),
          pngquant(),
          imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ])
      )
    )
    .pipe(gulp.dest(path.docs.img));
});

gulp.task("icons:docs", function() {
  return gulp.src(path.src.icons).pipe(gulp.dest(path.docs.icons));
});

gulp.task("clean:docs", function() {
  return gulp.src(path.clean, { read: false }).pipe(rimraf());
});

gulp.task("cache:clear", function() {
  cache.clearAll();
});

gulp.task(
  "docs",
  gulp.series(
    "clean:docs",
    gulp.parallel(
      "html:docs",
      "css:docs",
      "js:docs",
      "image:docs",
      "icons:docs"
    )
  )
);

gulp.task("watch", function() {
  gulp.watch(path.watch.html, gulp.series("html:docs"));
  gulp.watch(path.watch.css, gulp.series("css:docs"));
  gulp.watch(path.watch.js, gulp.series("js:docs"));
  gulp.watch(path.watch.img, gulp.series("image:docs"));
});

gulp.task("default", gulp.series("docs", gulp.parallel("webserver", "watch")));
