$.init();
//用户信息
var userInfo = {
};
//用户钥匙信息
var userKeyInfos = {
};
//天气信息
var weatherInfo = {
};
//新闻列表
var newsInfos = {
};
//默认的用户信息
var newsTypes = new Array('guonei', 'shehui', 'yule', 'caijing', 'junshi');
//新闻页数
var page = 1;
var x = '';

//百度地图模块
var bMap;
//蓝牙模块
var ble;
//开门模块
var openDoorModule;
//记录网络类型
var connectionType;
var isconn = 'true';
//默认的用户信息数量
var msgnum = 0;
//城市信息
var cityname;
var location;
var checkshake = true;
apiready = function() {
	//百度地图模块
	bMap = api.require('bMap');
	//蓝牙模块
	ble = api.require('ble');
	//开门模块
	openDoorModule = api.require('moduleOpenDoor');
	//同步返回结果：
	msgnum = api.getPrefs({
		sync : true,
		key : 'msgnum'
	});
	if (msgnum == 0) {//没有
		$('#msgnum').hide();
	} else {
		$('#msgnum').html(msgnum);
	}

	var logon = api.getPrefs({
		sync : true,
		key : 'hasLogon'
	}, function(ret, err) {

	});
	
	/**====================================调用智果是否有设备接口====================================**/
	if (logon == 'true') {
		setUserKeyInfos();
		//获取用户的要是信息，返回true和false true代表有设备显示开门按钮，false反之
		api.accessNative({
			name : 'ShowKey',
			extra : { }
		}, function(ret, err) {
			if (ret) {
				//                                     api.hideProgress();
				//                                     alert(JSON.stringify(ret));
				if(ret.msg == 'true')
				{
					$('.key').show();
				}else
				{
					$('.key').hide();
				}
			} else {
				//                                     api.hideProgress();
				//                                     alert(JSON.stringify(err));
			}
		});
	}
	//回到应用事件
	api.addEventListener({
		name : 'resume'
	}, function(ret, err) {

		connectionType = api.connectionType;
		//比如： wifi
		if (connectionType == 'none' || connectionType == "unknown") {
			api.alert({
				msg : '当前网络不可用'
			}, function(ret, err) {

			});
		} else {
			setUserKeyInfos();

		}

	});

	api.addEventListener({
		name : 'pause'
	}, function(ret, err) {
		api.removeEventListener({
			name : 'shake'
		});
	});
	//主页显示获取金蛋是否可砸
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		isHaveEgg(urId);
		checkIsNewUser();
	});

	//新人奖
	
	$(".goToAward").click(function(){
		$(".tankuang_box").css("display","none");
		api.openWin({
			name : 'clickAward',
			url : 'award/clickAward.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		}); 
	});
	//检测是否为新用户
	function checkIsNewUser() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myaward",
			needTrascation : true,
			funName : "checkIsNewUser",
			form : {
				userNo : urId
			},
			success : function(data) {
				api.hideProgress();
				console.log("检测是否为新用户"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var list = data.formDataset.isNewUser;
					if(list==1){
						queryIsGetAward();
					}
					
				} else {
//					alert(data.formDataset.errorMsg);
				}
			},
			error : function(xhr, type) {
				api.hideProgress();
				alert("您的网络不给力啊，检查下是否连接上网络了！");
			}
		});
	};
	//检测是否已抽奖
	function queryIsGetAward() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myaward",
			needTrascation : true,
			funName : "queryIsGetAward",
			form : {
				userNo : urId
			},
			success : function(data) {
				api.hideProgress();
				console.log("检测是否已抽奖"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var list = data.formDataset.isGet;
					if(list==1){
						$(".tankuang_box").show();
					}
				} else {
//					alert(data.formDataset.errorMsg);
				}
			},
			error : function(xhr, type) {
				api.hideProgress();
				alert("您的网络不给力啊，检查下是否连接上网络了！");
			}
		});
	};

	$("#afterTomorrow").html(DateUtils.getWeekDay(2));
	$("#todayDay").html(DateUtils.getTodayDate());
	$("#todayWeek").html(DateUtils.getWeekDay(0));
	$("#cndate").html(DateUtils.getCNDate());
	var height = window.screen.height - 454;
	$("#bodycontent").css("marginTop", height + "px");
	$("#bodycontent").animate({
		opacity : 1,
	}, 300, 'linear');
	connectionType = api.connectionType;
	//比如： wifi
	if (connectionType == 'none' || connectionType == "unknown") {
		api.alert({
			msg : '当前网络不可用'
		}, function(ret, err) {
			isconn = 'false';
			$('.key').hide();
		});
	} else {
		isconn = 'true';
		readUserInfoAndKeyInfo();
	}
	//监听断网事件，使得只有下拉刷新和重新进入才能进行有网条件的判断
	api.addEventListener({
		name : 'offline'
	}, function(ret, err) {
		isconn == 'false';
	});
	// 添加'refresh'监听器-----------------------------------------------------

	$(document).on('refresh', '.pull-to-refresh-content', function(e) {
		freshWeather();
	});

	//读取lastweather.json文件
	FileUtils.readFile("lastweather.json", function(data) {
		if (data.todayTemperature != "") {
			$("#todayTemperature").html(data.todayTemperature);
			$("#tomorrowTemperature").html(data.tomorrowTemperature);
			$("#afterTomorrowTemperature").html(data.afterTomorrowTemperature);
			$("#discription").html(data.todayHint);
			$("#currentTemperature").html(data.currentTemperature);
			$("#maxTemperature").html(data.currentMax);
			$("#minTemperature").html(data.currentMin);
			$("#pm25").html(data.pm25);
			$("#recommend").html(data.recommend);
			$("#wind").html(data.wind);
			$("#hourDescription").html(data.hourDescription);
			$("#todaySky").html(data.todaySkycon);
			$("#tomorrowSky").html(data.tomorrowSkycon);
			$("#afterTomorrowSky").html(data.afterTomorrowSkycon);
			$("#content").css("background", data.backgroundCss);
			$("#content").css("background-size", "cover");

			weaherInfo = data;

		}

	});

	//读取news.json中的新闻列表
	FileUtils.readFile("news.json", function(data) {
		if (data == undefined || data.length == undefined) {
			writeandreadNews();
		} else {
			loadmainNews(data);
		}
		;

	});

	/**====================================调用智果开门====================================**/
	/**
	 * 点击开门按钮
	 */
	$(document).on('click', '.key', function() {
		//智果开门
		api.accessNative({
			name : 'Onceopen',
			extra : { },
		}, function(ret, err) {
			if (ret) {
				//                                     api.hideProgress();
				//                                     alert(JSON.stringify(ret));
			} else {
				//                                     api.hideProgress();
				//                                     alert(JSON.stringify(err));
			}
		});
	});
	var systemType = api.systemType;
	var ajpush = api.require('ajpush');
	/**
	 *极光的初始化和设置监听
	 */
	
	ajpush.setListener(function(ret) {
		var content = ret.content;
		if (systemType == 'ios') {
			api.notification({
				notify : {
					content : content
				}
			}, function(ret, err) {
				var id = ret.id;
			});
		}
	}); 


	//	var deviceModel = api.deviceModel;

	if (systemType == 'android') {
		api.addEventListener({
			name : 'appintent'
		}, function(ret, err) {
			if (ret && ret.appParam.ajpush) {
				console.log($api.jsonToStr(ret));
//				var ajpush = ret.appParam.ajpush;
//				var id = ajpush.id;
//				var title = ajpush.title;
//				var content = ajpush.content;
//				var extra = ajpush.extra;
//				var relateid = $api.strToJson(extra).relateId;

//				if ($api.strToJson(extra).status != 3) {

					FileUtils.readFile("info.json", function(info, err) {
//						var memberid = info.memberid;
						api.openWin({
							name : 'myMessage',
							url : 'personal/myMessage.html',
							pageParam : {
								relateid : info.userNo
							},
							slidBackEnabled : true,
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							}
						});
					});
//				} else {//是新闻
//					api.closeToWin({
//						name : 'root'
//					});
//				}
			}
		});
	} else if (systemType == 'ios') {
		api.addEventListener({
			name : 'noticeclicked'
		}, function(ret, err) {
			if (ret) {
//				if (ret.extra.pushInfo.status != 3) {
//					var relateid = ret.extra.relateId;

					FileUtils.readFile("info.json", function(info, err) {
//						var memberid = info.memberid;
						api.openWin({
							name : 'myMessage',
							url : 'personal/myMessage.html',
							pageParam : {
								relateid : info.userNo
							},
							slidBackEnabled : true,
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							}
						});
					});
//				} else {//是新闻
//					api.closeToWin({
//						name : 'root'
//					});
//				}
			}
		})
	}

	$(document).on('click', '#message', function() {
		FileUtils.readFile("info.json", function(info, err) {
			var hasLogon = info.hasLogon;
			var memberid = info.memberid;
			if (hasLogon != true) {
				api.openWin({//打开登录界面
					name : 'login',
					url : 'registe/logo.html',
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					}
				});
			} else {
				api.openWin({
					name : 'messagelist',
					url : 'personal/messagelist.html',
					pageParam : {
						memberid : memberid
					},
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					}
				});
			}
		});
	});

	//地址
	$(document).on('click', '#location', function() {
		api.openWin({
			name : 'add_city',
			url : 'home/add_city.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});


};

function readUserInfoAndKeyInfo() {
	//读取info.json文件：

	FileUtils.readFile("info.json", function(info, err) {
		if (info.location.address != "") {
			$("#location").html(info.location.address);
		}
		userInfo = info;

		//通过baidumap重新定位
		loadLocationFormMap("yes");
	});
}

function refreshPageInitInfo(memberid) {
	//在这里从服务器加载数据，加载完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态

	AjaxUtil.exeScript({
		script : "login.login", //need to do
		needTrascation : false,
		funName : "refreshPageInitInfo",
		form : {
			//userId : 1
			userId : memberid
		},
		success : function(data) {
			if (data.execStatus === "true" && data.datasources[0].rows.length > 0) {
				var keyInfos = '{"keyinfos":' + $api.jsonToStr(data.datasources[0].rows) + '}';
				userKeyInfos = $api.strToJson(keyInfos);
				FileUtils.writeFile(userKeyInfos, "userkeyinfo.json");
				$('.key').show();
			} else {
				//置空钥匙信息
				userKeyInfos = {};
				FileUtils.writeFile(userKeyInfos, "userkeyinfo.json");
				$('.key').hide();
			}
			$.pullToRefreshDone('.pull-to-refresh-content');
		}
	});
}

//发现用户已经登录强制初始化用户信息
function initUserInfoAndUserKeyInfo() {
	api.setPrefs({
		key : 'hasRegist',
		value : false
	});
	api.setPrefs({
		key : 'hasLogon',
		value : false
	});
	api.setPrefs({
		key : 'memberid',
		value : 'memberid'
	});
	api.setPrefs({
		key : 'account',
		value : 'account'
	});
	api.setPrefs({
		key : 'nickname',
		value : 'nickname'
	});
	api.setPrefs({
		key : 'telphone',
		value : 'telphone'
	});

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
	//强退时清除门禁信息
	api.accessNative({
		name : 'logout',
		extra : { }
	}, function(ret, err) {
		if (ret) {
			//                                     api.hideProgress();
			//                                     alert(JSON.stringify(ret));
		} else {
			//                                     api.hideProgress();
			//                                     alert(JSON.stringify(err));
		}
	});

	//用户的钥匙
	var userkeyinfo = {};
	FileUtils.writeFile(userInfo, "info.json", function() {
		FileUtils.writeFile(userkeyinfo, "userkeyinfo.json", function() {
			$('.key').hide();
			readUserInfoAndKeyInfo();

		});
	});

}

/**
 * 开门按钮动画效果
 */
function close() {
	var i = 0;
	var max = 4;
	x = setInterval(function() {
		document.getElementById("mm").src = "../image/n" + (i % max + 1) + ".png";
		i++;
	}, 500);
}

//------------------------------新闻列表方法--------------------------------------------------------------

/**
 * 加载news.json中的新闻信息
 * @param newsdata 新闻数据json串
 */
function loadmainNews(newsdata) {
	var screenWidth = api.screenWidth;
	//根据新闻类型遍历json
	for (var j = 0; j < newsdata.length; j++) {
		//获取新闻类型
		var newstype = newsdata[j].dsName;
		//获取当前类的新闻列表
		var rows = newsdata[j].rows;
		for (var k = 0; k < rows.length; k++) {
			for (var i = 0; i < newsTypes.length; i++) {
				if (newsdata[j].dsName == newsTypes[i]) {
					//获取新闻对象
					var row = rows[k];
					if (k == 0) {
						newsFirstByType(newstype);
					}
					//设置发布时间
					$api.text($api.byId(newstype + 'NewsTime' + (k + 2)), row.issuetime);
					//设置图片
					if (row.imgurl == undefined || row.imgurl == null || row.imgurl == '') {
						$api.attr($api.byId(newstype + 'NewsImg' + (k + 2)), 'src', 'http://pic002.cnblogs.com/images/2011/358804/2011122613501726.jpg');
					} else {
						$api.attr($api.byId(newstype + 'NewsImg' + (k + 2)), 'src', rootUrl + row.imgurl);
					}
					//设置新闻id
					$api.val($api.byId(newstype + 'NewsFid' + (k + 2)), row.fid);
					//新闻标题

					if (screenWidth == '320') {
						row.title = row.title.substring(0, 20) + "......";
					} else {
						row.title = row.title.substring(0, 22) + "......";
					}

					var title_news = row.title.length;

					$api.text($api.byId(newstype + 'NewsTitle' + (k + 2)), row.title);
					//评论数
					$api.text($api.byId(newstype + 'NewBmessage' + (k + 2)), row.feedcount);

				}
			}
		}
	}
}

/**
 *
 * @param newstype 根据新闻类型加载置顶新闻
 */
function newsFirstByType(newstype) {
	var newsData;
	AjaxUtil.exeScript({
		script : "managers.news.newslist",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "newsFirstByType",
		form : {
			typeid : newstype
		},
		success : function(data) {
			if (data.execStatus === "true" && data.datasources[0].rows.length > 0) {
				newsData = data.datasources[0].rows[0];
				//设置图片
				if (newsData.imgurl == undefined || newsData.imgurl == null || newsData.imgurl == '') {
					$api.attr($api.byId(newstype + 'NewsImg1'), 'src', 'http://pic002.cnblogs.com/images/2011/358804/2011122613501726.jpg');
				} else {
					$api.attr($api.byId(newstype + 'NewsImg1'), 'src', rootUrl + newsData.imgurl);
				}
				//设置新闻id
				$api.val($api.byId(newstype + 'NewsFid1'), newsData.fid);
				//新闻标题
				$api.text($api.byId(newstype + 'NewsTitle1'), newsData.title);
				//评论数
				$api.text($api.byId(newstype + 'NewBmessage1'), newsData.feedcount);
			}
		}
	});
}

///**
// * 加载news.json中的新闻信息
// * @param newsdata 新闻数据json串
// */
//function loadmainNews(newsdata) {
//	//根据新闻类型遍历json
//	for (var j = 0; j < newsdata.length; j++) {
//		//获取新闻类型
//		var newstype = newsdata[j].dsName;
//		//获取当前类的新闻列表
//		var rows = newsdata[j].rows;
//		for (var k = 0; k < rows.length; k++) {
//			for (var i = 0; i < newsTypes.length; i++) {
//				if (newsdata[j].dsName == newsTypes[i]) {
//					//获取新闻对象
//					var row = rows[k];
//					if (k != 0) {
//						//设置发布时间
//						$api.text($api.byId(newstype + 'NewsTime' + (k + 1)), row.issuetime);
//					}
//					//设置图片
//					if (row.imgrul == undefined || row.imgrul == null || row.imgrul == '') {
//						$api.attr($api.byId(newstype + 'NewsImg' + (k + 1)), 'src', 'http://pic002.cnblogs.com/images/2011/358804/2011122613501726.jpg');
//					} else {
//						$api.attr($api.byId(newstype + 'NewsImg' + (k + 1)), 'src', row.imgrul);
//					}
//					//设置新闻id
//					$api.val($api.byId(newstype + 'NewsFid' + (k + 1)), row.fid);
//					//新闻标题
//					$api.text($api.byId(newstype + 'NewsTitle' + (k + 1)), row.title);
//					//评论数
//					$api.text($api.byId(newstype + 'NewBmessage' + (k + 1)), row.supportcount);
//				}
//			}
//		}
//	}
//}

/**
 *
 */
function writeandreadNews() {
	AjaxUtil.exeScript({
		script : "managers.news.newslist",
		needTrascation : false,
		funName : "loadmainNews",
		success : function(data) {
			newsInfos = data.datasources;
			FileUtils.writeFile(newsInfos, "news.json");
			FileUtils.readFile("news.json", function(data) {
				if (data != undefined) {
					loadmainNews(data);
				}
			});
		}
	});
}

/**
 *写入新闻信息到news.json
 */
function writeNews() {
	AjaxUtil.exeScript({
		script : "managers.news.newslist",
		needTrascation : false,
		funName : "loadmainNews",
		success : function(data) {
			newsInfos = data.datasources;
			FileUtils.writeFile(newsInfos, "news.json");
		}
	});
}

/**
 * 根据新闻类型刷新主页新闻列表
 * @param newstype 新闻类型
 */
function newsListPage(newstype) {

	connectionType = api.connectionType;
	//比如： wifi
	if (connectionType == 'none' || connectionType == "unknown") {
		api.alert({
			msg : '当前网络不可用'
		}, function(ret, err) {

		});
		return false;
	}

	//写入新闻信息到news.json
	writeNews();
	//获取当前页数
	var page = $api.attr($api.byId(newstype + 'NewsPage'), 'abbr');
	page++;
	//设置新闻页数
	$api.attr($api.byId(newstype + 'NewsPage'), 'abbr', page);
	//刷新新闻列表
	newsListexeScript(newstype, page);
}

/**
 * 根据新闻类型获  第N页，取新闻数据，并填充到首页列表（按照时间排序 4条）
 * @param newstype  新闻类型
 * @param page     第几页
 */
function newsListexeScript(newstype, page) {

	var screenWidth = api.screenWidth;
	api.showProgress();
	AjaxUtil.exeScript({
		script : "managers.news.newslist",
		needTrascation : false,
		funName : "listForapp",
		form : {
			typeid : newstype,
			p : page
		},
		success : function(data) {
			api.hideProgress();
			//获取新闻总数
			var count = data.datasources[0].rowCount;
			//设置新闻总页数
			var countpage = 0;
			//根据每页长度取模
			var mo = count % 4;
			//取总页数
			if (mo != 0) {
				countpage = (count - mo) / 4
			} else {
				countpage = count / 4
			}
			//判断当前要跳转的页数是否大于总页数
			if (page > countpage) {
				//提示新闻已经展示到尾部
				api.alert({
					title : '提示',
					msg : '该类新闻已经展示到尾部,接下来将从头开始！',
				}, function(ret, err) {
				});
				//				//获取第一页新闻
				//				newsListexeScript(newstype, 1);
				//读取news.json中的新闻列表
				FileUtils.readFile("news.json", function(data) {
					loadmainNews(data);
				});
				//设置页码为1
				$api.attr($api.byId(newstype + 'NewsPage'), 'abbr', 1);
				return false;
			}
			//新闻数据
			rows = data.datasources[0].rows;
			for (var j = 0; j < rows.length; j++) {
				var row = rows[j];
				for (var i = 0; i < newsTypes.length; i++) {
					if (newstype == newsTypes[i]) {
						if (j != 0) {
							//发布时间
							$api.text($api.byId(newstype + 'NewsTime' + (j + 2)), row.issuetime);
						}
						//新闻图片
						if (row.imgurl == undefined || row.imgurl == null || row.imgurl == '') {
							$api.attr($api.byId(newstype + 'NewsImg' + (j + 2)), 'src', 'http://pic002.cnblogs.com/images/2011/358804/2011122613501726.jpg');
						} else {
							$api.attr($api.byId(newstype + 'NewsImg' + (j + 2)), 'src', rootUrl + row.imgurl);
						}
						//新闻id
						$api.val($api.byId(newstype + 'NewsFid' + (j + 2)), row.fid);
						//新闻标题
						if (screenWidth == '320') {
							row.title = row.title.substring(0, 20) + "......";
						} else {
							row.title = row.title.substring(0, 22) + "......";
						}
						$api.text($api.byId(newstype + 'NewsTitle' + (j + 2)), row.title);
						//评论总数
						$api.text($api.byId(newstype + 'NewBmessage' + (j + 2)), row.feedcount);
					}
				}

			}

		}
	});
}

/**
 * 点击新闻，进入新闻详情
 * @param {Object} th 当前点击对象
 */
function newsdetails(th) {
	//获取点击对象
	var el = $api.first(th, 'input');
	//获取新闻id
	var fid = $api.val(el);
	api.openWin({
		//打开新闻详情界面
		name : 'newsinfo',
		url : 'news/newsinfo.html',
		pageParam : {
			fid : fid
		},
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}

/**
 *下拉刷新新闻列表
 */
function selectNewsList() {
	//从数据库中查询主页新闻列表
	for (var i = 0; i < newsTypes.length; i++) {
		var newstype = newsTypes[i];
		//根据新闻发布时间刷新新闻列表
		newsListexeScript(newstype, 1);
		//设置为第一页
		$api.attr($api.byId(newstype + 'NewsPage'), 'abbr', 1);
	}
}

/**
 *点击获取更多新闻
 * @param {Object} th 点击对象
 */
function selectMoreNews(th) {

	connectionType = api.connectionType;
	//比如： wifi
	if (connectionType == 'none' || connectionType == "unknown") {
		api.alert({
			msg : '当前网络不可用'
		}, function(ret, err) {

		});
		return false;
	}

	var typeid = $api.attr(th, 'abbr');
	api.openWin({
		name : 'news',
		url : 'news/news.html',
		pageParam : {
			typeid : typeid
		},
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}

/**
 *重新读取信息更新页面register.js,login.js调用了此方法
 */
function setUserKeyInfos() {
	//读取info.json文件：
	FileUtils.readFile("info.json", function(info, err) {
		if (info.location.address != "") {
			$("#location").html(info.location.address);
		}
		userInfo = info;

		//通过baidumap重新定位
		loadLocationFormMap("yes");
	});
}

/**
 *从后台重新获取钥匙信息
 */
function refreshUserKeyInfo() {
	//从后台获取钥匙信息
	AjaxUtil.exeScript({
		script : "login.login", //need to do
		needTrascation : false,
		funName : "refreshPageInitInfo",
		form : {
			userId : userInfo.memberid
		},
		success : function(data) {
			if (data.execStatus === "true" && data.datasources[0].rows.length > 0) {
				var keyInfos = '{"keyinfos":' + $api.jsonToStr(data.datasources[0].rows) + '}';
				userKeyInfos = $api.strToJson(keyInfos);
				FileUtils.writeFile(userKeyInfos, "userkeyinfo.json");
				showKey();
			} else {
				userKeyInfos = {};
				FileUtils.writeFile(userKeyInfos, "userkeyinfo.json");
				$('.key').hide();
			}
		}
	});

}

/**
 * 隐藏开门动画显示开门按钮
 */
function showKey() {
	clearInterval(x);
	$('.openDoor').hide();
	$('.key').show();
}

/**
 * 从地图中加载位置
 */
function loadLocationFormMap(remind) {
	var lat;
	var lon;
	var Url;
	cityname = api.getPrefs({
		sync : true,
		key : 'cityname'
	});
	//获取经纬度
	var nowlon;
	var nowlat;
	bMap.getLocation({
		accuracy : '100m',
		autoStop : true,
		filter : 1
	}, function(ret, err) {
		if (ret.status) {
			nowlat = ret.lat;
			nowlon = ret.lon;

			// 创建地址解析器实例，使用的时百度js api
			var point = new BMap.Point(nowlon, nowlat);
			var geoc = new BMap.Geocoder();
			geoc.getLocation(point, function(rs) {
				var addComp = rs.addressComponents;
				var address = addComp.district + addComp.street + addComp.streetNumber;
				/**
				 *当前定位城市和选择城市重复的时候,使用当前定位结果
				 */
				if (rs.address.indexOf(cityname) >= 0) {
					getLonAndLat();
				} else {
					if (api.systemType == 'ios') {
						Url = "http://api.map.baidu.com/geocoder?address=" + cityname + "&output=json&key=QvDbrHPdxEEUHzzBY46xTX2A";
					} else {
						Url = "http://api.map.baidu.com/geocoder?address=" + cityname + "&output=json&key=T4z2UcibGDBOQaXhjB5zC8hU";
					}
					api.ajax({
						url : Url,
						method : 'get'
					}, function(ret, err) {
						if (ret) {
							if (ret.status == "OK") {
								if (ret.result.length == 0) {
									$("#location").html(cityname);
									if (remind == 'no') {
										api.alert({
											title : "提示",
											msg : "无法获取该城市天气！"
										});
									}

								} else {
									lat = ret.result.location.lat;
									lon = ret.result.location.lng;
									userInfo.location.lon = lon;
									userInfo.location.lat = lat;
									userInfo.location.address = cityname;
									FileUtils.writeFile(userInfo, "info.json");
									$("#location").html(cityname);
									getCurrentWeatherAndForecast(lon, lat);
								}
							}
						} else {
							api.alert({
								msg : "地址获取失败！"
							});
						}
					});
				}

			});
		} else {
			api.alert({
				msg : "定位失败，请检查手机设置"
			});
		}
	});

}

/**
 *根据百度地图模块获取经纬度
 */
function getLonAndLat() {
	//读取地图位置
	bMap.getLocation({
		accuracy : '100m',
		autoStop : true,
		filter : 1
	}, function(ret, err) {
		if (ret.status) {
			lat = ret.lat;
			lon = ret.lon;
			userInfo.location.lon = lon;
			userInfo.location.lat = lat;
			FileUtils.writeFile(userInfo, "info.json");
			getNameFromLocation(lon, lat);
		} else {
			api.alert({
				title : "提示",
				msg : "定位失败，请检查手机设置"
			});
		}
	});

}

/**
 * 根据定位获得名字
 * @param {Object} lon 经度
 * @param {Object} lat 纬度
 */
function getNameFromLocation(lon, lat) {

	// 创建地址解析器实例，使用的时百度js api
	var point = new BMap.Point(lon, lat);
	var geoc = new BMap.Geocoder();

	geoc.getLocation(point, function(rs) {
		var addComp = rs.addressComponents;
		var address = addComp.district + addComp.street + addComp.streetNumber;
		userInfo.location.address = address;

		$("#location").html(address);
		api.setPrefs({
			key : 'nowaddr',
			value : address
		});
		api.setPrefs({
			key : 'nowLon',
			value : lon
		});
		api.setPrefs({
			key : 'nowLat',
			value : lat
		});
		//重新写入文件
		//InfoUtil.writeUserInfo(userInfo);
		FileUtils.writeFile(userInfo, "info.json");
	});

	getCurrentWeatherAndForecast(lon, lat);

}

/**
 * 为指定的位置替换skycon
 */
function replaceSkycon(elementId, skycon) {
	if (skycon == "CLEAR_DAY" || skycon == "CLEAR_NIGHT") {
		$("#" + elementId).html("晴<img src='../image/clear_day1.png'/>");
	} else if (skycon == "PARTLY_CLOUDY_DAY" || skycon == "PARTLY_CLOUDY_NIGHT") {
		$("#" + elementId).html("多云<img src='../image/partly_cloudy_day1.png'/>");
	} else if (skycon == "CLOUDY") {
		$("#" + elementId).html("阴<img src='../image/cloudy_day1.png'/>");
	} else if (skycon == "RAIN") {
		$("#" + elementId).html("雨<img src='../image/rain_day1.png'/>");
	} else if (skycon == "SLEET") {
		$("#" + elementId).html("冻雨<img src='../image/sleet_day1.png'/>");
	} else if (skycon == "SNOW") {
		$("#" + elementId).html("雪<img src='../image/snow_day1.png'/>");
	} else if (skycon == "WIND") {
		$("#" + elementId).html("风<img src='../image/wind_day1.png'/>");
	} else if (skycon == "FOG") {
		$("#" + elementId).html("雾<img src='../image/fog_day1.png'/>");
	} else if (skycon == "HAZE") {
		$("#" + elementId).html("霾<img src='../image/haze_day1.png'/>");
	}

	return $("#" + elementId).html();
}

/**
 * 获得当前天气和3天的天气预报
 * @param {Object} lon 经度
 * @param {Object} lat  纬度
 */
function getCurrentWeatherAndForecast(lon, lat) {
	//天气预报
	var forecastUrl = "https://api.caiyunapp.com/v2/86KXV9NFzE9Urpn1/" + lon + "," + lat + "/forecast.json";
	$.ajax({
		type : "GET",
		url : forecastUrl,
		success : function(data) {
			if (data.status == "ok") {

				var daily = data.result.daily;
				//未来10分钟的天气描述
				var minuteDescription = data.result.minutely.description;
				//未来24小时的天气描述
				var hourDescription = data.result.hourly.description;

				var tempMinToday = daily.temperature[0].min.toString();
				var tempMaxToday = daily.temperature[0].max.toString();
				var tempMinTomorrow = daily.temperature[1].min.toString();
				var tempMaxTomorrow = daily.temperature[1].max.toString();
				var tempMinAfter = daily.temperature[2].min.toString();
				var tempMaxAfter = daily.temperature[2].max.toString();

				if (tempMinToday.indexOf(".") != -1) {
					tempMinToday = tempMinToday.substring(0, tempMinToday.indexOf("."));
				}
				if (tempMaxToday.indexOf(".") != -1) {
					tempMaxToday = tempMaxToday.substring(0, tempMaxToday.indexOf("."));
				}
				if (tempMinTomorrow.indexOf(".") != -1) {
					tempMinTomorrow = tempMinTomorrow.substring(0, tempMinTomorrow.indexOf("."));
				}
				if (tempMaxTomorrow.indexOf(".") != -1) {
					tempMaxTomorrow = tempMaxTomorrow.substring(0, tempMaxTomorrow.indexOf("."));
				}
				if (tempMinAfter.indexOf(".") != -1) {
					tempMinAfter = tempMinAfter.substring(0, tempMinAfter.indexOf("."));
				}
				if (tempMaxAfter.indexOf(".") != -1) {
					tempMaxAfter = tempMaxAfter.substring(0, tempMaxAfter.indexOf("."));
				}

				var todayTemperature = tempMinToday + "~" + tempMaxToday + "°";
				var tomorrowTemperature = tempMinTomorrow + "~" + tempMaxTomorrow + "°";
				var afterTomorrowTemperature = tempMinAfter + "~" + tempMaxAfter + "°";

				//为今日、明日、后日的天气概况赋值
				var todaySkycon = replaceSkycon("todaySky", daily.skycon[0].value);
				var tomorrowSkycon = replaceSkycon("tomorrowSky", daily.skycon[1].value);
				var afterTomorrowSkycon = replaceSkycon("afterTomorrowSky", daily.skycon[2].value);

				//今天温度
				$("#todayTemperature").html(todayTemperature);
				//明日温度
				$("#tomorrowTemperature").html(tomorrowTemperature);
				//后日温度
				$("#afterTomorrowTemperature").html(afterTomorrowTemperature);
				//今日最高温度
				$("#maxTemperature").html(tempMaxToday + "°");

				$("#minTemperature").html(tempMinToday + "°");
				//当前天气
				$("#discription").html(minuteDescription);
				//未来24小时天气
				$("#hourDescription").html(hourDescription);

				//为weatherInfo内赋值
				weatherInfo.todayTemperature = todayTemperature;
				weatherInfo.tomorrowTemperature = tomorrowTemperature;
				weatherInfo.afterTomorrowTemperature = afterTomorrowTemperature;
				weatherInfo.currentMax = tempMaxToday;
				weatherInfo.currentMin = tempMinToday;
				weatherInfo.todayHint = minuteDescription;
				weatherInfo.hourDescription = hourDescription;
				weatherInfo.todaySkycon = todaySkycon;
				weatherInfo.tomorrowSkycon = tomorrowSkycon;
				weatherInfo.afterTomorrowSkycon = afterTomorrowSkycon;

				FileUtils.writeFile(weatherInfo, "lastweather.json");

				//紫外线
				$("#ultraviolethint").html(daily.ultraviolet[0].desc);

				//太阳下山时间
				$("#sundown").html(daily.astro[0].sunset.time);

				//化妆指数
				if (data.result.daily.skycon[0].value == "CLEAR_DAY") {
					//晴天
					if (daily.ultraviolet[0].desc == "强") {
						$("#facehint").html("防紫外线");
					} else {
						var maxTemperature = daily.temperature[0].max;
						if (maxTemperature < 10) {
							$("#facehint").html("防晒");
						} else if (maxTemperature < 20) {
							$("#facehint").html("防晒保湿");
						} else {
							$("#facehint").html("控油");
						}
					}

				} else {
					//所有的非晴天
					$("#facehint").html("保湿");
				}
			}
		}
	});

	//实时天气
	var realtimeUrl = "https://api.caiyunapp.com/v2/86KXV9NFzE9Urpn1/" + lon + "," + lat + "/realtime.json";
	$.ajax({
		type : "GET",
		url : realtimeUrl,
		success : function(data) {
			if (data.status == "ok") {
				var realTemperature = data.result.temperature.toString();

				if (realTemperature.indexOf(".") > 0) {
					realTemperature = realTemperature.substring(0, realTemperature.indexOf("."));
				}

				var pm25 = data.result.pm25;
				var wind = data.result.wind.speed;
				var currentSkycon = data.result.skycon;
				//当前温度
				$("#currentTemperature").html(realTemperature + "°");

				//替换当前天气概况图记
				var now = new Date();
				var sunUp = new Date();
				sunUp.setHours(6);
				sunUp.setMinutes(30);
				var sunDown = new Date();
				sunDown.setHours(18);
				sunDown.setMinutes(30);

				var isNight = true;
				if (now > sunUp) {
					if (now < sunDown) {
						isNight = false
					}
				}
				//根据白天或晚上进行背景替换
				var cssDes = "";
				if (isNight) {
					if (currentSkycon == "CLEAR_DAY" || currentSkycon == "CLEAR_NIGHT") {
						cssDes = "url('../image/clear_night.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").show();
						//							$("#content").css("background", "url('../image/clear_night.png') no-repeat center");
					} else if (currentSkycon == "PARTLY_CLOUDY_DAY" || currentSkycon == "PARTLY_CLOUDY_NIGHT") {
						cssDes = "url('../image/partly_cloudy_night.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").show();
						//							$("#content").css("background", "url('../image/partly_cloudy_night.png') no-repeat center");
					} else if (currentSkycon == "CLOUDY") {
						cssDes = "url('../image/cloudy_night.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/cloudy_night.png') no-repeat center");
					} else if (currentSkycon == "RAIN") {
						cssDes = "url('../image/rain_night.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").show();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/rain_night.png') no-repeat center");
					} else if (currentSkycon == "SLEET") {
						cssDes = "url('../image/sleet_night.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").show();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/sleet_night.png') no-repeat center");
					} else if (currentSkycon == "SNOW") {
						cssDes = "url('../image/snow_night.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").show();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/snow_night.png') no-repeat center");
					} else if (currentSkycon == "WIND") {
						cssDes = "url('../image/wind_night.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/wind_night.png') no-repeat center");
					} else if (currentSkycon == "FOG") {
						cssDes = "url('../image/fog_night.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/fog_night.png') no-repeat center");
					} else if (currentSkycon == "HAZE") {
						cssDes = "url('../image/haze_night.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/haze_night.png') no-repeat center");
					}
				} else {
					if (currentSkycon == "CLEAR_DAY" || currentSkycon == "CLEAR_NIGHT") {
						cssDes = "url('../image/clear_day.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1 img").attr("src", "../image/temp/cloud02.png");
						$(".weather1").show();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("url('../image/clear_day.png') no-repeat center");
					} else if (currentSkycon == "PARTLY_CLOUDY_DAY" || currentSkycon == "PARTLY_CLOUDY_NIGHT") {
						cssDes = "url('../image/partly_cloudy_day.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1 img").attr("src", "../image/temp/cloud02.png");
						$(".weather1").show();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/partly_cloudy_day.png') no-repeat center");
					} else if (currentSkycon == "CLOUDY") {
						cssDes = "url('../image/cloudy_day.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1 img").attr("src", "../image/temp/cloudy_07.png");
						$(".weather1").show();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/cloudy_day.png') no-repeat center");
					} else if (currentSkycon == "RAIN") {
						cssDes = "url('../image/rain_day.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").show();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/rain_day.png') no-repeat center");
					} else if (currentSkycon == "SLEET") {
						cssDes = "url('../image/sleet_day.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").show();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/sleet_day.png') no-repeat center");
					} else if (currentSkycon == "SNOW") {
						cssDes = "url('../image/snow_day.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").show();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/snow_day.png') no-repeat center");
					} else if (currentSkycon == "WIND") {
						cssDes = "url('../image/wind_day.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1 img").attr("src", "../image/temp/cloud02.png");
						$(".weather1").show();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/wind_day.png') no-repeat center");
					} else if (currentSkycon == "FOG") {
						cssDes = "url('../image/fog_day.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						$(".weather1 img").attr("src", "../image/temp/cloud02.png");
						$(".weather1").show();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/fog_day.png') no-repeat center");
					} else if (currentSkycon == "HAZE") {
						cssDes = "url('../image/haze_day.png')";
						$(".backgroundImg").css("backgroundImage", cssDes);
						//						$(".weather1 img").attr("src", "../image/temp/haze01.png");
						$(".weather1").hide();
						$(".weather2").hide();
						$(".weather3").hide();
						$(".weather4").hide();
						//							$("#content").css("background", "url('../image/haze_day.png') no-repeat center");''
					}
				}
				//				$(".backgroundImg").css("backgroundImage", cssDes);
				//				$("#content").css("background", cssDes);
				//				$("#content").css("background-size", "cover");
				//穿衣指数
				if (data.result.temperature < -5) {
					$("#clouthhint").html("极寒");
				} else if (data.result.temperature < 0) {
					$("#clouthhint").html("严寒");
				} else if (data.result.temperature < 6) {
					$("#clouthhint").html("寒冷");
				} else if (data.result.temperature < 10.9) {
					$("#clouthhint").html("冷");
				} else if (data.result.temperature < 15) {
					$("#clouthhint").html("凉");
				} else if (data.result.temperature < 18) {
					$("#clouthhint").html("温凉");
				} else if (data.result.temperature < 21) {
					$("#clouthhint").html("凉舒适");
				} else if (data.result.temperature < 24) {
					$("#clouthhint").html("舒适");
				} else if (data.result.temperature < 28) {
					$("#clouthhint").html("热舒适");
				} else {
					$("#clouthhint").html("严热");
				}

				//钓鱼指数
				if (data.result.precipitation.local.intensity != 0) {
					$("#fishhint").html("不适宜");
				} else if (wind > 38) {
					$("#fishhint").html("不适宜");
				} else if (data.result.temperature < 5) {
					$("#fishhint").html("不适宜");
				} else if (data.result.temperature < 15) {
					$("#fishhint").html("较适宜");
				} else {
					$("#fishhint").html("适宜");
				}

				if (wind < 1) {//当前风速
					$("#wind").html("无风");
				} else if (wind < 5) {
					$("#wind").html("软风，1级");
				} else if (wind < 11) {
					$("#wind").html("轻风，2级");
				} else if (wind < 19) {
					$("#wind").html("微风，3级");
				} else if (wind < 28) {
					$("#wind").html("和风，4级");
				} else if (wind < 38) {
					$("#wind").html("清风，5级");
				} else if (wind < 49) {
					$("#wind").html("强风，6级");
				} else if (wind < 61) {
					$("#wind").html("疾风，7级");
				} else if (wind < 74) {
					$("#wind").html("大风，8级");
				} else if (wind < 88) {
					$("#wind").html("烈风，9级");
				} else if (wind < 102) {
					$("#wind").html("狂风，10级");
				} else if (wind < 117) {
					$("#wind").html("暴风，11级");
				} else {
					$("#wind").html("飓风，12级");
				}
				//空气质量和推荐活动
				if (pm25 < 50) {
					$("#pm25").html("空气质量：优");
					$("#recommend").html("推荐：好好哟，推荐户外运动");
					$("#sporthint").html("推荐");
				} else if (pm25 < 100) {
					$("#pm25").html("空气质量：良");
					$("#recommend").html("推荐：可以跑步啦");
					$("#sporthint").html("推荐");
				} else if (pm25 < 150) {
					$("#pm25").html("空气质量：轻度污染");
					$("#recommend").html("推荐：有点脏了，减少运动吧");
					$("#sporthint").html("减少");
				} else if (pm25 < 200) {
					$("#pm25").html("空气质量：中度污染");
					$("#recommend").html("推荐：咳，戴上口罩吧");
					$("#sporthint").html("室内");
				} else if (pm25 < 300) {
					$("#pm25").html("空气质量：重度污染");
					$("#recommend").html("推荐：最好别出门～");
					$("#sporthint").html("室内");
				} else {
					$("#pm25").html("空气质量：严重污染");
					$("#recommend").html("推荐：快快打开空气净化器");
					$("#sporthint").html("室内");
				}

				//为weatherinfo赋值
				weatherInfo.pm25 = pm25;
				weatherInfo.wind = wind;
				weatherInfo.currentTemperature = $("#currentTemperature").html();
				weatherInfo.recommend = $("#recommend").html();
				weatherInfo.backgroundCss = FileUtils.writeFile(weatherInfo, cssDes);
			}
		}
	});

}

