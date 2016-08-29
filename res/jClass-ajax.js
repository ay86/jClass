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
		ajax: function (jConfig) {
			// Normal config
			jConfig = $.fn.extend({
				type: 'GET',
				dataType: 'TEXT',
				charset: 'utf-8',
				cache: true,
				async: true,
				retryCount: 3,
				success: function () {
					console.log('Not callback success(), but AJAX request is successfully!');
				},
				error: function () {
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
			var sSendData = null;
			if (typeof jConfig['data'] === 'object') {
				var aPara = [];
				for (var v in jConfig['data']) {
					if (jConfig['data'][v] instanceof Array) {
						aPara.push(v + '=' + jConfig['data'][v].join('&' + v + '='));
					}
					else {
						aPara.push(v + '=' + jConfig['data'][v]);
					}
				}
				sSendData = aPara.join('&');
			}
			else if (typeof jConfig['data'] === 'string') {
				sSendData = jConfig['data'];
			}

			jConfig['type'] = jConfig['type'].toUpperCase();
			jConfig['dataType'] = jConfig['dataType'].toUpperCase();

			function __fRun() {
				var aQuery = [];
				if (jConfig['type'] === 'GET' && sSendData) {
					aQuery.push(sSendData);
				}
				if (!jConfig['cache'] || jConfig['type'] === 'HEAD') {
					aQuery.push('_=' + Math.random());
				}
				if (aQuery.length) {
					jConfig['url'] += (!!~jConfig['url'].indexOf('?') ? '&' : '?') + aQuery.join('&');
				}
				xhr.open(jConfig['type'], jConfig['url'], jConfig['async']);
				if (jConfig['type'] === 'POST') {
					xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + jConfig['charset']);
				}
				xhr.onreadystatechange = function () {
					if (this.readyState === 4) {
						switch (this.status) {
							case 200:
								var xResult;
								// GET POST HEAD PUT DELETE CONNECT OPTIONS TRACE
								switch (jConfig['type']) {
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
													// _this.getResponseHeader("Last-Modified");
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
												xResult = eval('(' + this.responseText + ')');
												break;
											case 'XML':
												xResult = this.responseXML;
												break;
											default :
												xResult = this.responseText;
										}
								}
								jConfig['success'].call(jConfig, xResult, this);
								break;
							default :
								jConfig['error'].call(jConfig, this.status);
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