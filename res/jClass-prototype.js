/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description jClass选择器扩展方法
 * @Dependent jClass.js
 * @Since 16/2/22
 */

(function ($) {
	if (!$) {
		return;
	}
	$.on = function (sEvent, sSelector, fFn) {
		if (typeof sSelector === 'function') {
			fFn = sSelector;
			sSelector = null;
		}
		this.each(function () {
			var _this = this;
			jClass.addEvent(_this, sEvent, function () {
				var oEv = arguments[arguments.length - 1] || window.event;
				var _stopBubble;
				if (sSelector) {
					var $Child = jClass(sSelector, _this);
					var bHas = false;
					for (var i = 0; i < $Child.length; i++) {
						if ($Child[i] === oEv.target) {
							bHas = true;
							break;
						}
					}
					if (bHas) {
						_stopBubble = fFn.call(oEv.target, oEv);
					}
				}
				else {
					_stopBubble = fFn.call(_this, oEv);
				}
				// 从callback返回值中判断是否需要阻步冒泡
				if (typeof _stopBubble === 'boolean') {
					_stopBubble = !_stopBubble;
				}
				else {
					_stopBubble = false;
				}
				// 阻止冒泡及默认行为
				if (_stopBubble) {
					oEv.preventDefault();
					if (oEv.stopPropagation) {
						oEv.stopPropagation();
					}
					else {
						oEv.cancelBubble = true;
					}
				}
			});
		});
	};
	/* 淡入淡出 */
	$.fade = function (nValue, nStep, fFn) {
		nValue = nValue || 0;
		nStep = nStep || 1;
		if (typeof nStep === 'function') {
			fFn = nStep;
			nStep = 1;
		}
		for (var i = 0; i < this.length; i++) {
			(function () {
				var $This = jClass(this);
				var nStart = $This.css('opacity') * 100;
				nStart = isNaN(nStart) ? 100 : nStart;
				(function () {
					var __call = arguments.callee;

					function __fSet() {
						if (nStart > nValue) {
							nStart -= nStep;
						}
						else {
							nStart += nStep;
						}
						$This.alpha(nStart);
						if (nStart === nValue) {
							typeof fFn === 'function' && fFn.call($This.elements[0]);
						}
						else {
							__call();
						}
					}

					if (typeof window.requestAnimationFrame === 'function') {
						requestAnimationFrame(__fSet);
					}
					else {
						setTimeout(__fSet, 17);
					}
				})();
			}).call(this.elements[i]);
		}
		return this;
	};
	/* 震动 */
	$.shake = function (nRepeat, aCord, nSpeed) {
		var fFn = arguments[arguments.length - 1];
		if (arguments.length === 2 && typeof fFn === 'function') {
			nRepeat = null;
			aCord = null;
			nSpeed = null;
		}
		else {
			if (nRepeat instanceof Array) {
				nSpeed = aCord;
				aCord = nRepeat;
				nRepeat = null;
			}
			if (typeof aCord === 'function') {
				aCord = null;
				nSpeed = null;
			}
			else if (typeof aCord === 'number') {
				nSpeed = aCord;
				aCord = null;
			}
			if (typeof nSpeed === 'function') {
				nSpeed = null;
			}
		}

		nSpeed = nSpeed || 16;
		aCord = aCord || [[0, 6], [6, 0], [0, -6], [-6, 0]];
		nRepeat = nRepeat || 1;

		this.each(function () {
			var oObj = this;
			var j = 0;
			var i = 0;
			(function () {
				if (j >= nRepeat) {
					typeof fFn === 'function' && fFn();
					return;
				}
				var _call = arguments.callee;

				function __fRun() {
					var aOffset = aCord[i];
					var nObjLeft = oObj.offsetLeft;
					var nObjTop = oObj.offsetTop;
					oObj.style.left = nObjLeft + aOffset[0] + 'px';
					oObj.style.top = nObjTop + aOffset[1] + 'px';
					i++;
					if (i >= aCord.length) {
						j++;
						i = 0;
					}
					_call();
				}

				if (typeof window.requestAnimationFrame === 'function' && nSpeed < 17) {
					requestAnimationFrame(__fRun);
				}
				else {
					setTimeout(__fRun, nSpeed);
				}
			})();
		});
	};
	/* 形状动画 */
	$.animateShape = function (sProp, sValue, nSec, fFn) {
		if (!sProp || typeof sValue === 'undefined') {
			return;
		}
		if (typeof nSec === 'function') {
			fFn = nSec;
			nSec = null;
		}
		var _strProp = (function () {
			if (sProp.indexOf('.') > -1) {
				return sProp.split('.');
			}
			return false;
		})();

		nSec = nSec || .3;

		this.each(function () {
			var oObj = this;
			var $Obj = jClass(this);
			// 取得当前值
			var nCurrent;
			if (_strProp) {
				// 只支持二级
				nCurrent = $Obj.css(_strProp[1]);
			}
			else {
				nCurrent = oObj[sProp];
			}
			// 得到终点值
			var nValue = parseInt(sValue, 10);
			if (isNaN(nValue)) {
				return;
			}
			// 得到单位
			var sUnit = sValue.toString().replace(nValue.toString(), '');
			// 单次的间隔时间
			var nDelay = 20;
			// 计算时间内的步数
			var nStep = Math.abs(nValue - nCurrent) / (nSec * 1000 / (nDelay + 3.4));

			(function (bUp) {
				var _call = arguments.callee;
				setTimeout(function () {
					var _current, _count = 0;

					function __fV(n) {
						if (bUp) {
							_count = n + nStep;
							if (_count > nValue) {
								_count = nValue;
							}
						}
						else {
							_count = n - nStep;
							if (_count < nValue) {
								_count = nValue;
							}
						}
						return _count + sUnit;
					}

					if (_strProp) {
						_current = $Obj.css(_strProp[1]);
						oObj[_strProp[0]][_strProp[1]] = __fV(_current);
					}
					else {
						_current = oObj[sProp];
						oObj[sProp] = __fV(_current);
					}

					if (_count === nValue) {
						typeof fFn === 'function' && fFn();
					}
					else {
						_call(bUp);
					}
				}, nDelay);
			})(nValue > nCurrent);
		});
		return this;
	};
	/* 获取对象的信息 */
	$.get = function () {
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
	/* 将表单的数据序列化 */
	$.serialize = function () {
		var aSerialize = [];
		var $Item;
		if (!this[0].elements) {
			return;
		}
		$Item = jClass(this[0].elements);
		$Item.each(function () {
			if (this.disabled || this.tagName === 'button' || this.type === 'button') {
				return;
			}
			if (this.type === 'radio' || this.type === 'checkbox') {
				if (this.checked) {
					aSerialize.push(encodeURIComponent(this.name) + '=' + encodeURIComponent(this.value));
				}
			}
			else {
				if (this.value) {
					aSerialize.push(encodeURIComponent(this.name) + '=' + encodeURIComponent(this.value));
				}
			}
		});
		return aSerialize.join('&');
	};
	/* 选择框选择动作 */
	$.checkBox = function (sDir) {
		var $Input = jClass('input[type="checkbox"]', this);
		switch (sDir) {
			case 'all':
				$Input.each(function () {
					this.checked = 'checked';
				});
				break;
			case'other':
				$Input.each(function () {
					if (this.checked) {
						this.checked = null;
					}
					else {
						this.checked = 'checked';
					}
				});
				break;
			case 'not':
				$Input.each(function () {
					this.checked = null;
				});
				break;
		}
	};
})(jClass.fx);