function hideKey() {
	userInfo = {
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
	userKeyInfos = {};
	$(".key").hide();
}

function showKeyButton() {
	FileUtils.readFile("userkeyinfo.json", function(info, err) {
		if (info != null) {
			userKeyInfos = info;
		} else {
			userKeyInfos = {};
			$('.key').hide();
		}
	});
	$(".key").show();
}

function refresh() {
	location.reload();
}

function hidepot() {
	//	$('#msgnum').hide();
	msgnum = api.getPrefs({
		sync : true,
		key : 'msgnum'
	});
}

function setmsgnum() {
	//	//同步返回结果：
	msgnum = api.getPrefs({
		sync : true,
		key : 'msgnum'
	});
	//	if (msgnum == 0) {
	//		$('#msgnum').hide();
	//	} else {
	//		$('#msgnum').show();
	//		$('#msgnum').html(msgnum);
	//	}
}

function shakeopendoor() {
	ble.initManager(function(ret) {
		//判断当前蓝牙状态是否开启状态
		if (ret.state == "poweredOn") {
			$('.key').hide();
			$('.openDoor').show();
			close();

			var userKeyInfoStr = $api.jsonToStr(userKeyInfos);
			if (userKeyInfoStr != "{}") {
				//调用开门模块的开门方法进行开门
				openDoorModule.openDoor(userKeyInfos, function(ret, err) {
					//设置执行开门方法回调后延迟显示动画和提示信息
					setTimeout(function() {
						showKey();
						var showMsg = "";
						if (ret.result == "0") {
							showMsg = "开门成功!";
						} else if (ret.result == "-101") {
							openDoorModule.openDoor(userKeyInfos, function(ret, err) {
								if (ret.result == "0") {
									showMsg = "开门成功!";
								} else {
									showMsg = "开门失败,走进点儿再试试!";
								}
								if (showMsg != "") {
									//提示框
									api.toast({
										msg : showMsg,
										location : 'middle'
									});
								}
							});
						} else if (ret.result == "888") {
							showMsg = "周围没有设备,走进点儿再试试!";
						} else {
							showMsg = "开门失败,走进点儿再试试!";
						}
						if (showMsg != "") {
							//提示框
							api.toast({
								msg : showMsg,
								location : 'middle'
							});
						}
					}, 600);
				});
			} else {
				showKey();
				api.toast({
					msg : '没有您的钥匙信息!',
					location : 'middle'
				});
			}

		} else {
			api.toast({
				msg : "蓝牙没有打开,请先打开蓝牙再试试!",
				location : 'middle'
			});
		}
	});
}

/**
 *关闭摇一摇监听
 */
function removeshake() {
	api.removeEventListener({
		name : 'shake'
	});
}

function freshWeather() {
	connectionType = api.connectionType;
	//比如： wifi
	if (connectionType == 'none' || connectionType == "unknown") {
		api.alert({
			msg : '当前网络不可用'
		}, function(ret, err) {
			$.pullToRefreshDone('.pull-to-refresh-content');
		});
	} else {
		//重新加载天气预报
		$("#afterTomorrow").html(DateUtils.getWeekDay(2));
		$("#todayDay").html(DateUtils.getTodayDate());
		$("#todayWeek").html(DateUtils.getWeekDay(0));
		$("#cndate").html(DateUtils.getCNDate());
		if (isconn == 'false') {
			isconn = 'true';
			location.reload();
		} else {
			loadLocationFormMap("yes");
			//重新写入新闻的json
			writeandreadNews();
			readUserInfoAndKeyInfo();
			//获取手机的唯一标识
			var deviceId = api.deviceId;
			if (userInfo.memberid) {
				//用户当前登录状态时判断有没有其他手机登录如果有则退出当前用户刷新用户的相关初始化信息
				AjaxUtil.exeScript({
					script : "login.login", //need to do
					needTrascation : false,
					funName : "checkSingleLogin",
					form : {
						memberId : userInfo.memberid,
						deviceId : deviceId
					},
					success : function(data) {
						if (data.execStatus === "true" && data.formDataset.checked === "true") {
							api.alert({
								msg : '您的账号已在其他地方登陆,您被强制下线,如果不是您的个人行为请立即联系管理员,谢谢!'
							}, function(ret, err) {
								$.pullToRefreshDone('.pull-to-refresh-content');
								initUserInfoAndUserKeyInfo();
							});
						} else {
							refreshPageInitInfo(userInfo.memberid);
						}
					}
				});
			}
		}
	}

}

//检验是否有蛋
function isHaveEgg(urId) {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "checkIsHaveGoldEgg",
		form : {
			userNo : urId
		},
		success : function(data) {
			if (data.formDataset.checked == 'true') {
				if (data.formDataset.isHaveEgg == 'true') {
					isBeat(urId);
				} else {
					noEgg();
				}

			} else {
				//alert(data.formDataset.errorMsg);
			}
		}
	});
}

//检验是否可砸
function isBeat(urId) {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "checkIsBeatGoldEgg",
		form : {
			userNo : urId
		},
		success : function(data) {
			if (data.formDataset.checked == 'true') {
				if (data.formDataset.isBeat == 'true') {
					$('#mainEgg').show();
					$('.showCount').show();
					$('#mainEgg').attr('src', '../image/mainEgg.jpg');
				} else {
					noEgg();
				}

			} else {
				//	alert(data.formDataset.errorMsg);
			}
		}
	});
}

//没有金蛋方法
function noEgg() {
	$('#mainEgg').show();
	$('.showCount').show();
	$('#mainEgg').attr('src', '../image/mainEggGraey.jpg');
}

//点击金蛋进行跳转
$('#mainEgg').click(function() {
	api.openWin({
		name : 'myegg',
		url : 'wallet/myegg.html',
		reload : true,
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
})
//点击金蛋进行跳转
$('#showbus').click(function() {
	api.openWin({
		name : 'busList',
		url : '../shangjia/html/buyList.html',
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
})
