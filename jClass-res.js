/*
jClass v1.3(111202)
Author: AngusYoung
*/
function _m_jClass_ay(){}
_m_jClass_ay.prototype={
	selector:function(c,o){
		var aSeler=c.split(' ');
		var oObj=o||document;
		for(var i=0;i<aSeler.length;i++){
			if(!oObj){
				break;
			}
			if(oObj instanceof Array){
				if(oObj.length==0){
					break;
				}
				else{
					oObj=oObj[0];
				}
			}
			var cTag=aSeler[i];
			switch(cTag.substr(0,1)){
				case '#':/*ID*/
					var cID=cTag.substr(1);
					oObj=typeof(cID)=='string'?document.getElementById(cID):null;
					break;
				case '.':/*className*/
					var cClass=cTag.substr(1);
					var aTmpClass=cClass.split('[');
					var aClass=[];
					var aElement=oObj.getElementsByTagName('*');
					for(var j=0;j<aElement.length;j++){
						if(aElement[j].className==aTmpClass[0]){
							aClass.push(aElement[j]);
						}
					}
					if(aTmpClass.length>1){
						oObj=aClass[aTmpClass[1].substring(0,aTmpClass[1].length-1)];
					}
					else{
						oObj=aClass;
					}
					break;
				case '@':/*name*/
					var cName=cTag.substr(1);
					var aTmpName=cName.split('[');
					var aName=[];
					if(typeof(cName)=='string'){
						var aElement=document.getElementsByName(aTmpName[0]);
						for(var j=0;j<aElement.length;j++){
							if(aElement[j].parentNode===oObj||oObj===document){
								aName.push(aElement[j]);
							}
						}
						if(aTmpName.length>1){
							oObj=aName[aTmpName[1].substring(0,aTmpName[1].length-1)];
						}
						else{
							oObj=aName;
						}
					}
					else{
						oObj=null;
					}
					break;
				default:/*tagName*/
					var aTmpTagName=cTag.split('[');
					var aTagName=[];
					var aElement=oObj.getElementsByTagName(aTmpTagName[0]);
					for(var j=0,l=aElement.length;j<l;j++){
						aTagName.push(aElement[j]);
					}
					if(aTmpTagName.length>1){
						oObj=aTagName[aTmpTagName[1].substring(0,aTmpTagName[1].length-1)];
					}
					else{
						oObj=aTagName;
					}
			}
		}
		return oObj;
	},
	about:['Author:	AngusYoung','Version:	v1.0']
}
var jClass=(new _m_jClass_ay).selector;
/*识别浏览器*/
function Whois(c){
	var cUA=window.navigator.userAgent.toLowerCase();
	switch(c.toLowerCase()){
		case 'ie':
			var _n=cUA.indexOf('msie');
			if(_n>=0){
				return parseInt(cUA.substr(_n+5,1),10);
			}
			else{
				return 0;
			}
			break;
		case 'ie6':
			return cUA.indexOf('msie 6.0')>=0;
			break;
		case 'ie7':
			return cUA.indexOf('msie 7.0')>=0;
			break;
		case 'ie8':
			return cUA.indexOf('msie 8.0')>=0;
			break;
		case 'ie9':
			return cUA.indexOf('msie 9.0')>=0;
			break;
		case 'ie10':
			return cUA.indexOf('msie 10.0')>=0;
			break;
		case 'ff':
			return cUA.indexOf('firefox')>=0;
			break;
		case 'opera':
			return cUA.indexOf('opera')>=0;
			break;
		case 'webkit':
			return cUA.indexOf('webkit')>=0;
			break;
		case '360':
			var fuck360;
			try{
				fuck360=external.twGetVersion(external.twGetSecurityID(window)).split('.');
			}
			catch(e){}
			return fuck360?true:false;
			break;
		default:
			return cUA;
	}
}
/*前后元素*/
function MoveNode(oObj,nDire){
	if(nDire<0){
		var oMn=oObj.previousSibling;
	}
	else{
		var oMn=oObj.nextSibling;
	}
	if(oMn){
		if(!oMn.tagName||oMn.tagName=='!'){
			oMn=MoveNode(oMn,nDire);
		}
	}
	return oMn;
}
/*元素的各个位置*/
function GetOP(oObj,nDire){
	if(oObj.getBoundingClientRect){
		var oDc=Whois('WebKit')?document.body:document.documentElement;
		switch(nDire){
			case 0:
				return oObj.getBoundingClientRect().top+oDc.scrollTop;
			case 1:
				return oObj.getBoundingClientRect().right+oDc.scrollLeft-(document.documentElement.getBoundingClientRect().left==2?2:0);
			case 2:
				return oObj.getBoundingClientRect().bottom+oDc.scrollTop;
			case 3:
				return oObj.getBoundingClientRect().left+oDc.scrollLeft-(document.documentElement.getBoundingClientRect().left==2?2:0);
		}
	}
	else{
		if(nDire==1||nDire==3){
			var nPosition=oObj.offsetLeft;
		}
		else{
			var nPosition=oObj.offsetTop;
		}
		if(arguments[arguments.length-1]!=0){
			if(nDire==1){
				nPosition+=oObj.offsetWidth;
			}
			else if(nDire==2){
				nPosition+=oObj.offsetHeight;
			}
		}
		if(oObj.offsetParent!=null){
			nPosition+=GetOP(oObj.offsetParent,nDire,0);
		}
		return nPosition;
	}
}
/*元素的内部高度*/
function GetInnerSize(oObj,nSize){
	if(nSize=0){
		var nResult=oObj.offsetWidth;
		if(!isNaN(parseInt(GetCss(oObj,'paddingLeft'),10))){
			nResult-=GetCss(oObj,'paddingLeft');
		}
		if(!isNaN(parseInt(GetCss(oObj,'paddingRight'),10))){
			nResult-=GetCss(oObj,'paddingRight');
		}
		if(!isNaN(parseInt(GetCss(oObj,'borderLeftWidth'),10))){
			nResult-=GetCss(oObj,'borderLeftWidth');
		}
		if(!isNaN(parseInt(GetCss(oObj,'borderRightWidth'),10))){
			nResult-=GetCss(oObj,'borderRightWidth');
		}
	}
	else{
		var nResult=oObj.offsetHeight;
		if(!isNaN(parseInt(GetCss(oObj,'paddingTop'),10))){
			nResult-=GetCss(oObj,'paddingTop');
		}
		if(!isNaN(parseInt(GetCss(oObj,'paddingBottom'),10))){
			nResult-=GetCss(oObj,'paddingBottom');
		}
		if(!isNaN(parseInt(GetCss(oObj,'borderTopWidth'),10))){
			nResult-=GetCss(oObj,'borderTopWidth');
		}
		if(!isNaN(parseInt(GetCss(oObj,'borderBottomWidth'),10))){
			nResult-=GetCss(oObj,'borderBottomWidth');
		}
	}
	return nResult;
}
/*获取CSS*/
function GetCss(oObj,cAttrib){
	var AttValue=oObj.currentStyle?oObj.currentStyle[cAttrib]:document.defaultView.getComputedStyle(oObj,null)[cAttrib];
	return isNaN(parseInt(AttValue,10))?AttValue.toLowerCase():parseInt(AttValue,10);
}
/*十六进制数转为RGB*/
function RgbColor(cColor){
	if(cColor.substr(0,1)=='#'){
		var n=cColor.length==4?1:(cColor.length==7?2:0);
	}
	else{
		return cColor;
	}
	if(!n){return cColor;}
	var a=[];
	for(var i=1;i<cColor.length;i++){
		var cHex=cColor.substr(i,n);
		a.push(parseInt((cHex.length==2?cHex:cHex+cHex),16));
	}
	return a.join(',');
}
/*RGB转为十六进制数*/
function HexColor(cColor){
	if(cColor.substr(0,1)=='#'){
		return cColor.toLowerCase();
	}
	else{
		var cNewC=cColor.replace('rgb(','').replace(')','').replace(/\s/g,'');
		var aRGB=cNewC.split(',');
		var cRelt='#';
		for(var i=0;i<aRGB.length;i++){
			cRelt+=parseInt(aRGB[i],10).toString(16).length==1?'0'+parseInt(aRGB[i],10).toString(16):parseInt(aRGB[i],10).toString(16);
		}
		return cRelt.toLowerCase();
	}
}
/*阻止冒泡*/
function stopBubble(){
	var e=arguments[arguments.length-1];
	var evt=e||window.event;
	if(evt.stopPropagation){
		evt.stopPropagation();
	}
	else{
		evt.cancelBubble=true;
	}
}
/*复选框操作*/
function SelCkb(oObj,nDr){
	var oA=jClass('input',oObj);
	switch(nDr){
		case -1:/*UNSEL*/
			for(var i=0;i<oA.length;i++){
				if((oA[i].type=='checkbox')&&(oA[i].checked)){
					oA[i].checked=null;
				}
				else{
					oA[i].checked='checked';
				}
			}
			break;
		case  0:/*NOSEL*/
			for(var i=0;i<oA.length;i++){
				if(oA[i].type=='checkbox'){
					oA[i].checked=null;
				}
			}
			break;
		case  1:/*ALLSEL*/
			for(var i=0;i<oA.length;i++){
				if(oA[i].type=='checkbox'){
					oA[i].checked='checked';
				}
			}
			break;
	}
}
/*选项卡效果*/
function ChanTab(oObj,cId,nSel,nTotl,cClname){
	var oParent=oObj.parentNode;
	for(var i=0;i<nTotl;i++){
		jClass(oObj.tagName,oParent)[i].className='';
		if(jClass('#'+cId+i)){
			jClass('#'+cId+i).style.display='none';
		}
	}
	oObj.className=cClname;
	if(jClass('#'+cId+nSel)){
		jClass('#'+cId+nSel).style.display='';
	}
}
/*左右移动下拉列表项*/
function ListMovit(cSoulist,cTarget,nDirect){
	var oSl=jClass('#'+cSoulist);
	var oTl=jClass('#'+cTarget);
	switch(nDirect){
		case -1:/*MOVESEL*/
			if(oTl.selectedIndex>=0){
				for(var i=0;i<oTl.options.length;i++){
					if(oTl.options[i].selected){
						oSl.options.add(new Option(oTl.options[i].text,oTl.options[i].value));
						oTl.remove(oTl.options[i].index);i--;
					}
				}
			}
			break;
		case  0:/*MOVEALL*/
			while(oTl.options.length>0){
				oSl.options.add(new Option(oTl.options[0].text,oTl.options[0].value));
				oTl.remove(oTl.options[0].index);
			}
			break;
		case  1:/*ADDSEL*/
			if(oSl.selectedIndex>=0){
				for(var i=0;i<oSl.options.length;i++){
					if(oSl.options[i].selected){
						oTl.options.add(new Option(oSl.options[i].text,oSl.options[i].value));
						oSl.remove(oSl.options[i].index);
						i--;
					}
				}
			}
			break;
		default:/*ADDALL*/
			while(oSl.options.length>0){
				oTl.options.add(new Option(oSl.options[0].text,oSl.options[0].value));
				oSl.remove(oSl.options[0].index);
			}
	}
}
/*设置透明度*/
function setAlpha(oObj,nValue){
	if(Whois('ie')){
		oObj.style.filter='alpha(opacity='+nValue+')';
		if(Whois('ie')>8){
			oObj.style.opacity=nValue/100;
		}
	}
	else{
		oObj.style.opacity=nValue/100;
	}
}
/*淡入淡出*/
function FadeTo(oT,oS,nNormal,fn){
	if(oS){
		FadeTo(oS,null,-100,function(){
			FadeTo(oT,null,nNormal);
		});
	}
	else{
		var xTime=setInterval(function(){
			if(nNormal<0){
				setAlpha(oT,Math.abs(nNormal)-10);
				oT.style.display='';
				nNormal=-(Math.abs(nNormal)-10);
				if(nNormal==0){
					oT.style.display='none';
					clearInterval(xTime);
				}
				if(nNormal==-10){
					if(typeof(fn)=='function'){
						fn();
					}
				}
			}
			else{
				setAlpha(oT,nNormal);
				oT.style.display='';
				nNormal+=10;
				if(nNormal>100){
					clearInterval(xTime);
					if(typeof(fn)=='function'){
						fn();
					}
				}
			}
		},80);
	}
}
/*震动*/
function ShakeIt(oObj,nSpeed,aCoord,nRepeat,i){
	aCoord=aCoord||[[0,6],[6,0],[0,-6],[-6,0]];
	nRepeat=nRepeat||1;
	i=i||0;
	var nObjLeft=oObj.offsetLeft;
	var nObjTop=oObj.offsetTop;
	oObj.style.left=nObjLeft+aCoord[i][0]+'px';
	oObj.style.top=nObjTop+aCoord[i][1]+'px';
	i++;
	if(i<aCoord.length){
		setTimeout(function(){
			ShakeIt(oObj,nSpeed,aCoord,nRepeat,i);
		},nSpeed);
	}
	else{
		nRepeat--;
		if(nRepeat>0){
			i=0;
			setTimeout(function(){
				ShakeIt(oObj,nSpeed,aCoord,nRepeat,i);
			},nSpeed);
		}
	}
}
/*形状动画*/
function AnimatReset(oObj,xDirect,nValue,nEnd,nTime,nStep,fn){
	var aDirect=xDirect.split('.');
	var nCompute=aDirect.length>1?'offset'+aDirect[1].substr(0,1).toUpperCase()+aDirect[1].substr(1):xDirect;
	if(aDirect.length>1){
		if(oObj[nCompute]<nValue){
			oObj[aDirect[0]][aDirect[1].toLowerCase()]=oObj[nCompute]+nStep+'px';
			if(oObj[nCompute]>=nEnd){
				oObj[aDirect[0]][aDirect[1].toLowerCase()]=nEnd+'px';
			}
		}
		else{
			oObj[aDirect[0]][aDirect[1].toLowerCase()]=(oObj[nCompute]-nStep<0?0:oObj[nCompute]-nStep)+'px';
			if(oObj[nCompute]-nStep<=nEnd){
				oObj[aDirect[0]][aDirect[1].toLowerCase()]=nEnd+'px';
			}
		}
	}
	else{
		if(oObj[nCompute]<nValue){
			oObj[nCompute]+=nStep;
			if(oObj[nCompute]>=nEnd){
				oObj[nCompute]=nEnd;
				nValue=nEnd;
			}
		}
		else{
			oObj[nCompute]-=nStep;
			if(oObj[nCompute]<=nEnd){
				oObj[nCompute]=nEnd;
				nValue=nEnd;
			}
		}
	}
	if(oObj[nCompute]==nValue){
		if(typeof(fn)=='function'){
			fn();
		}
	}
	else{
		setTimeout(function(){AnimatReset(oObj,xDirect,nValue,nEnd,nTime,nStep,fn);},nTime);
	}
}
/*在下方显示对象*/
function showDiv(oObj,oCurrobj){
	oObj.onclick=stopBubble;
	oObj.style.display=GetCss(oObj,'display')=='none'?'block':'none';
	oObj.style.left=GetOP(oCurrobj,3)+'px';
	oObj.style.top=GetOP(oCurrobj,2)-1+'px';
	document.documentElement.onclick=function(){
		var e=arguments[arguments.length-1];
		var oEvobj=(ev=(e||window.event)).target||ev.srcElement;
		if(oEvobj!==oCurrobj){
			oObj.style.display='none';
		}
	};
}
/*页面加载完执行*/
function AddLoad(xFun){
	if (typeof(xFun)!=='function'){
		xFun=Function(xFun);
	}
	if(Whois('ie')){
		window.attachEvent('onload',xFun);
	}
	else{
		window.addEventListener('load',xFun,false);
	}
}
/*加载HTML文本内的某元素的HTML*/
function loadElem(cSelect,cObj){
	if(!cObj){
		return '';
	}
	if(cSelect==''){
		return cObj;
	}
	else{
		var div=document.createElement('div');
		div.innerHTML=cObj;
		var r=jClass(cSelect,div);
		if(r){
			return r.innerHTML;
		}
		else{
			return '';
		}
		div=null;
	}
}
/*收集表单所有数据用于AJAX提交*/
function putForm(o){
	var aPostData=[];
	for(var i=0;i<o.elements.length;i++){
		if(o.elements[i].type=='radio'||o.elements[i].type=='checkbox'){
			if(o.elements[i].checked){
				aPostData.push(encodeURIComponent(o.elements[i].name)+'='+encodeURIComponent(o.elements[i].value));
			}
		}
		else{
			aPostData.push(encodeURIComponent(o.elements[i].name)+'='+encodeURIComponent(o.elements[i].value));
		}
	}
	return aPostData;
}
function setCookie(c_name,value,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+'='+escape(value)+((expiredays==null)?'':';expires='+exdate.toGMTString())+';path=/';
}
function getCookie(c_name){
	var arr=document.cookie.match(new RegExp('(^| )'+c_name+'=([^;]*)(;|$)'));
	if(arr){
		return unescape(arr[2]);
		return null;
	}
}
function delCookie(c_name){
	var exdate=new Date();
	exdate.setTime(exdate.getTime()-1);
	var cval=getCookie(c_name);
	if(cval){
		document.cookie=c_name+'='+cval+';expires='+exdate.toGMTString()+';path=/';
	}
}
var xmlHttp;
function oXH(lAb){
	if(xmlHttp&&lAb){
		xmlHttp.abort();
		xmlHttp=null;
	}
	if(window.XMLHttpRequest){
		xmlHttp=new window.XMLHttpRequest();
	}
	else if(window.ActiveXObject){
		xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xmlHttp;
}
function mAjax(){
	this.abt=true;
}
mAjax.prototype={
	version:{
		Author:'AngusYoung',
		Ver:'0.04b',
		Update:'2011-11-23',
		Contact:'http://www.mrxcool.com'
	},
	run:function(cURL,oJSON){
		var _this=this;
		var xh=oXH(_this.abt);
		var cMethod='get';
		var cCharset='utf-8';
		var xSends=null;
		if(oJSON){
			cMethod=oJSON.method||cMethod;
			cCharset=oJSON.charset||cCharset;
			xSends=oJSON.send;
			if(typeof(oJSON.complete)=='function'){
				_this.complete=oJSON.complete;
			}
			if(typeof(oJSON.error)=='function'){
				_this.error=oJSON.error;
			}
		}
		if(cURL){
			xh.open(cMethod,cURL,true);
			if(cMethod.toLowerCase()=='post'){
				xh.setRequestHeader('Content-type','application/x-www-form-urlencoded;charset='+cCharset);
			}
			xh.onreadystatechange=function(){
				if(xh.readyState==4){
					switch(xh.status){
						case 200:
							_this.complete(xh.responseText);
							break;
						default:
							_this.error(xh.status);
					}
				}
			};
			xh.send(xSends);
		}
	},
	complete:function(cReturn){
		alert(cReturn);
	},
	error:function(cReturn){
		var ErrCode={404:'Not Found',500:'Server Error'};
		alert(ErrCode[cReturn]||'['+cReturn+'] UnKnow Error');
	}
};
function badIE6(oObj,cHTML){
	if(Whois('ie6')){
		var oIE6=document.createElement('div');
		oIE6.id='badIE6';
		oIE6.style.cssText='padding:0 10px;background-color:#FFFFE1;border-bottom:#fff outset 2px;line-height:30px;color:#000;height:30px;';
		oIE6.title='Double click to close this tips.';
		oIE6.ondblclick=function(){this.parentNode.removeChild(this);};
		oIE6.onmouseover=function(){this.style.backgroundColor='#316AC5';this.style.color='#fff';};
		oIE6.onmouseout=function(){this.style.backgroundColor='#FFFFE1';this.style.color='#000';};
		oIE6.innerHTML=cHTML;
		oObj.parentNode.insertBefore(oIE6,oObj);
	}
}


/*
function CountText(oObj,nMaxLen,oReObj){
	var cNewValue=oObj.value.replace(/[^\x00-\xff]/g,'*');
	var nNowLen=cNewValue.length;
	oReObj.innerHTML=nNowLen;
	if(nNowLen>nMaxLen){
		oObj.value=oObj.value.substr(0,oObj.value.length-(nNowLen-nMaxLen));
		return false;
	}
}
*/
/*Other Supply*/
function AddEvent(e,t,f,c){
	if(e.attachEvent){
		e.attachEvent('on'+t,function(){
			f.call(e,window.event);
		});
	}
	else if(e.addEventListener){
		e.addEventListener(t,f,c);
	}
	else{
		e['on'+t]=f;
	}
}
function DelEvent(e,t,f){
	if(e.detachEvent){
		e.detacthEvent('on'+t,f);
	}
	else if(e.removeEventListener){
		e.removeEventListener(t,f,false);
	}
	else{
		e['on'+t]=null;
	}
}
function domReady(f){
	if(domReady.done){
		return f();
	}
	if(domReady.timer){
		domReady.ready.push(f);
	}
	else{
		AddLoad(isDOMReady);
		domReady.ready=[f];
		domReady.timer=setInterval(isDOMReady,13);
	}
}
function isDOMReady(){
	if(domReady.done){
		return false;
	}
	if(document&&document.getElementsByTagName&&document.getElementById&&document.body){
		clearInterval(domReady.timer);
		domReady.timer=null;
		for(var i=0;i<domReady.ready.length;i++){
			domReady.ready[i]();
		}
		domReady.ready=null;
		domReady.done=true;
	}
}