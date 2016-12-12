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