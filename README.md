jClass
=======================
    一个小巧的javascript方法类库，并且提供部分动画交互效果。

##Selector

	DOM选择器
	@param sExpression {String || Object} DOM对象或者表达式字符串，支持一般的类型查找
	@param oScopeDOM {Object} DOM对象，做为查找对象的父级元素
	@returns {Object} 返回一个查找结果集以及相关的方法

使用方法与jQuery的基本一致，但只提供部分API。
支持`tagName`, `className`, `name`, `id`, `attribute`, `string` 等方式选择或创建DOM对象。
支持链式表达，暂不支持只对子级进行查找模式（`div > p`）*默认子孙级都查找*，查找`name`时请使用识别码`@`，比如：`@username`。

- `each()` 遍历结果
- `addClass()` 添加样式
- `removeClass()` 删除样式
- `hasClass()` 包含样式
- `data()` DataSet
- `attr()` 属性
- `removeAttr()` 删除属性
- `remove()` 移除元素
- `after()` 在之后添加
- `afterTo()` 添加到之后
- `before()` 在之前添加
- `beforeTo()` 添加到之前
- `append()` 内部添加子元素
- `appendTo()` 作为子元素添加到
- `clone()` 克隆
- `html()` 内部HTML
- `outerHtml()` 外部HTML
- `val()` 值
- `eq()` 索引
- `first()` 第一个
- `last()` 最后一个
- `prev()` 前一个
- `next()` 下一个
- `find()` 查找下级元素
- `css()` CSS属性、设置
- `width()` 宽度
- `height()` 高度
- `innerWidth()` 内部宽度
- `innerHeight()` 内部高度
- `alpha()` 透明度
- `show()` 显示
- `hide()` 隐藏

---

- `on()` 事件绑定
- `fade()` 淡入淡出
- `shake()` 震动
- `animateShape()` 形状动画
- `get()` 坐标值top, left, right, bottom
- `serialize()` 序例化表单数据
- `checkbox()` 选项框操作

以上API的使用与jQuery的使用基本一致，支持链式操作。部分如`outerHtml()`; `alpha()`等是jClass自有的API。
```js
var $ = jClass;
$('#open').append($('div p.test').clone().attr('title', 'this is clone.'));
```
```js
$('a').on('click', function(){
	$(this).shake(3); // 重复3次的默认偏移震动
	return false;
});
```
##Extend

	扩展方法

jClass提供扩展方法用于一些日常的效果实现

- `load()` 页面内容加载完成
- `domReady()` 页面结构加载完成
- `addEvent()` 添加事件
- `delEvent()` 移除事件
- `isWho()` 浏览器检测
- `colorToRgb()` RGB颜色值
- `colorToHex()` 十六进制颜色值
- `listMove()` 多选下拉项转换
- `getHTML()` HTML文本内某节点的HTML
- `cookie` Cookies
- `stopBubble()` 阻止冒泡

```js
$.load(function(){
	if ($.isWho('ie')) {
		$.cookie.set('isIE', 'true', 30);
	}
});
```

##Ajax

	AJAX请求
	@param jConfig {Object} 请求的参数配置
	@returns {XMLHttpRequest} 返回XHR对象

方法执行后返回XHR对象，可将此对象赋值给变量后，执行`abort()`操作。
本方法提供AJAX重发功能，可在触发`error`回调时执行`retry()`方法，重新执行AJAX请求，重试次数由配置`retryCount`指定，默认为3次。
**注意本方法只提供`success`, `error`的回调，与jQuery支持的回调方法略有不同，并且不支持`$.get()`, `$.post()`等方法。**
```js
var xhr = $.ajax({
	url: 'http://www.simple.com/simple.php',
	type: 'POST',
	dataType: 'JSON',
	data: {
		user: 'Angus',
		age: 28,
		list: [1, 2, 3, 4]
	},
	success: function (jData, xhr){
		// success callback
		// this === jConfig
	},
	error: function (nStatus) {
		// error callback
		// this.retry();
	}
});
```