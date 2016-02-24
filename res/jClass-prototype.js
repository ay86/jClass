/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description jClass选择器原型方法
 * @Dependent jClass.js, jClass-util.js
 * @Since 16/2/22
 */

(function ($) {
	if (!$) {
		return;
	}
	/* 获取对象的信息 */
	$.prototype.get = function () {
		var oObj = this.elements[0];
		var oDoc = typeof document.body.style.webkitTransition !== 'undefined' ? document.body : document.documentElement;
		var oDomRect = document.documentElement.getBoundingClientRect();
		if (typeof oObj.getBoundingClientRect == 'function') {
			oObj.getBoundingClientRect = function () {
				var _me = this;
				var _parent = {
					top: 0,
					bottom: 0,
					left: 0,
					right: 0
				};
				if (_me.offsetParent) {
					_parent = arguments.callee.call(_me.offsetParent);
				}
				return {
					top: _me.offsetTop + _parent.top,
					bottom: _me.offsetTop + _me.offsetHeight + _parent.top,
					left: _me.offsetLeft + _parent.left,
					right: _me.offsetLeft + _me.offsetWidth + _parent.left
				}
			};
			oDoc = {
				scrollTop: 0,
				scrollLeft: 0
			};
			oDomRect = {
				left: 0
			}
		}

		return {
			top: (function () {
				return oObj.getBoundingClientRect().top + oDoc.scrollTop;
			})(),
			bottom: (function () {
				return oObj.getBoundingClientRect().bottom + oDoc.scrollTop;
			})(),
			left: (function () {
				return oObj.getBoundingClientRect().left + oDoc.scrollLeft - oDomRect.left;
			})(),
			right: (function () {
				return oObj.getBoundingClientRect().right + oDoc.scrollLeft - oDomRect.left;
			})()
		};
	};

	$.prototype.checkBox = function (sDir) {
		var $Input = $.selector('input[type="checkbox"]', this);
		switch (sDir) {
			case 'all':
				this.each(function () {
					this.checked = 'checked';
				});
				break;
			case'other':
				this.each(function () {
					if (this.checked) {
						this.checked = null;
					}
					else {
						this.checked = 'checked';
					}
				});
				break;
			case 'not':
				this.each(function () {
					this.checked = null;
				});
				break;
		}
	};
})(jClass.$);