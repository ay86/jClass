/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description UMD
 * @Since 2017/2/17
 */

(function (root, name, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	}
	else if (typeof module != 'undefined') {
		module.exports = factory();
	}
	else {
		root[name] = factory();
	}
})(this, 'jClass', function () {
	return jClass;
});