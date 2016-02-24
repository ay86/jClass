/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 针对IE6提供的一个方法, 在IE6浏览页面顶部出现一个自定内容的提示条
 * @Dependent jClass-util.js
 * @Since 16/2/19
 */

(function () {
	var oUtil = jClass.util;
	oUtil && (oUtil.badIE6 = function (oObj, cHTML) {
		if (oUtil.isWho('ie6')) {
			var oIE6 = document.createElement('div');
			oIE6.id = 'badIE6';
			oIE6.style.cssText = 'padding:0 10px;background-color:#FFFFE1;border-bottom:#fff outset 2px;line-height:30px;color:#000;height:30px;';
			oIE6.title = 'Double click to close this tips.';
			oIE6.ondblclick = function () {
				this.parentNode.removeChild(this);
			};
			oIE6.onmouseover = function () {
				this.style.backgroundColor = '#316AC5';
				this.style.color = '#fff';
			};
			oIE6.onmouseout = function () {
				this.style.backgroundColor = '#FFFFE1';
				this.style.color = '#000';
			};
			oIE6.innerHTML = cHTML;
			oObj.parentNode.insertBefore(oIE6, oObj);
		}
	});
})();
