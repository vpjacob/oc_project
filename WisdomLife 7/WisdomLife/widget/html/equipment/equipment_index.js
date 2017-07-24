//其中，IOS状态栏高度为20px，Android为25px
var headerH;
//footer高度为css样式中声明的30px
var footerH;
//frame的高度为当前window高度减去header和footer的高度
var frameH;
var systemType;
var path_android = "/storage/emulated/0/Carcorder/";
var path_ios;
var path;
apiready = function() {
	var systemType = api.systemType;
	if (systemType != "ios") {//只限Android系统
		path = path_android;
		api.setPrefs({
			key : 'path',
			value : path_android
		});
	} else {
		path_ios = api.cacheDir + "/imagePath/";
		path = path_ios;
		api.setPrefs({
			key : 'path',
			value : path_ios
		});
	}
	var fs = api.require('fs');
	fs.readDir({
		path : path
	}, function(ret, err) {
		if (ret.status == false && err.msg != "") {
			fs.createDir({
				path : path
			}, function(ret, err) {
				if (ret.status) {

				} else {

				}
			});
		}
	});
	api.closeWin({
		name : 'my_equipment'
	});
	//在名为winName的window中执行jsfun脚本
	var jsfun = 'refreshFile();';
	api.execScript({
		name : 'room',
		script : jsfun
	});
	api.alert({
		msg : "使用记录仪请记得连接设备WiFi"
	});
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		api.alert({
			msg : "请记得切换您的网络连接，继续享受小客为您带来的服务"
		}, function(ret, err) {
			api.closeWin();
		});
	});
	var header = $api.byId('header');
	//适配iOS7+，Android4.4+状态栏沉浸式效果，详见config文档statusBarAppearance字段
	$api.fixStatusBar(header);
	//动态计算header的高度，因iOS7+和Android4.4+上支持沉浸式效果，
	//因此header的实际高度可能为css样式中声明的44px加上设备状态栏高度
	//其中，IOS状态栏高度为20px，Android为25px
	systemType = api.systemType;
	if (systemType == 'ios') {
		headerH = 20;
	} else {
		headerH = 0;
	}
	//footer高度为css样式中声明的30px
	footerH = 60;
	//frame的高度为当前window高度减去header和footer的高
	frameH = api.winHeight - headerH - footerH;
//	if (api.systemType == 'ios') {
//		var cc = $api.dom('.content');
//		$api.css(header, 'margin-top:20px;');
//		$api.css(cc, 'margin-top:20px;');
//	}
	$(".tab-item").bind("click", function() {
		$(this).addClass("changeColor").siblings().removeClass("changeColor");
	});

	$("#back").bind("click", function() {
		api.closeWin();
	});
	$("#photo").bind("click", function() {
		api.openFrame({
			name : 'photo',
			url : 'photo.html',
			bounces : false,
			rect : {
				x : 0,
				y : headerH,
				w : 'auto',
				h : frameH
			}
		});
	});
	$("#radio").bind("click", function() {
		api.openFrame({
			name : 'equipment_1',
			url : 'equipment_1.html',
			bounces : false,
			rect : {
				x : 0,
				y : headerH,
				w : 'auto',
				h : frameH
			}
		});
	});
	$("#setup").bind("click", function() {
		api.openFrame({
			name : 'equipment_setup',
			url : 'equipment_setup.html',
			bounces : false,
			rect : {
				x : 0,
				y : headerH,
				w : 'auto',
				h : frameH
			}
		});
	});
	api.openFrame({
		name : 'equipment_1',
		url : 'equipment_1.html',
		bounces : false,
		rect : {
			x : 0,
			y : headerH,
			w : 'auto',
			h : frameH
		}
	});

};
function close() {
	api.closeWin();
}