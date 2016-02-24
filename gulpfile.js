var gulp = require('gulp');
var del = require('del');
var header = require('gulp-header');
var concat = require('gulp-concat');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var pkg = require('./package.json');

var sSource = './res/*.js';
var sLastBuild = './tmp';
var sMiniRes = './tmp/mini';
var sDestination = './dist';

var sDecal = [
	'/**',
	' * <%=pkg.name%>',
	' * @Version: <%=pkg.version%>',
	' * @Author: <%=pkg.author%>',
	' */'
].join('\n');

// 压缩文件并保存.min.js
gulp.task('mini', ['change'], function () {
	gulp.src(sMiniRes + '/*.js')
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest(sDestination));
});
// 匹配源文件与最后一次build过的文件,只做增量的更新
gulp.task('change', ['clean'], function () {
	gulp.src(sSource)
		.pipe(changed(sLastBuild))
		.pipe(gulp.dest(sMiniRes))
		.pipe(gulp.dest(sLastBuild));
});

gulp.task('clean', function () {
	del([sMiniRes]);
});

gulp.task('build', ['mini'], function () {
	gulp.src(sDestination + '/*.js')
		.pipe(concat('jClass-' + pkg.version + '.js'))
		.pipe(header(sDecal, {pkg: pkg}))
		.pipe(gulp.dest('./release/'));
});

gulp.task('default', ['build']);