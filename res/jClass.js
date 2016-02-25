/*
 jClass 源文件
 */

var jClass = {
	$: function () {
		var __selector = new jClass.__class;
		return __selector.apply(jClass, Array.prototype.slice.call(arguments, 0));
	},
	__class: function () {
		return this.selector;
	}
};
jClass.__class.prototype = {
	extend: function (oObject) {
		function __fIterator(oOld, oNew) {
			for (var x in oNew) {
				oOld[x] = oNew[x];
			}
			return oOld;
		}

		for (var i = 1; i < arguments.length; i++) {
			if (typeof arguments[i] === 'object') {
				oObject = __fIterator(oObject, arguments[i]);
			}
		}
		return oObject;
	},
	selector: function (sExpression, oScopeDOM) {
		/**
		 * 数组内查找
		 * @param aArray 查询的数组对象
		 * @param sKey 查询的关键词
		 * @returns {boolean}
		 * @private
		 */
		function __fInArray(aArray, sKey) {
			for (var i = 0; i < aArray.length; i++) {
				if (aArray[i] === sKey) {
					return true;
				}
			}
			return false;
		}

		/**
		 * 向上查找匹配对象
		 * @param aParentKey 父级的标识数组
		 * @param oChildren 归递查询的子元素
		 * @returns {Boolean}
		 * @private
		 */
		function __fFindParent(aParentKey, oChildren) {
			// 查找到根停止继续查找，返回假
			if (oChildren === document.documentElement) {
				return false;
			}
			// 如果已经没有断言条件了，返回真
			if (aParentKey.length === 0) {
				return true;
			}
			// 当前对象的父级进行断言，成功则断了往上，不成功则返回假
			if (__fAssert(oChildren.parentNode, aParentKey.slice(-1))) {
				return arguments.callee(aParentKey.slice(0, -1), oChildren.parentNode);
			}
			else {
				return arguments.callee(aParentKey, oChildren.parentNode);
			}
		}

		/**
		 * 链式分解
		 * @param sChain 链式字符串
		 * @returns {Array} 分解结果集
		 * @private
		 */
		function __fChain(sChain) {
			sChain = sChain.replace(/\./g, ' .').replace(/\[/g, ' [');
			return sChain.replace(/^ /, '').split(' ');
		}

		/**
		 *
		 * @param oObj 断言对象
		 * @param aAssert 断言条件
		 * @returns {boolean}
		 * @private
		 */
		function __fAssert(oObj, aAssert) {
			for (var i = 0; i < aAssert.length; i++) {
				var sCondition = aAssert[i].substr(1);
				switch (aAssert[i].substr(0, 1)) {
					case '#': // id
						if (oObj.getAttribute('id') !== sCondition) {
							return false;
						}
						break;
					case '.': // className
						if (!__fInArray(oObj.getAttribute('class').split(' '), sCondition)) {
							return false;
						}
						break;
					case '@': // name
						if (oObj.getAttribute('name') !== sCondition) {
							return false;
						}
						break;
					case '[': // property
						var aProp = sCondition.substring(0, sCondition.length - 1).split('=');
						if (aProp.length === 2) {
							if (oObj.getAttribute(aProp[0]) !== aProp[1]) {
								return false;
							}
						}
						else {
							if (!oObj.getAttribute(aProp[0])) {
								return false;
							}
						}
						break;
					default : // tagName
						if (oObj.tagName.toUpperCase() !== aAssert[i].toUpperCase()) {
							return false;
						}
				}
			}
			return true;
		}

		/**
		 * 获取单项对象
		 * @param sKey 表达式
		 * @returns {Array} 返回选择中的对象数组
		 * @private
		 */
		function __fSingle(sKey) {
			var aGet = [];
			var sVal = sKey.substr(1);
			var oScope = oScopeDOM || document;
			var oObj, i;
			switch (sKey.substr(0, 1)) {
				case '<': // create element
					var _el = document.createElement('div');
					_el.innerHTML = sKey;
					oObj = _el.children[0];
					oObj && aGet.push(oObj);
					_el = null;
					break;
				case '#': // ID
					oObj = document.getElementById(sVal);
					oObj && aGet.push(oObj);
					break;
				case '.': // Class name
					if (document.getElementsByClassName) {
						oObj = document.getElementsByClassName(sVal);
						oObj && (aGet = Array.prototype.slice.call(oObj, 0));
					}
					else {
						oObj = oScope.getElementsByTagName('*');
						for (i = 0; i < oObj.length; i++) {
							if (__fInArray(oObj[i].getAttribute('class').split(' '), sVal)) {
								aGet.push(oObj[i]);
							}
						}
					}
					break;
				case '@': // name
					oObj = document.getElementsByName(sVal);
					oObj && (aGet = Array.prototype.slice.call(oObj, 0));
					break;
				case '[': // property
					sVal = sKey.substring(1, sKey.length - 1);
					oObj = oScope.getElementsByTagName('*');
					var aProp = sVal.split('=');
					var sProp;
					if (aProp.length === 2) {
						sProp = aProp[0];
						sVal = aProp[1];
					}
					for (i = 0; i < oObj.length; i++) {
						if (sProp) {
							if (oObj[i].getAttribute(sProp) === sVal) {
								aGet.push(oObj[i]);
							}
						}
						else {
							if (oObj[i].getAttribute(sVal)) {
								aGet.push(oObj[i]);
							}
						}
					}
					break;
				default : // tag name
					oObj = oScope.getElementsByTagName(sKey);
					oObj && (aGet = Array.prototype.slice.call(oObj, 0));
			}
			return aGet;
		}

		/**
		 * 对所有返回对象执行对应操作
		 * @param aElements 返回对象数组
		 * @param fOpaFn 执行的方法
		 * @private
		 */
		function __fAllElementsOpa(aElements, fOpaFn) {
			for (var i = 0; i < aElements.length; i++) {
				fOpaFn.call(aElements[i], i);
			}
		}

		function __fGet(sExpr) {
			if (typeof sExpr === 'object' && sExpr.ownerDocument) {
				return [sExpr];
			}
			if (sExpr.substr(0, 1) === '<') {
				return __fSingle(sExpr);
			}
			var aResult = [];
			var aExpr = sExpr.split(' ');
			var nLast = aExpr.length - 1;
			var sCurrent = aExpr[nLast];
			if (aExpr.length > 1) {
				// multiple
				var aAssert = aExpr.slice(0, -1);
				var aChildren = __fGet(sCurrent);
				for (var j = 0; j < aChildren.length; j++) {
					var oChildren = aChildren[j];
					var bHas = __fFindParent(aAssert, oChildren);
					bHas && aResult.push(oChildren);
				}
			}
			else {
				// single
				var aChain = __fChain(sCurrent);
				var aCurrent = __fSingle(aChain[0]);
				if (aChain.length > 1) {
					// 存在链式
					for (var k = 0; k < aCurrent.length; k++) {
						if (__fAssert(aCurrent[k], aChain.slice(1))) {
							aResult.push(aCurrent[k]);
						}
					}
				}
				else {
					aResult = aCurrent;
				}
			}
			return aResult;
		}

		var aElem = __fGet(sExpression);

		var JC = this;
		var __fExtend = JC.__class.prototype.extend;

		var oSelector = {
			ver: '2.0',
			elements: aElem,
			length: aElem.length,
			each: function (fCallBack) {
				if (typeof fCallBack === 'function') {
					__fAllElementsOpa(this.elements, function (index) {
						fCallBack.call(this, index);
					});
				}
				return this;
			},
			remove: function () {
				__fAllElementsOpa(this.elements, function () {
					this.parentNode.removeChild(this);
				});
			},
			removeAttr: function (sAttr) {
				__fAllElementsOpa(this.elements, function () {
					this.removeAttribute(sAttr);
				});
				return this;
			},
			attr: function (sAttr, sAttrVal) {
				var aAttr = [];
				__fAllElementsOpa(this.elements, function () {
					if (sAttrVal) {
						this.setAttribute(sAttr, sAttrVal);
					}
					else {
						aAttr.push(this.getAttribute(sAttr));
					}
				});
				if (!sAttrVal) {
					return aAttr[0];
				}
				return this;
			},
			addClass: function (sClassName) {
				if (sClassName) {
					__fAllElementsOpa(this.elements, function () {
						var _class = this.getAttribute('class');
						var aClass = _class ? _class.split(' ') : [];
						if (!__fInArray(aClass, sClassName)) {
							aClass.push(sClassName);
							this.setAttribute('class', aClass.join(' '));
						}
					});
				}
				return this;
			},
			removeClass: function (sClassName) {
				if (sClassName) {
					__fAllElementsOpa(this.elements, function () {
						var _class = this.getAttribute('class');
						var sClass = (' ' + _class + ' ').replace(' ' + sClassName + ' ', ' ');
						this.setAttribute('class', sClass.replace(/(^ | $)/, ''));
					});
				}
				return this;
			},
			append: function (oObj) {
				var _parent = this.elements[0];
				if (typeof oObj === 'string') {
					oObj = __fGet(oObj)[0];
				}
				if (oObj.ownerDocument) {
					_parent.appendChild(oObj);
				}
				else {
					if (oObj.ver) {
						__fAllElementsOpa(oObj.elements, function () {
							_parent.appendChild(this);
						});
					}
				}
				return this;
			},
			before: function (oObj) {
				var _current = this.elements[0];
				if (typeof oObj === 'string') {
					oObj = __fGet(oObj)[0];
				}
				if (oObj.ownerDocument) {
					_current.parentNode.insertBefore(oObj, _current);
				}
				else {
					if (oObj.ver) {
						__fAllElementsOpa(oObj.elements, function () {
							_current.parentNode.insertBefore(this, _current);
						});
					}
				}
				return this;
			},
			after: function (oObj) {
				var _current = this.elements[0];
				if (typeof oObj === 'string') {
					oObj = __fGet(oObj)[0];
				}
				if (oObj.ownerDocument) {
					_current.parentNode.insertBefore(oObj, _current.nextSibling);
				}
				else {
					if (oObj.ver) {
						__fAllElementsOpa(oObj.elements, function () {
							_current.parentNode.insertBefore(this, _current.nextSibling);
						});
					}
				}
				return this;
			},
			clone: function (bDeep) {
				var _obj = __fExtend({}, this);
				_obj.elements = [this.elements[0].cloneNode(true)];
				return _obj;
			},
			html: function (sInner) {
				if (sInner) {
					__fAllElementsOpa(this.elements, function () {
						this.innerHTML = sInner;
					});
				}
				else {
					return this.elements[0].innerHTML;
				}
				return this;
			},
			outerHtml: function () {
				return this.elements[0].outerHTML;
			},
			val: function (sValue) {
				if (sValue) {
					this.elements[0].value = sValue;
				}
				return this.elements[0].value;
			},
			e: function (nIndex) {
				return __fExtend(this, {elements: [this.elements[nIndex]]});
			},
			first: function () {
				return this.e(0);
			},
			last: function () {
				return this.e(this.elements.length);
			},
			prev: function () {
				var oObj = this.elements[0].previousSibling;
				if (oObj) {
					if (!oObj.tagName || oObj.tagName == '!') {
						return __fExtend(this, {elements: [oObj]}).prev();
					}
					return __fExtend(this, {elements: [oObj]});
				}
			},
			next: function () {
				var oObj = this.elements[0].nextSibling;
				if (oObj) {
					if (!oObj.tagName || oObj.tagName == '!') {
						return __fExtend(this, {elements: [oObj]}).next();
					}
					return __fExtend(this, {elements: [oObj]});
				}
			},
			css: function (sProp) {
				var oObj = this.elements[0];
				var AttValue = oObj.currentStyle ? oObj.currentStyle[sProp] : document.defaultView.getComputedStyle(oObj, null)[sProp];
				return isNaN(parseInt(AttValue, 10)) ? AttValue.toLowerCase() : parseInt(AttValue, 10);
			},
			width: function () {
				return this.elements[0].offsetWidth;
			},
			height: function () {
				return this.elements[0].offsetHeight;
			},
			innerWidth: function () {
				var oObj = this.elements[0];
				var nResult = oObj.offsetWidth;
				if (!isNaN(parseInt(this.css('paddingLeft'), 10))) {
					nResult -= this.css('paddingLeft');
				}
				if (!isNaN(parseInt(this.css('paddingRight'), 10))) {
					nResult -= this.css('paddingRight');
				}
				if (!isNaN(parseInt(this.css('borderLeftWidth'), 10))) {
					nResult -= this.css('borderLeftWidth');
				}
				if (!isNaN(parseInt(this.css('borderRightWidth'), 10))) {
					nResult -= this.css('borderRightWidth');
				}
				return nResult;
			},
			innerHeight: function () {
				var oObj = this.elements[0];
				var nResult = oObj.offsetHeight;
				if (!isNaN(parseInt(this.css('paddingTop'), 10))) {
					nResult -= this.css('paddingTop');
				}
				if (!isNaN(parseInt(this.css('paddingBottom'), 10))) {
					nResult -= this.css('paddingBottom');
				}
				if (!isNaN(parseInt(this.css('borderTopWidth'), 10))) {
					nResult -= this.css('borderTopWidth');
				}
				if (!isNaN(parseInt(this.css('borderBottomWidth'), 10))) {
					nResult -= this.css('borderBottomWidth');
				}
				return nResult;
			},
			alpha: function (nAlpha) {
				__fAllElementsOpa(this.elements, function () {
					//	判断是否为IE9-
					if (!-[1,]) {
						this.style.filter = 'alpha(opacity=' + nAlpha + ')';
					}
					else {
						this.style.opacity = nAlpha / 100;
					}
					if (nAlpha === 0) {
						this.style.display = 'none';
					}
					else {
						this.style.display = '';
					}
				});
				return this;
			},
			/* 淡入淡出 */
			fade: function (nValue, fFn) {
				var _this = this;
				nValue = nValue || 0;

				__fAllElementsOpa(this.elements, function () {
					var $This = __fExtend(_this, {elements: [this]});
					var nStart = $This.css('opacity') * 100;
					nStart = isNaN(nStart) ? 100 : nStart;
					(function () {
						var __call = arguments.callee;

						function __fSet() {
							if (nStart > nValue) {
								nStart -= 1;
							}
							else {
								nStart += 1;
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
				});
			},
			show: function () {
				__fAllElementsOpa(this.elements, function () {
					this.style.display = 'block';
				});
			},
			hide: function () {
				__fAllElementsOpa(this.elements, function () {
					this.style.display = 'none';
				});
			}
		};

		return __fExtend(oSelector, JC.$.prototype);
	}
};