/*!*
 * jClass - A small JavaScript library
 * @Version: 1.0.10
 * @Author: AngusYoung
 */
/*
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description jClass源文件
 * @Since 13/2/28
 */
(function () {
	/* 类继承 */
	function __extend__(oObject) {
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
	}

	/* 数据原型 */
	function __proto__() {
		this.init.apply(this, arguments[0]);
	}

	__proto__.prototype = [];
	__proto__.prototype.init = function (sExpression, oScopeDOM) {
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
						if (!__fInArray(oObj.getAttribute('class') ? oObj.getAttribute('class').split(' ') : [], sCondition)) {
							return false;
						}
						break;
					case '@': // name
						if (oObj.getAttribute('name') !== sCondition) {
							return false;
						}
						break;
					case '[': // property
						var aProp = sCondition.substring(0, sCondition.length - 1).replace(/['"]/g, '').split('=');
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
			oScope['version'] && (oScope = oScope[0]);
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
						oObj = oScope.getElementsByClassName(sVal);
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
						sVal = aProp[1].replace(/^(['|"]*)([^'"]*)\1$/, '$2');
						console.info(sVal)
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

		/**
		 * 选择器获取对萌
		 * @param sExpr 选择器表达式
		 * @returns {*}
		 * @private
		 */
		function __fGet(sExpr) {
			if (!sExpr) {
				return [];
			}
			if (typeof sExpr === 'object') {
				if (sExpr.ownerDocument) {
					return [sExpr];
				}
				else if (sExpr.length && sExpr[0].ownerDocument) {
					return Array.prototype.slice.call(sExpr, 0);
				}
				else {
					return [];
				}
			}
			if (sExpr.substr(0, 1) === '<') {
				return __fSingle(sExpr);
			}
			var aResult = [];
			if (typeof document.querySelectorAll === 'function' && !/@/g.test(sExpr)) {
				var oScope = oScopeDOM || document;
				oScope['version'] && (oScope = oScope[0]);
				aResult = Array.prototype.slice.call(oScope.querySelectorAll(sExpr), 0);
			}
			else {
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
			}
			return aResult;
		}

		var _jClass = jClass;
		console.log('selector:', sExpression);
		console.time('use time');
		var aElem = __fGet(sExpression);
		console.timeEnd('use time');
		var oJC = {
			// 选择器内置版本号
			version    : '2.0',
			each       : function (fCallBack) {
				if (typeof fCallBack === 'function') {
					__fAllElementsOpa(this.elements, function (index) {
						fCallBack.call(this, index);
					});
				}
				return this;
			},
			remove     : function () {
				__fAllElementsOpa(this.elements, function () {
					this.parentNode.removeChild(this);
				});
			},
			removeAttr : function (sAttr) {
				__fAllElementsOpa(this.elements, function () {
					this.removeAttribute(sAttr);
				});
				return this;
			},
			attr       : function (sAttr, sAttrVal) {
				if (sAttrVal) {
					__fAllElementsOpa(this.elements, function () {
						this.setAttribute(sAttr, sAttrVal);
					});
				}
				else {
					return this.elements[0].getAttribute(sAttr);
				}
				return this;
			},
			data       : function (sName, sValue) {
				if (sValue) {
					__fAllElementsOpa(this.elements, function () {
						this.dataset[sName] = sValue;
					});
				}
				else {
					return this.elements[0].dataset[sName];
				}
				return this;
			},
			addClass   : function (sClassName) {
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
			hasClass   : function (sClassName) {
				var oObj = this.elements[0];
				var sClass = ' ' + oObj.getAttribute('class') + ' ';
				return !!~sClass.indexOf(' ' + sClassName + ' ');
			},
			append     : function (oObj) {
				var _parent = this.elements[0];
				if (typeof oObj === 'string') {
					oObj = __fGet(oObj)[0];
				}
				if (oObj.ownerDocument) {
					_parent.appendChild(oObj);
				}
				else {
					if (oObj.version) {
						__fAllElementsOpa(oObj.elements, function () {
							_parent.appendChild(this);
						});
					}
				}
				return this;
			},
			appendTo   : function (oObj) {
				if (typeof oObj === 'string') {
					oObj = __fGet(oObj)[0];
				}
				var _parent;
				if (oObj.ownerDocument) {
					_parent = oObj;
				}
				else {
					if (oObj.version) {
						_parent = oObj.elements[0];
					}
				}
				__fAllElementsOpa(this.elements, function () {
					_parent.appendChild(this);
				});
				return this;
			},
			before     : function (oObj) {
				var _current = this.elements[0];
				if (typeof oObj === 'string') {
					oObj = __fGet(oObj)[0];
				}
				if (oObj.ownerDocument) {
					_current.parentNode.insertBefore(oObj, _current);
				}
				else {
					if (oObj.version) {
						__fAllElementsOpa(oObj.elements, function () {
							_current.parentNode.insertBefore(this, _current);
						});
					}
				}
				return this;
			},
			beforeTo   : function (oObj) {
				if (typeof oObj === 'string') {
					oObj = __fGet(oObj)[0];
				}
				if (oObj.ownerDocument) {
					__fAllElementsOpa(this.elements, function () {
						oObj.parentNode.insertBefore(this, oObj);
					});
				}
				else {
					if (oObj.version) {
						__fAllElementsOpa(this.elements, function () {
							var _to = oObj.elements[0];
							_to.parentNode.insertBefore(this, _to);
						});
					}
				}
			},
			after      : function (oObj) {
				var _current = this.elements[0];
				if (typeof oObj === 'string') {
					oObj = __fGet(oObj)[0];
				}
				if (oObj.ownerDocument) {
					_current.parentNode.insertBefore(oObj, _current.nextSibling);
				}
				else {
					if (oObj.version) {
						__fAllElementsOpa(oObj.elements, function () {
							_current.parentNode.insertBefore(this, _current.nextSibling);
						});
					}
				}
				return this;
			},
			afterTo    : function (oObj) {
				if (typeof oObj === 'string') {
					oObj = __fGet(oObj)[0];
				}
				if (oObj.ownerDocument) {
					__fAllElementsOpa(this.elements, function () {
						oObj.parentNode.insertBefore(this, oObj.nextSibling);
					});
				}
				else {
					if (oObj.version) {
						__fAllElementsOpa(this.elements, function () {
							var _to = oObj.elements[0];
							_to.parentNode.insertBefore(this, _to.nextSibling);
						});
					}
				}
			},
			clone      : function (bDeep) {
				var _obj = __extend__({}, this);
				_obj.elements = [this.elements[0].cloneNode(true)];
				return _obj;
			},
			html       : function (sInner) {
				if (sInner) {
					__fAllElementsOpa(this.elements, function () {
						this['innerHTML'] = sInner;
					});
					return this;
				}
				else {
					return this.elements[0].innerHTML;
				}
			},
			outerHtml  : function () {
				return this.elements[0].outerHTML;
			},
			text       : function (sText) {
				if (sText) {
					__fAllElementsOpa(this.elements, function () {
						this['innerHTML'] = sText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
					});
					return this;
				}
				else {
					// /( +)?<.+?>|\r|\n/g
					return this.elements[0].innerText;
				}
			},
			val        : function (sValue) {
				if (sValue) {
					this.elements[0].value = sValue;
					return this;
				}
				return this.elements[0].value;
			},
			eq         : function (nIndex) {
				return _jClass(this.elements[nIndex]);
			},
			first      : function () {
				return this.eq(0);
			},
			last       : function () {
				return this.eq(this.elements.length - 1);
			},
			prev       : function () {
				var oObj = this.elements[0].previousSibling;
				if (oObj) {
					if (!oObj.tagName || oObj.tagName == '!') {
						return _jClass(oObj).prev();
					}
					return _jClass(oObj);
				}
			},
			next       : function () {
				var oObj = this.elements[0].nextSibling;
				if (oObj) {
					if (!oObj.tagName || oObj.tagName == '!') {
						return _jClass(oObj).next();
					}
					return _jClass(oObj);
				}
			},
			// children: function (sSelector) {
			// 	var oObj = this.elements[0];
			// 	return _jClass(sSelector, oObj);
			// },
			find       : function (sSelector) {
				var oObj = this.elements[0];
				return _jClass(sSelector, oObj);
			},
			css        : function (sProp, sValue) {
				var oObj = this.elements[0];
				if (typeof sProp === 'string') {
					if (sValue) {
						oObj.style[sProp] = sValue;
						return this;
					}
					else {
						var AttValue = oObj.currentStyle ? oObj.currentStyle[sProp] : document.defaultView.getComputedStyle(oObj, null)[sProp];
						return isNaN(parseFloat(AttValue)) ? AttValue.toLowerCase() : parseFloat(AttValue);
					}
				}
				else if (typeof sProp === 'object') {
					var sCssText = oObj.style.cssText;
					for (var v in sProp) {
						if (sProp.hasOwnProperty(v)) {
							sCssText += ';' + v + ':' + sProp[v];
						}
					}
					oObj.style.cssText = sCssText;
					return this;
				}
			},
			width      : function () {
				return this.elements[0].offsetWidth;
			},
			height     : function () {
				return this.elements[0].offsetHeight;
			},
			innerWidth : function () {
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
			alpha      : function (nAlpha) {
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
			show       : function () {
				__fAllElementsOpa(this.elements, function () {
					this.style.display = 'block';
				});
				return this;
			},
			hide       : function () {
				__fAllElementsOpa(this.elements, function () {
					this.style.display = 'none';
				});
				return this;
			}
		};
		// 填充数据
		this.merge(aElem);
		// 添加数据对象的内置方法
		__proto__.prototype = __extend__(__proto__.prototype, oJC);
	};
	/* 将选择器结果填充至数据对象,数据对象是以原生数组对象为原型基础 */
	__proto__.prototype.merge = function (aEl) {
		for (var i = 0; i < aEl.length; i++) {
			this.push(aEl[i]);
		}
		this.elements = aEl;
	};

	/* 类原型 */
	function __class__() {
		var _this = this;
		return function () {
			var aArgs = Array.prototype.slice.call(arguments, 0);
			if (_this.plugIn.apply(_this, aArgs)) {
				return new __proto__(aArgs);
			}
		};
	}

	window.jClass = new __class__();
	// 输出数据对象类供扩展
	jClass.fx = __proto__.prototype;
	// 输出类原型供扩展
	jClass.fn = __class__.prototype;
	// 将继承方法写入类
	jClass.fn.extend = __extend__;
	// 扩展插件用原型方法
	jClass.fn.plugIn = function () {
		return true;
	};
})();

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

/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description ajax方法
 * @Since 16/3/1
 */

(function ($) {
	if (!$) {
		return;
	}
	$ = $.fn.extend($, {
		ajax   : function (jConfig) {
			// Normal config
			jConfig = $.fn.extend({
				method    : 'GET',
				dataType  : 'TEXT',
				charset   : 'utf-8',
				cache     : true,
				async     : true,
				retryCount: 3,
				success   : function () {
					console.log('Not callback success(), but AJAX request is successfully!');
				},
				error     : function () {
					console.log('Request is Failed.');
				}
			}, this.globalAjax, jConfig);
			// 是否全部都有此方法，还是只在error发生时才有
			jConfig.retry = function () {
				if (jConfig['retryCount'] <= 0) {
					return false;
				}
				jConfig['retryCount']--;
				__fRun();
			};
			if (!jConfig['url'] || typeof jConfig['url'] !== 'string') {
				return null;
			}

			function __fString(sKey, xData) {
				var sStringify;
				switch (typeof xData) {
					case 'string':
						sStringify = (sKey ? '"' + sKey + '" : "' : '') + xData + '"';
						break;
					case 'number':
						sStringify = (sKey ? '"' + sKey + '" : ' : '') + xData;
						break;
					case 'boolean':
						sStringify = (sKey ? '"' + sKey + '" : ' : '') + xData.toString();
						break;
					case 'object':
						if (xData instanceof Array) {
							var aDataArray = [];
							for (var i = 0; i < xData.length; i++) {
								aDataArray.push(__fString(null, xData[i]));
							}
							sStringify = (sKey ? '"' + sKey + '" : ' : '') + '[' + aDataArray.join(',') + ']';
						}
						else if (xData === null) {
							sStringify = (sKey ? '"' + sKey + '" : ' : '') + 'null';
						}
						else {
							sStringify = (sKey ? '"' + sKey + '" : ' : '') + __fJsonStringify(xData);
						}
						break;
				}
				return sStringify;
			}

			function __fJsonStringify(jData) {
				var aMap = [];
				for (var k in jData) {
					if (jData.hasOwnProperty(k)) {
						var oItem = jData[k];
						var sValue = __fString(k, oItem);
						sValue && aMap.push(sValue);
					}
				}
				return '{' + aMap.join(',') + '}';
			}

			function __fInitXHR() {
				var xmlHttp;
				if (window.XMLHttpRequest) {
					xmlHttp = new window.XMLHttpRequest();
				}
				else if (window.ActiveXObject) {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				return xmlHttp;
			}

			var xhr = __fInitXHR();

			jConfig['method'] = jConfig['method'].toUpperCase();
			jConfig['dataType'] = jConfig['dataType'].toUpperCase();

			var sSendData = null;
			if (typeof jConfig['data'] === 'object') {
				if (jConfig['method'] === 'POST' && jConfig['dataType'] === 'JSON') {
					if (JSON) {
						sSendData = JSON.stringify(jConfig['data']);
					}
					else {
						sSendData = __fJsonStringify(jConfig['data']);
					}
				}
				else {
					var aPara = [];
					for (var v in jConfig['data']) {
						if (jConfig['data'].hasOwnProperty(v)) {
							if (jConfig['data'][v] instanceof Array) {
								aPara.push(v + '=' + jConfig['data'][v].join('&' + v + '='));
							}
							else {
								aPara.push(v + '=' + jConfig['data'][v]);
							}
						}
					}
					sSendData = aPara.join('&');
				}
			}
			else if (typeof jConfig['data'] === 'string') {
				sSendData = jConfig['data'];
			}

			var aQuery = [];
			if (jConfig['method'] === 'GET' && sSendData) {
				aQuery.push(sSendData);
			}
			if (!jConfig['cache'] || jConfig['method'] === 'HEAD') {
				aQuery.push('_=' + Math.random());
			}
			if (aQuery.length) {
				jConfig['url'] += (!!~jConfig['url'].indexOf('?') ? '&' : '?') + aQuery.join('&');
			}

			function __fRun() {
				xhr.open(jConfig['method'], jConfig['url'], jConfig['async']);
				if (jConfig['method'] === 'POST') {
					if (jConfig['dataType'] === 'JSON') {
						xhr.setRequestHeader('Content-type', 'application/json;charset=' + jConfig['charset']);
					}
					else {
						xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + jConfig['charset']);
					}
				}
				xhr.onreadystatechange = function () {
					if (this.readyState === 4) {
						var sStatus = this.status;
						switch (true) {
							case sStatus == 0:
							case /^[4|5]\d{2}$/.test(sStatus):
								jConfig['error'].call(jConfig, {
									readyState  : this.readyState,
									status      : this.status,
									statusText  : this.statusText,
									response    : this.response,
									responseURL : this.responseURL,
									responseType: this.responseType
								});
								break;
							default:
								var xResult;
								// GET POST HEAD PUT DELETE CONNECT OPTIONS TRACE
								switch (jConfig['method']) {
									case 'HEAD':
										switch (jConfig['dataType']) {
											case 'JSON':
												var aAllResHeader = this.getAllResponseHeaders().split('\r\n');
												var jAllResHeader = {};
												for (var i = 0, l = aAllResHeader.length; i < l; i++) {
													var sResHeader = aAllResHeader[i];
													var nIndex = sResHeader.indexOf(': ');
													if (nIndex > -1) {
														jAllResHeader[sResHeader.substr(0, nIndex)] = sResHeader.substr(nIndex + 2)
													}
												}
												xResult = jAllResHeader;
												break;
											case 'FUNCTION':
												// 自定义的数据类型，只有使用 HEAD 方式时才有
												var _this = this;
												xResult = function (sKey) {
													//     _this.getResponseHeader("Last-Modified");
													return _this.getResponseHeader(sKey);
												};
												break;
											default :
												xResult = this.getAllResponseHeaders();
										}
										break;
									default:
										// JSON XML TEXT
										switch (jConfig['dataType']) {
											case 'JSON':
												try {
													if (JSON) {
														xResult = JSON.parse(this.responseText);
													}
													else {
														xResult = eval('(' + this.responseText + ')');
													}
												}
												catch (e) {
													xResult = {error: true, errorText: 'Error Format', source: this.responseText};
												}
												break;
											case 'XML':
												xResult = this.responseXML;
												break;
											default :
												xResult = this.responseText;
										}
								}
								jConfig['success'].call(jConfig, xResult, this);
						}
					}
				};
				xhr.send(sSendData);
			}

			__fRun();
			return xhr;
		},
		ajaxSet: function (jConfig) {
			this.globalAjax = jConfig;
		}
	});
})(jClass);
/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description jClass方法类库
 * @Dependent jClass.js
 * @Since 16/2/19
 */

(function ($) {
	if (!$) {
		return;
	}
	var _extend = {
		/* 页面加载完成 */
		load      : function (fFn) {
			if (typeof(fFn) !== 'function') {
				fFn = Function(fFn);
			}
			if (this.isWho('ie')) {
				window.attachEvent('onload', fFn);
			}
			else {
				window.addEventListener('load', fFn, false);
			}
		},
		/* DOM加载完成 */
		domReady  : function (fFn) {
			var _this = this;

			function isDOMReady() {
				if (_this.domReady.done) {
					return false;
				}
				if (document && document.getElementsByTagName && document.getElementById && document.body) {
					clearInterval(_this.domReady.timer);
					delete _this.domReady.timer;
					for (var i = 0; i < _this.domReady.ready.length; i++) {
						_this.domReady.ready[i]();
					}
					delete _this.domReady.ready;
					_this.domReady.done = true;
				}
			}

			if (_this.domReady.done) {
				return fFn();
			}
			if (_this.domReady.timer) {
				_this.domReady.ready.push(fFn);
			}
			else {
				_this.load(isDOMReady);
				_this.domReady.ready = [fFn];
				_this.domReady.timer = setInterval(isDOMReady, 13);
			}

		},
		/* 绑定事件 */
		addEvent  : function (e, t, f, c) {
			if (e.attachEvent) {
				e.attachEvent('on' + t, function () {
					f.call(e, window.event);
				});
			}
			else if (e.addEventListener) {
				e.addEventListener(t, f, c);
			}
			else {
				e['on' + t] = f;
			}
		},
		/* 删除事件 */
		delEvent  : function (e, t, f) {
			if (e.detachEvent) {
				e.detachEvent('on' + t, f);
			}
			else if (e.removeEventListener) {
				e.removeEventListener(t, f, false);
			}
			else {
				e['on' + t] = null;
			}
		},
		/* 识别浏览器 */
		isWho     : function (sKey) {
			var sUA = window.navigator.userAgent.toLowerCase();
			switch (sKey.toLowerCase()) {
				case 'ie':
					var _n = sUA.indexOf('msie');
					if (_n > -1) {
						return parseInt(sUA.substr(_n + 5, 1), 10);
					}
					else {
						return 0;
					}
					break;
				case 'ie6':
					return sUA.indexOf('msie 6.0') > -1;
					break;
				case 'ie7':
					return sUA.indexOf('msie 7.0') > -1;
					break;
				case 'ie8':
					return sUA.indexOf('msie 8.0') > -1;
					break;
				case 'ie9':
					return sUA.indexOf('msie 9.0') > -1;
					break;
				case 'ie10':
					return sUA.indexOf('msie 10.0') > -1;
					break;
				case 'firefox':
					return sUA.indexOf('firefox') > -1;
					break;
				case 'opera':
					return sUA.indexOf('opera') > -1;
					break;
				case 'chrome':
				case 'safari':
					return sUA.indexOf('webkit') > -1;
					break;
				case 'mobile':
					return sUA.indexOf('mobile') > -1;
					break;
				case 'weixin':
					return sUA.indexOf('micromessenger') > -1;
					break;
				case '360':
					var fuck360;
					try {
						fuck360 = external.twGetVersion(external.twGetSecurityID(window)).split('.');
					}
					catch (e) {
					}
					return fuck360 ? true : false;
					break;
				default:
					return sUA;
			}
		},
		/* 十六进制数转为RGB */
		colorToRgb: function (sColor) {
			if (sColor.substr(0, 1) == '#') {
				var n = sColor.length == 4 ? 1 : (sColor.length == 7 ? 2 : 0);
			}
			else {
				return sColor;
			}
			if (!n) {
				return sColor;
			}
			var a = [];
			for (var i = 1; i < sColor.length; i++) {
				var sHex = sColor.substr(i, n);
				a.push(parseInt((sHex.length == 2 ? sHex : sHex + sHex), 16));
			}
			return a.join(',');
		},
		/* RGB转为十六进制数 */
		colorToHex: function (sColor) {
			if (sColor.substr(0, 1) == '#') {
				return sColor.toLowerCase();
			}
			else {
				var sNewC = sColor.replace('rgb(', '').replace(')', '').replace(/\s/g, '');
				var aRGB = sNewC.split(',');
				var sResult = '#';
				for (var i = 0; i < aRGB.length; i++) {
					sResult += parseInt(aRGB[i], 10).toString(16).length == 1 ? '0' + parseInt(aRGB[i], 10).toString(16) : parseInt(aRGB[i], 10).toString(16);
				}
				return sResult.toLowerCase();
			}
		},
		/* 阻止冒泡 */
		stopBubble: function () {
			var e = arguments[arguments.length - 1];
			var evt = e || window.event;
			if (evt.stopPropagation) {
				evt.stopPropagation();
			}
			else {
				evt.cancelBubble = true;
			}
		},
		/* 移动下拉列表项到目标下拉列表 */
		listMove  : function (oSource, oTarget) {
			if (!!~oSource.selectedIndex) {
				for (var i = 0; i < oSource.options.length; i++) {
					if (oSource.options[i].selected) {
						oTarget.options.add(new Option(oSource.options[i].text, oSource.options[i].value));
						oSource.remove(oSource.options[i].index);
						i--;
					}
				}
			}
			//while (oTl.options.length > 0) {
			//	oSl.options.add(new Option(oTl.options[0].text, oTl.options[0].value));
			//	oTl.remove(oTl.options[0].index);
			//}
		},
		/* 加载HTML文本内的某元素的HTML */
		getHTML   : function (sHtml, sSelector) {
			if (!sHtml) {
				return '';
			}
			if (!sSelector) {
				return sHtml;
			}
			var oDiv = document.createElement('div');
			oDiv.innerHTML = sHtml;
			var $Sel = jClass(sSelector, oDiv);
			if ($Sel.length) {
				return $Sel.html();
			}
			else {
				return '';
			}
		},
		/* cookie操作 */
		cookie    : {
			get: function (sCookie) {
				if (sCookie) {
					var aCookie = document.cookie.match(new RegExp('(^| )' + sCookie + '=([^;]*)(;|$)'));
					if (aCookie) {
						return decodeURI(aCookie[2]);
					}
				}
			},
			set: function (sCookie, sValue, nDay) {
				if (sValue) {
					var dExpired = new Date(new Date() + 86400 * nDay);
					document.cookie = sCookie + '=' + encodeURI(sValue) + (typeof nDay === 'number' ? (';expires=' + dExpired.toUTCString()) : '') + ';path=/';
				}

			},
			del: function (sCookie) {
				var dDate = new Date(new Date().getTime() - 1);
				var sCoo = this.get(sCookie);
				if (sCoo) {
					document.cookie = sCookie + '=' + sCoo + ';expires=' + dDate.toUTCString() + ';path=/';
				}
			}
		}
	};
	$ = $.fn.extend($, _extend);
	//	增强选择器功能 $(function) = $.domReady()
	$.fn.plugIn = function (xArgs) {
		if (typeof xArgs === 'function') {
			$.domReady(xArgs);
			return false;
		}
		return true;
	};
})(jClass);
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
		if (typeof oObj.getBoundingClientRect !== 'function') {
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