/**
 * jClass
 * @Version: 1.0.4
 * @Author: AngusYoung
 */
!function(){function e(e){function t(e,t){for(var n in t)e[n]=t[n];return e}for(var n=1;n<arguments.length;n++)"object"==typeof arguments[n]&&(e=t(e,arguments[n]));return e}function t(){this.init.apply(this,arguments[0])}function n(){return function(){return new t(Array.prototype.slice.call(arguments,0))}}t.prototype=[],t.prototype.init=function(n,i){function r(e,t){for(var n=0;n<e.length;n++)if(e[n]===t)return!0;return!1}function s(e,t){return t===document.documentElement?!1:0===e.length?!0:a(t.parentNode,e.slice(-1))?arguments.callee(e.slice(0,-1),t.parentNode):arguments.callee(e,t.parentNode)}function o(e){return e=e.replace(/\./g," .").replace(/\[/g," ["),e.replace(/^ /,"").split(" ")}function a(e,t){for(var n=0;n<t.length;n++){var i=t[n].substr(1);switch(t[n].substr(0,1)){case"#":if(e.getAttribute("id")!==i)return!1;break;case".":if(!r(e.getAttribute("class")?e.getAttribute("class").split(" "):[],i))return!1;break;case"@":if(e.getAttribute("name")!==i)return!1;break;case"[":var s=i.substring(0,i.length-1).replace(/['"]/g,"").split("=");if(2===s.length){if(e.getAttribute(s[0])!==s[1])return!1}else if(!e.getAttribute(s[0]))return!1;break;default:if(e.tagName.toUpperCase()!==t[n].toUpperCase())return!1}}return!0}function u(e){var t=[],n=e.substr(1),s=i||document;s.version&&(s=s[0]);var o,a;switch(e.substr(0,1)){case"<":var u=document.createElement("div");u.innerHTML=e,o=u.children[0],o&&t.push(o),u=null;break;case"#":o=document.getElementById(n),o&&t.push(o);break;case".":if(document.getElementsByClassName)o=document.getElementsByClassName(n),o&&(t=Array.prototype.slice.call(o,0));else for(o=s.getElementsByTagName("*"),a=0;a<o.length;a++)r(o[a].getAttribute("class").split(" "),n)&&t.push(o[a]);break;case"@":o=document.getElementsByName(n),o&&(t=Array.prototype.slice.call(o,0));break;case"[":n=e.substring(1,e.length-1),o=s.getElementsByTagName("*");var c,l=n.split("=");for(2===l.length&&(c=l[0],n=l[1].replace(/^(['|"]*)([^'"]*)\1$/,"$2"),console.info(n)),a=0;a<o.length;a++)c?o[a].getAttribute(c)===n&&t.push(o[a]):o[a].getAttribute(n)&&t.push(o[a]);break;default:o=s.getElementsByTagName(e),o&&(t=Array.prototype.slice.call(o,0))}return t}function c(e,t){for(var n=0;n<e.length;n++)t.call(e[n],n)}function l(e){if(!e)return[];if("object"==typeof e)return e.ownerDocument?[e]:e.length&&e[0].ownerDocument?Array.prototype.slice.call(e,0):[];if("<"===e.substr(0,1))return u(e);var t=[],n=e.split(" "),i=n.length-1,r=n[i];if(n.length>1)for(var c=n.slice(0,-1),f=l(r),h=0;h<f.length;h++){var d=f[h],p=s(c,d);p&&t.push(d)}else{var g=o(r),m=u(g[0]);if(g.length>1)for(var v=0;v<m.length;v++)a(m[v],g.slice(1))&&t.push(m[v]);else t=m}return t}var f=jClass,h=l(n),d={version:"2.0",each:function(e){return"function"==typeof e&&c(this.elements,function(t){e.call(this,t)}),this},remove:function(){c(this.elements,function(){this.parentNode.removeChild(this)})},removeAttr:function(e){return c(this.elements,function(){this.removeAttribute(e)}),this},attr:function(e,t){return t?(c(this.elements,function(){this.setAttribute(e,t)}),this):this.elements[0].getAttribute(e)},data:function(e,t){return t?(c(this.elements,function(){this.dataset[e]=t}),this):this.elements[0].dataset[e]},addClass:function(e){return e&&c(this.elements,function(){var t=this.getAttribute("class"),n=t?t.split(" "):[];r(n,e)||(n.push(e),this.setAttribute("class",n.join(" ")))}),this},removeClass:function(e){return e&&c(this.elements,function(){var t=this.getAttribute("class"),n=(" "+t+" ").replace(" "+e+" "," ");this.setAttribute("class",n.replace(/(^ | $)/,""))}),this},append:function(e){var t=this.elements[0];return"string"==typeof e&&(e=l(e)[0]),e.ownerDocument?t.appendChild(e):e.version&&c(e.elements,function(){t.appendChild(this)}),this},before:function(e){var t=this.elements[0];return"string"==typeof e&&(e=l(e)[0]),e.ownerDocument?t.parentNode.insertBefore(e,t):e.version&&c(e.elements,function(){t.parentNode.insertBefore(this,t)}),this},after:function(e){var t=this.elements[0];return"string"==typeof e&&(e=l(e)[0]),e.ownerDocument?t.parentNode.insertBefore(e,t.nextSibling):e.ver&&c(e.elements,function(){t.parentNode.insertBefore(this,t.nextSibling)}),this},clone:function(t){var n=e({},this);return n.elements=[this.elements[0].cloneNode(!0)],n},html:function(e){return e?(c(this.elements,function(){this.innerHTML=e}),this):this.elements[0].innerHTML},outerHtml:function(){return this.elements[0].outerHTML},val:function(e){return e?(this.elements[0].value=e,this):this.elements[0].value},eq:function(e){return f(this.elements[e])},first:function(){return this.eq(0)},last:function(){return this.eq(this.elements.length-1)},prev:function(){var e=this.elements[0].previousSibling;return e?e.tagName&&"!"!=e.tagName?f(e):f(e).prev():void 0},next:function(){var e=this.elements[0].nextSibling;return e?e.tagName&&"!"!=e.tagName?f(e):f(e).next():void 0},css:function(e){var t=this.elements[0],n=t.currentStyle?t.currentStyle[e]:document.defaultView.getComputedStyle(t,null)[e];return isNaN(parseFloat(n))?n.toLowerCase():parseFloat(n)},width:function(){return this.elements[0].offsetWidth},height:function(){return this.elements[0].offsetHeight},innerWidth:function(){var e=this.elements[0],t=e.offsetWidth;return isNaN(parseInt(this.css("paddingLeft"),10))||(t-=this.css("paddingLeft")),isNaN(parseInt(this.css("paddingRight"),10))||(t-=this.css("paddingRight")),isNaN(parseInt(this.css("borderLeftWidth"),10))||(t-=this.css("borderLeftWidth")),isNaN(parseInt(this.css("borderRightWidth"),10))||(t-=this.css("borderRightWidth")),t},innerHeight:function(){var e=this.elements[0],t=e.offsetHeight;return isNaN(parseInt(this.css("paddingTop"),10))||(t-=this.css("paddingTop")),isNaN(parseInt(this.css("paddingBottom"),10))||(t-=this.css("paddingBottom")),isNaN(parseInt(this.css("borderTopWidth"),10))||(t-=this.css("borderTopWidth")),isNaN(parseInt(this.css("borderBottomWidth"),10))||(t-=this.css("borderBottomWidth")),t},alpha:function(e){return c(this.elements,function(){-[1]?this.style.opacity=e/100:this.style.filter="alpha(opacity="+e+")",0===e?this.style.display="none":this.style.display=""}),this},show:function(){return c(this.elements,function(){this.style.display="block"}),this},hide:function(){return c(this.elements,function(){this.style.display="none"}),this}};this.merge(h),t.prototype=e(t.prototype,d)},t.prototype.merge=function(e){for(var t=0;t<e.length;t++)this.push(e[t]);this.elements=e},window.jClass=new n,jClass.fx=t.prototype,jClass.fn=n.prototype,jClass.fn.extend=e}(),!function(){var e=jClass.util;e&&(e.badIE6=function(t,n){if(e.isWho("ie6")){var i=document.createElement("div");i.id="badIE6",i.style.cssText="padding:0 10px;background-color:#FFFFE1;border-bottom:#fff outset 2px;line-height:30px;color:#000;height:30px;",i.title="Double click to close this tips.",i.ondblclick=function(){this.parentNode.removeChild(this)},i.onmouseover=function(){this.style.backgroundColor="#316AC5",this.style.color="#fff"},i.onmouseout=function(){this.style.backgroundColor="#FFFFE1",this.style.color="#000"},i.innerHTML=n,t.parentNode.insertBefore(i,t)}})}(),!function($){$&&($=$.fn.extend($,{ajax:function(jConfig){function __fInitXHR(){var e;return window.XMLHttpRequest?e=new window.XMLHttpRequest:window.ActiveXObject&&(e=new ActiveXObject("Microsoft.XMLHTTP")),e}function __fRun(){var aQuery=[];switch("GET"===jConfig.type&&sSendData&&aQuery.push(sSendData),jConfig.cache&&"HEAD"!==jConfig.type||aQuery.push("_="+Math.random()),aQuery.length&&(jConfig.url+="?"+aQuery.join("&")),xhr.open(jConfig.type,jConfig.url,jConfig.async),jConfig.type){case"POST":xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset="+jConfig.charset)}xhr.onreadystatechange=function(){if(4===this.readyState)switch(this.status){case 200:var xResult;switch(jConfig.dataType){case"JSON":xResult=eval("("+this.responseText+")");break;case"XML":xResult=this.responseXML;break;default:xResult=this.responseText}jConfig.success.call(jConfig,xResult,this);break;default:jConfig.error.call(jConfig,this.status)}},xhr.send(sSendData)}if(jConfig=$.fn.extend({type:"GET",dataType:"TEXT",charset:"utf-8",cache:!0,async:!0,retryCount:3,success:function(){console.log("Not callback success(), but AJAX request is successfully!")},error:function(){console.log("Request is Failed.")}},this.globalAjax,jConfig),jConfig.retry=function(){return jConfig.retryCount<=0?!1:(jConfig.retryCount--,void __fRun())},!jConfig.url||"string"!=typeof jConfig.url)return null;var xhr=__fInitXHR(),sSendData=null;if("object"==typeof jConfig.data){var aPara=[];for(var v in jConfig.data)jConfig.data[v]instanceof Array?aPara.push(v+"="+jConfig.data[v].join("&"+v+"=")):aPara.push(v+"="+jConfig.data[v]);sSendData=aPara.join("&")}else"string"==typeof jConfig.data&&(sSendData=jConfig.data);return jConfig.type=jConfig.type.toUpperCase(),jConfig.dataType=jConfig.dataType.toUpperCase(),__fRun(),xhr},ajaxSet:function(e){this.globalAjax=e}}))}(jClass),!function(e){if(e){var t={load:function(e){"function"!=typeof e&&(e=Function(e)),this.isWho("ie")?window.attachEvent("onload",e):window.addEventListener("load",e,!1)},domReady:function(e){function t(){if(n.domReady.done)return!1;if(document&&document.getElementsByTagName&&document.getElementById&&document.body){clearInterval(n.domReady.timer),delete n.domReady.timer;for(var e=0;e<n.domReady.ready.length;e++)n.domReady.ready[e]();delete n.domReady.ready,n.domReady.done=!0}}var n=this;return n.domReady.done?e():void(n.domReady.timer?n.domReady.ready.push(e):(n.load(t),n.domReady.ready=[e],n.domReady.timer=setInterval(t,13)))},addEvent:function(e,t,n,i){e.attachEvent?e.attachEvent("on"+t,function(){n.call(e,window.event)}):e.addEventListener?e.addEventListener(t,n,i):e["on"+t]=n},delEvent:function(e,t,n){e.detachEvent?e.detachEvent("on"+t,n):e.removeEventListener?e.removeEventListener(t,n,!1):e["on"+t]=null},isWho:function(e){var t=window.navigator.userAgent.toLowerCase();switch(e.toLowerCase()){case"ie":var n=t.indexOf("msie");return n>-1?parseInt(t.substr(n+5,1),10):0;case"ie6":return t.indexOf("msie 6.0")>-1;case"ie7":return t.indexOf("msie 7.0")>-1;case"ie8":return t.indexOf("msie 8.0")>-1;case"ie9":return t.indexOf("msie 9.0")>-1;case"ie10":return t.indexOf("msie 10.0")>-1;case"firefox":return t.indexOf("firefox")>-1;case"opera":return t.indexOf("opera")>-1;case"chrome":case"safari":return t.indexOf("webkit")>-1;case"mobile":return t.indexOf("mobile")>-1;case"weixin":return t.indexOf("micromessenger")>-1;case"360":var i;try{i=external.twGetVersion(external.twGetSecurityID(window)).split(".")}catch(r){}return i?!0:!1;default:return t}},colorToRgb:function(e){if("#"!=e.substr(0,1))return e;var t=4==e.length?1:7==e.length?2:0;if(!t)return e;for(var n=[],i=1;i<e.length;i++){var r=e.substr(i,t);n.push(parseInt(2==r.length?r:r+r,16))}return n.join(",")},colorToHex:function(e){if("#"==e.substr(0,1))return e.toLowerCase();for(var t=e.replace("rgb(","").replace(")","").replace(/\s/g,""),n=t.split(","),i="#",r=0;r<n.length;r++)i+=1==parseInt(n[r],10).toString(16).length?"0"+parseInt(n[r],10).toString(16):parseInt(n[r],10).toString(16);return i.toLowerCase()},stopBubble:function(){var e=arguments[arguments.length-1],t=e||window.event;t.stopPropagation?t.stopPropagation():t.cancelBubble=!0},listMove:function(e,t){if(~e.selectedIndex)for(var n=0;n<e.options.length;n++)e.options[n].selected&&(t.options.add(new Option(e.options[n].text,e.options[n].value)),e.remove(e.options[n].index),n--)},getHTML:function(e,t){if(!e)return"";if(!t)return e;var n=document.createElement("div");n.innerHTML=e;var i=jClass(t,n);return i.length?i.html():""},cookie:{get:function(e){if(e){var t=document.cookie.match(new RegExp("(^| )"+e+"=([^;]*)(;|$)"));if(t)return decodeURI(t[2])}},set:function(e,t,n){if(t){var i=new Date(new Date+86400*n);document.cookie=e+"="+encodeURI(t)+("number"==typeof n?";expires="+i.toUTCString():"")+";path=/"}},del:function(e){var t=new Date((new Date).getTime()-1),n=this.get(e);n&&(document.cookie=e+"="+n+";expires="+t.toUTCString()+";path=/")}}};e=e.fn.extend(e,t)}}(jClass),!function(e){e&&(e.on=function(e,t,n){"function"==typeof t&&(n=t,t=null),this.each(function(){var i=this;jClass.addEvent(i,e,function(){var e,r=arguments[arguments.length-1]||window.event;if(t){for(var s=jClass(t,i),o=!1,a=0;a<s.length;a++)if(s[a]===r.target){o=!0;break}o&&(e=n.call(r.target,r))}else e=n.call(i,r);e="boolean"==typeof e?!e:!1,e&&(r.stopPropagation?r.stopPropagation():r.cancelBubble=!0)})})},e.fade=function(e,t){e=e||0;for(var n=0;n<this.length;n++)(function(){var n=jClass(this),i=100*n.css("opacity");i=isNaN(i)?100:i,function(){function r(){i>e?i-=1:i+=1,n.alpha(i),i===e?"function"==typeof t&&t.call(n.elements[0]):s()}var s=arguments.callee;"function"==typeof window.requestAnimationFrame?requestAnimationFrame(r):setTimeout(r,17)}()}).call(this.elements[n]);return this},e.shake=function(e,t,n){var i=arguments[arguments.length-1];2===arguments.length&&"function"==typeof i?(e=null,t=null,n=null):(e instanceof Array&&(n=t,t=e,e=null),"function"==typeof t?(t=null,n=null):"number"==typeof t&&(n=t,t=null),"function"==typeof n&&(n=null)),n=n||16,t=t||[[0,6],[6,0],[0,-6],[-6,0]],e=e||1,this.each(function(){var r=this,s=0,o=0;!function(){function a(){var e=t[o],n=r.offsetLeft,i=r.offsetTop;r.style.left=n+e[0]+"px",r.style.top=i+e[1]+"px",o++,o>=t.length&&(s++,o=0),u()}if(s>=e)return void("function"==typeof i&&i());var u=arguments.callee;"function"==typeof window.requestAnimationFrame&&17>n?requestAnimationFrame(a):setTimeout(a,n)}()})},e.animateShape=function(e,t,n,i){if(e&&"undefined"!=typeof t){"function"==typeof n&&(i=n,n=null);var r=function(){return e.indexOf(".")>-1?e.split("."):!1}();n=n||.3,this.each(function(){var s,o=this,a=jClass(this);s=r?a.css(r[1]):o[e];var u=parseInt(t,10);if(!isNaN(u)){var c=t.toString().replace(u.toString(),""),l=20,f=Math.abs(u-s)/(1e3*n/(l+3.4));!function(t){var n=arguments.callee;setTimeout(function(){function s(e){return t?(h=e+f,h>u&&(h=u)):(h=e-f,u>h&&(h=u)),h+c}var l,h=0;r?(l=a.css(r[1]),o[r[0]][r[1]]=s(l)):(l=o[e],o[e]=s(l)),h===u?"function"==typeof i&&i():n(t)},l)}(u>s)}})}},e.get=function(){var e=this.elements[0],t="undefined"!=typeof document.body.style.webkitTransition?document.body:document.documentElement,n=document.documentElement.getBoundingClientRect();return"function"==typeof e.getBoundingClientRect&&(e.getBoundingClientRect=function(){var e=this,t={top:0,bottom:0,left:0,right:0};return e.offsetParent&&(t=arguments.callee.call(e.offsetParent)),{top:e.offsetTop+t.top,bottom:e.offsetTop+e.offsetHeight+t.top,left:e.offsetLeft+t.left,right:e.offsetLeft+e.offsetWidth+t.left}},t={scrollTop:0,scrollLeft:0},n={left:0}),{top:function(){return e.getBoundingClientRect().top+t.scrollTop}(),bottom:function(){return e.getBoundingClientRect().bottom+t.scrollTop}(),left:function(){return e.getBoundingClientRect().left+t.scrollLeft-n.left}(),right:function(){return e.getBoundingClientRect().right+t.scrollLeft-n.left}()}},e.serialize=function(){var e,t=[];return this[0].elements?(e=jClass(this[0].elements),e.each(function(){this.disabled||"button"===this.tagName||"button"===this.type||("radio"===this.type||"checkbox"===this.type?this.checked&&t.push(encodeURIComponent(this.name)+"="+encodeURIComponent(this.value)):this.value&&t.push(encodeURIComponent(this.name)+"="+encodeURIComponent(this.value)))}),t.join("&")):void 0},e.checkBox=function(e){var t=jClass('input[type="checkbox"]',this);switch(e){case"all":t.each(function(){this.checked="checked"});break;case"other":t.each(function(){this.checked?this.checked=null:this.checked="checked"});break;case"not":t.each(function(){this.checked=null})}})}(jClass.fx);