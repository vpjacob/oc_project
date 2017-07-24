//进入APP之前需要初始化的信息==star
//用户信息
var userInfo = {
	"hasRegist" : false,
	"hasLogon" : false,
	"memberid" : "memberid",
	"account" : "account",
	"nickname" : "nickname",
	"telphone" : "telphone",
	"location" : {
		"lon" : 0,
		"lat" : 0,
		"address" : ""
	}
};
//天气信息
var lastweather = {
	"todayTemperature" : "",
	"tomorrowTemperature" : "",
	"afterTomorrowTemperature" : "",
	"todaySkycon" : "",
	"tomorrowSkycon" : "",
	"afterTomorrowSkycon" : "",
	"todayHint" : "",
	"currentTemperature" : "",
	"currentMax" : "",
	"currentMin" : "",
	"pm25" : "",
	"recommend" : "",
	"wind" : "",
	"hourDescription" : "",
	"backgroundCss" : ""
};
//新闻
var news = {};
//用户的钥匙
var userkeyinfo = {}
//城市信息
var citys={};
//进入APP之前需要初始化的信息==end

var fs;
apiready = function() {
	
	var deviceId = api.deviceId;//手机唯一标识
	api.setPrefs({
		key : 'deviceId',
		value : deviceId
	});
	
	var ajpush = api.require('ajpush');
	ajpush.getRegistrationId(function(ret) {
        console.info(JSON.stringify(ret))
        var registrationId = ret.id;
        api.setPrefs({
			key : 'registrationId',
			value : registrationId
		});
    });
	
	fs = api.require('fs');
//	initAppInfo();
	fs.readDir({
		path : 'fs://wisdomLifeData/'
	}, function(ret, err) {
		if (ret.status) {
			var fileList = $api.jsonToStr(ret.data);
			//用户信息
			if (fileList.indexOf("wisdomlife_log.log") > 0) {
				FileUtils.writeFile({
					"welcome" : "启动应用==============="
				}, "wisdomlife_log.log");
			} else {
				fs.createFile({
					path : 'fs://wisdomLifeData/wisdomlife_log.log'
				}, function(ret, err) {
					if (ret.status) {
						FileUtils.writeFile({
							"welcome" : "启动应用==============="
						}, "wisdomlife_log.log");
					}
				});
			}
		} else {

		}
	});
}
//点击立即体验关闭引导页
function fnClose() {
	if ($api.getStorage('firstStart')) {

		initAppInfo();

	}
};

//滑动到第四个引导页时显示"立即体验"按钮
function showNowRegistButton() {
	$("img").show();
}

//引导页向右滑动时隐藏页面上的"立即体验"按钮
function hideNowRegistButton() {
	$("img").hide();
}

//初始化基本信息,例如:用户信息:info.json,新闻信息:news.json,天气信息:lastweather.json,用户的钥匙信息:userkeyinfo.json
function initAppInfo() {

	//设置是否显示引导遮罩
	api.setPrefs({
		key : 'isFirst',
		value : 'NO'
	});
	
	fs.createDir({
		path : 'fs://wisdomLifeData'
	}, function(ret, err) {
		if (ret.status) {
			createInitFile();
		} else {
			createInitFile();
		}
	});
	
	//初始化极光推送
	initJpush();

}

function initJpush()
{
	var ajpush = api.require('ajpush');
	ajpush.init(function(ret) {
	    if (ret && ret.status){
//	    	api.toast({
//			    msg: '推送服务初始化成功',
//			    duration: 2000,
//			    location: 'bottom'
//			});
//			ajpush.setListener(
//			    function(ret) {
//			         var id = ret.id;
//			         var title = ret.title;
//			         var content = ret.content;
//			         var extra = ret.extra;
//			    }
//			);
	    }
	});
}

function createInitFile() {
	fs.readDir({
		path : 'fs://wisdomLifeData/'
	}, function(ret, err) {
		if (ret.status) {
			var fileList = $api.jsonToStr(ret.data);
			//用户信息
			if (fileList.indexOf('"info.json"') > 0) {
				FileUtils.writeFile(userInfo, "info.json");
			} else {
				fs.createFile({
					path : 'fs://wisdomLifeData/info.json'
				}, function(ret, err) {
					if (ret.status) {
						FileUtils.writeFile(userInfo, "info.json");
					}
				});
			}
			//新闻信息
			if (fileList.indexOf("news.json") > 0) {
				FileUtils.writeFile(news, "news.json");
			} else {
				fs.createFile({
					path : 'fs://wisdomLifeData/news.json'
				}, function(ret, err) {
					if (ret.status) {
						FileUtils.writeFile(news, "news.json");
					}
				});
			}
			//天气信息
			if (fileList.indexOf("lastweather.json") > 0) {
				FileUtils.writeFile(lastweather, "lastweather.json");
			} else {
				fs.createFile({
					path : 'fs://wisdomLifeData/lastweather.json'
				}, function(ret, err) {
					if (ret.status) {
						FileUtils.writeFile(lastweather, "lastweather.json");
					}
				});
			}
			//用户的钥匙信息
			if (fileList.indexOf("userkeyinfo.json") > 0) {
				FileUtils.writeFile(userkeyinfo, "userkeyinfo.json");
			} else {
				fs.createFile({
					path : 'fs://wisdomLifeData/userkeyinfo.json'
				}, function(ret, err) {
					if (ret.status) {
						FileUtils.writeFile(userkeyinfo, "userkeyinfo.json");
					}
				});
			}
			//城市信息
			if (fileList.indexOf("citys.json") > 0) {
				FileUtils.writeFile(citys, "citys.json");
			} else {
				fs.createFile({
					path : 'fs://wisdomLifeData/citys.json'
				}, function(ret, err) {
					if (ret.status) {
						FileUtils.writeFile(citys, "citys.json");
					}
				});
			}
			api.setFrameGroupAttr({
				name : 'welcome',
				hidden : true
			});
			api.setFrameAttr({
				name : 'dot_slider',
				hidden : true
			});
			api.execScript({
				name : 'root',
				script : 'getUserInfo();'
			});
		} else {
			FileUtils.writeFile({
				"welcome-->initAppInfo()-->ErrorMsg" : err.msg
			}, "wisdomlife_log.log");
		}
	});
}