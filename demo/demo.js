/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description Demo示例
 * @Since 16/2/26
 */

//if you want to do fuck jQuery then
var $ = jClass;
//else use jClass;

$('#selector').on('click', 'button', function () {
	console.log($(this).data('cmd'));
	switch (parseInt($(this).data('cmd'), 10)) {
		case 1:
			alert('ID为“chkb”的内容是：\n' + $('#chkb').html());
			break;
		case 2:
			alert('类名为“on”的有' + $('.on').length + '个');
			break;
		case 3:
			alert('名为“abc”的有' + $('@abc').length + '个');
			break;
		case 4:
			alert('标签名为“li”的有' + $('li').length + '个');
			break;
		case 5:
			alert('ID为“chkb”里标签名为“input”的有' + $('#chkb input').length + '个');
			break;
		case 6:
			alert('ID为“chkb”里第二个标签名为“input”的值是：' + $('#chkb input').eq(1).val());
			break;
		case 7:
			alert('名为“checkbox_1”的有' + $('@checkbox_1').length + '个，在ID为“chkb”里的有' + $('#chkb @checkbox_1').length + '个');
			break;
		case 8:
			alert('在第二个类名为“www”里的“input”标签有' + $('input', $('.www').eq(1)).length + '个');
			break;
		case 9:
			alert('在ID为“hwe”里的类名为“www”的里面有一个“label”里最后一个名为“know”的值是：' + $('#hwe .www label @know').last().val());
			break;
	}
});

$('#relate').on('click', 'button', function () {
	switch (parseInt($(this).data('cmd'), 10)) {
		case 1:
			alert($('#ct_1').prev().outerHtml());
			break;
		case 2:
			alert($('#ct_1').next().outerHtml());
			break;
		case 3:
			alert($('#relate button').first().outerHtml());
			break;
		case 4:
			alert($('#relate button').last().outerHtml());
			break;
		case 5:
			alert($('#relate button').eq(2).outerHtml());
			break;
		case 6:
			$('#relate button').each(function (nIndex) {
				alert('第' + (nIndex + 1) + '个按钮: ' + this.outerHTML);
			});
			break;
		case 7:
			alert($('#relate').find('li.on').outerHtml());
			break;
	}
});

$('#func').on('click', 'button', function () {
	switch (parseInt($(this).data('cmd'), 10)) {
		case 1:
			alert($('.on').css('color'));
			break;
		case 2:
			alert($('#bd').css('width'));
			break;
		case 3:
			alert($('#bd').width());
			break;
		case 4:
			alert($('#bd').innerWidth());
			break;
		case 5:
			$('#haha').show();
			break;
		case 6:
			$('#haha').hide();
			break;
		case 7:
			$('#bd').alpha(80);
			break;
		case 8:
			$('#bd').alpha(30);
			break;
		case 9:
			alert($('@testFrm').serialize());
			break;
		case 10:
			$('#chkb').checkBox('all');
			break;
		case 11:
			$('#chkb').checkBox('other');
			break;
		case 12:
			$('#chkb').checkBox('not');
			break;
		case 13:
			jClass.listMove($('#seS')[0], $('#seT')[0]);
			break;
		case 14:
			jClass.listMove($('#seT')[0], $('#seS')[0]);
			break;
		case 15:
			$('#seS option').each(function () {
				this.selected = 'selected';
			});
			jClass.listMove($('#seS')[0], $('#seT')[0]);
			break;
		case 16:
			$('#seT option').each(function () {
				this.selected = 'selected';
			});
			jClass.listMove($('#seT')[0], $('#seS')[0]);
			break;
		case 17:
			$('#bd').shake(5, [[10, 0], [-10, 0], [-10, 0], [10, 0], [10, 0], [-10, 0]], function () {
				alert('x震完毕');
			});
			break;
		case 18:
			$('#bd').fade(0, function () {
				$(this).fade(100);
			});
			break;
		case 19:
			console.time('执行时间');
			$('#bd').animateShape('style.width', '500px', .3, function () {
				console.timeEnd('执行时间');
			});
			break;
		case 20:
			$('body').animateShape('scrollTop', 0, .5, function () {
				alert('到顶啦');
			});
			break;
		case 21:
			$('#bd')[0].style.top = $(this).get().top + 'px';
			$('#bd').html('top: ' + $('#bd')[0].offsetTop);
			break;
		case 22:
			$('#bd')[0].style.left = $(this).get().right + 'px';
			$('#bd').html('right: ' + $('#bd').css('left'));
			break;
		case 23:
			$('#bd')[0].style.top = $(this).get().bottom + 'px';
			$('#bd').html('bottom: ' + $('#bd').css('top'));
			break;
		case 24:
			$('#bd')[0].style.left = $(this).get().left + 'px';
			$('#bd').html('left: ' + $('#bd')[0].offsetLeft);
			break;
	}
});

$('#event').on('click', 'button', function () {
	switch (parseInt($(this).data('cmd'), 10)) {
		case 1:
			$('#st').html($(this).html()).show();
			break;
	}
});

$('#extend').on('click', 'button', function () {
	switch (parseInt($(this).data('cmd'), 10)) {
		case 1:
			alert($.colorToHex($(this).css('backgroundColor')));
			break;
		case 2:
			alert($(this).css('backgroundColor'));
			break;
		case 3:
			alert($(this).css('color'));
			break;
		case 4:
			alert($.cookie.get('aw'));
			break;
		case 5:
			$.cookie.set('aw', '123456789');
			break;
		case 6:
			$.cookie.del('aw');
			break;
	}
});
$('#abc').on('click', 'li.on', function () {
	alert('点击了' + this.innerHTML);
});

$('.bubble').on('click', function () {
	alert('DIV被点击了');
});
$('#f1').on('click', function () {
	alert('按钮被点击');
	return false;
});
$('#f2').on('click', $.stopBubble);
// ajax test
var AJAX_XHR;
$('#f3').on('click', function () {
	var _me = $(this);
	_me.html('ajax start...').removeAttr('class').addClass('btn btn-default');
	// 开始ajax请求, 并将xhr返回给AJAX_XHR供abort
	AJAX_XHR = $.ajax({
		url: 'http://localhost/ajax-delay.php',
		success: function () {
			_me.html('ajax successfully').removeAttr('class').addClass('btn btn-success');
		},
		error: function () {
			_me.html('ajax error').removeAttr('class').addClass('btn btn-danger');
		}
	});
});
$('#f4').on('click', function () {
	AJAX_XHR.abort();
	$('#f3').html('ajax abort').removeAttr('class').addClass('btn btn-warning');
});
// 全局ajax设置
$.ajaxSet({
	data: {
		trigger: 'button'
	},
	type: 'post'
});
//	alert($.isWho('360'));
