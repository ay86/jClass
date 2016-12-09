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