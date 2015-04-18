var  tinylr = require('tiny-lr'),
     serverlr=tinylr();

     gulp = require('gulp'),
     imagemin = require('gulp-imagemin'),
     concat = require('gulp-concat'),
     uglify = require('gulp-uglify'),
     rename = require('gulp-rename'),
     compass = require('gulp-compass'),
     webserver = require('gulp-webserver'),
     clean = require('gulp-clean'),
     minifyCss = require('gulp-minify-css'),
     opn = require('opn');
     // livereload = require('gulp-livereload');


var paths = {
    scripts: 'src/js/*.js',
    images: 'src/images/**/*',
    sass:'src/sass/*.scss',
    html:'src/**/*'
};

var server = {
  host: 'localhost',
  port: '8001'
}

//开启本地 Web 服务器功能
gulp.task('webserver', function() {
  gulp.src('./dist')
    .pipe(webserver({
      host:server.host,
      port:server.port,
      // fallback: 'index.html',
      directoryListing: false,
      open: true,
      livereload: {
        enable: true // need this set to true to enable livereload
      }
    }));
});

//处理html文件
gulp.task('html',function(){

       var htmlSrc = './src/*.html',
           htmlDst = './dist/';

       gulp.src(htmlSrc)
           .pipe(gulp.dest(htmlDst));

});
//图片处理
gulp.task('images',function(){
       var imgSrc = './src/images/**/*',
           imgDst = './dist/images/';

       gulp.src(imgSrc)
           .pipe(imagemin())
           .pipe(gulp.dest(imgDst));
});

// js处理
gulp.task('js', function () {
    var jsSrc = './src/js/*.js',
        jsDst ='./dist/js';

    gulp.src(jsSrc)
        // .pipe(jshint('.jshintrc'))
        // .pipe(jshint.reporter('default'))
        .pipe(concat('main.js')) //合并所有javascript 文件为一个main.min.js  
        // .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())//压缩
        .pipe(gulp.dest(jsDst));
});

//Compass 进行SASS 代码
gulp.task('compass', function() {
  gulp.src('./src/sass/*.scss')
    // .pipe(plumber())
    .pipe(compass({
      // config_file: './config.rb',
      css:'src/css',
      sass:'src/sass'
    }))
    .pipe(minifyCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/css'));
});

// 清空图片、样式、js文件及文件夹
gulp.task('clean', function() {
    //return的作用是返回stream对象，因为函数的执行和stream操作无关
    return gulp.src(['./dist/css', './dist/js', './dist/images'],{read: false})
        .pipe(clean());
        // .pipe(gulp.dest('./clean'));;
});

gulp.task('default',['clean'],function(){
       console.log('the gulp has been running....')
       gulp.start('html','images','js','compass');
       gulp.start('watch');
       gulp.start('webserver');
       gulp.start('openbrowser');
});

//通过浏览器打开本地 Web服务器 路径
gulp.task('openbrowser', function() {
  opn( 'http://' + server.host + ':' + server.port );
});
//监听源文件变化
gulp.task('watch',function(){

    serverlr.listen(35729, function (err) {
      if (err){
        return console.log(err);
      }
    });

    gulp.watch(paths.html,function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('html');  
    });
    gulp.watch(paths.scripts,function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('js');  
    });
    gulp.watch(paths.images,function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('images');
    });
    gulp.watch(paths.sass,function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.start('compass');  
    });
});
