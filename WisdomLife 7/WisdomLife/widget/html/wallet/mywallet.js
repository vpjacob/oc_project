var yestbean;
//上个激励日获得信使豆
var returndatestr;
//上次激励日期
var rewardbean;
//注册奖励
var heat;
//爱心数
var surplusbean;
//普通信使豆
var nopaybean;
//待交税信使豆
var memberid;

//其中，IOS状态栏高度为20px，Android为25px
var headerH;
//footer高度为css样式中声明的30px
var footerH;
//frame的高度为当前window高度减去header和footer的高度
var frameH;

apiready = function() {
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


	memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
	var telphone = api.getPrefs({
		sync : true,
		key : 'telphone'
	});
	var membercode = api.getPrefs({
		sync : true,
		key : 'membercode'
	});
	var referrer = api.getPrefs({
		sync : true,
		key : 'referrer'
	});
	var referrerName = api.getPrefs({
		sync : true,
		key : 'referrerName'
	});

	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var content = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
	}
	api.showProgress();
	api.ajax({
		url : rootUrl + '/api/commmonweal/mywallet',
		method : 'post'
	}, function(ret, err) {
		if (ret) {
			if (ret.execStatus == "true") {
				var result = ret.formDataset.entity;
				yestbean = result.yestbean;
				returndatestr = result.returndatestr;
				rewardbean = result.rewardbean;
				heat = result.heat;
				surplusbean = result.surplusbean;
				nopaybean = result.nopaybean;
				$("#getdot").html(yestbean);
				$("#returndatestr").html(returndatestr);
				$("#rewardbean").html(rewardbean);
				api.setPrefs({
					key : 'hartcount',
					value : heat
				});
				api.setPrefs({
					key : 'ordinarybean',
					value : surplusbean
				});
				api.setPrefs({
					key : 'wptbean',
					value : nopaybean
				});
				//更新我的界面数据
				api.execScript({
					sync : true,
					name : 'root',
					frameName : 'room',
					script : 'udateBeans()'
				});
				AjaxUtil.exeScript({
					script : "managers.mywallet.mywallet",
					needTrascation : true,
					funName : "updateWallet",
					form : {
						memberid : memberid,
						hartcount : parseFloat(heat.split(",").join("")),
						wptbean : parseFloat(nopaybean.split(",").join("")),
						ordinarybean : parseFloat(surplusbean.split(",").join("")),
					},
					success : function(data) {
						api.hideProgress();
						if (data.execStatus == "true") {
						} else {
							api.alert({
								msg : "数据请求失败，请重试"
							});
						}
					}
				});
			} else {
				api.hideProgress();
				api.toast({
					msg : "数据请求失败，请重试"
				});
			}
		} else {
			api.hideProgress();
			api.toast({
				msg : "数据请求失败，请重试"
			});
		}
	});
	//	AjaxUtil.exeScript({
	//		script : "managers.mywallet.mywallet",
	//		needTrascation : true,
	//		funName : "getwalletInfo",
	//		form : {
	//			memberid : 3
	//		},
	//		success : function(data) {
	//			//		alert($api.jsonToStr(data));
	//		}
	//	});
	$(document).on('click', '#mylove', function() {
		api.openWin({
			name : 'mylove',
			url : 'mylove.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$(document).on('click', '#mydot', function() {
		api.openWin({
			name : 'mydot',
			url : 'mydot.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$(document).on('click', '#dotrecord', function() {
		api.openWin({
			name : 'dotrecord',
			url : 'dotrecord.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$(document).on('click', '#buyback', function() {
		api.openWin({
			name : 'buyback',
			url : 'buyback.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$(document).on('click', '#xiaoxi', function() {
		api.openWin({
			name : 'xiaoxi',
			url : 'xiaoxi.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$(document).on('click', '#todaystimulate', function() {
		api.openWin({
			name : 'todaystimulate',
			url : 'todaystimulate.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$(document).on('click', '#recommend', function() {
		$('#photo').show();
	});
	$(document).on('click', '.share_sub', function() {
		$('#photo').hide();
	});

	//从数据库获取推荐人信息====end
	$("#qq_share").bind("click", function() {
		var qq = api.require('qq');
		qq.installed(function(ret, err) {
			if (ret.status) {
				$('#photo').hide();
				qq.shareNews({
					type : 'QFriend',
					url : rootUrl + "/jsp/share?membercode=" + membercode + "&telphone=" + telphone + "&referrer=" + referrer + "&referrerName=" + referrerName + "&memberid=" + memberid,
					title : '小客智慧生活',
					description : '史上最好用的物业管理软件，快来下载吧！！！',
					imgUrl : 'http://www.ppke.cn:8080/qrcode/a.png'
					//					imgUrl : 'widget://image/a.png'
					//					imgUrl : ''
				}, function(ret, err) {
					if (ret.status) {
						api.alert({
							msg : "分享成功！"
						});
					} else {
						//						api.alert({
						//							msg : JSON.stringify(err)
						//						});
					}
				});
			} else {
				api.alert({
					msg : "当前设备未安装QQ客户端"
				});
			}
		});
	});
	$("#wx_share").bind("click", function() {
		var wx = api.require('wx');
		wx.isInstalled(function(ret, err) {
			if (ret.installed) {
				$('#photo').hide();
				wx.shareWebpage({
					apiKey : '',
					scene : 'session',
					title : '小客智慧生活',
					description : '史上最好用的物业管理软件，快来下载吧！！！',
					thumb : 'widget://image/a.png',
					contentUrl : rootUrl + "/jsp/share?membercode=" + membercode + "&telphone=" + telphone + "&referrer=" + referrer + "&referrerName=" + referrerName + "&memberid=" + memberid,
				}, function(ret, err) {
					if (ret.status) {
						api.alert({
							msg : "分享成功！"
						});
					} else {
						//						alert(err.code);
					}
				});
			} else {
				api.alert({
					msg : "当前设备未安装微信客户端"
				});
			}
		});

	});
	$("#sms_share").bind("click", function() {
		api.sms({
			text : '史上最好用的物业管理软件，快来下载吧！！！' + rootUrl + "/jsp/share?membercode=" + membercode + "&telphone=" + telphone + "&referrer=" + referrer + "&referrerName=" + referrerName + "&memberid=" + memberid,
		}, function(ret, err) {
			if (ret && ret.status) {
				//已发送
				$('#photo').hide();
			} else {
				//发送失败
			}
		});

	});
	$("#back").on('click', function() {
		api.closeWin();
	});

	$("#weather").bind("click", function() {
	    $(this).addClass('changeCor').siblings().removeClass('changeCor');
		api.closeToWin({
			name : 'root'
		});
		
		api.execScript({
			sync : true,
			name : 'root',
			script : 'openWeatherPage()'
		});

	});
	$("#neighbours").bind("click", function() {
	    $(this).addClass('changeCor').siblings().removeClass('changeCor');
		api.closeToWin({
			name : 'root'
		});
		
		api.execScript({
			sync : true,
			name : 'root',
			script : 'openNeighboursPage()'
		});

	});
	
	
	$("#around").bind("click", function() {
	    $(this).addClass('changeCor').siblings().removeClass('changeCor');
		api.closeToWin({
			name : 'root'
		});
		
		api.execScript({
			sync : true,
			name : 'root',
			script : 'showAround("#around")'
		});
	});
	
	$("#center").bind("click", function() {
	    $(this).addClass('changeCor').siblings().removeClass('changeCor');
		api.closeToWin({
			name : 'root'
		});
		
		api.execScript({
			sync : true,
			name : 'root',
			script : 'openCenterPage("#center")'
		});
		
	});
	
	
	$("#shop").bind("click", function() {
	    $(this).addClass('changeCor').siblings().removeClass('changeCor');
		api.openFrame({
		name : 'commonProvider',
		url : '../commonweal/commonProvider.html',
		bounces : false,
		rect : {
			x : 0,
			y : headerH,
			w : 'auto',
			h : frameH
		}
	});
	
	$("#neighbours").bind("click", function() {
	    $(this).addClass('changeCor').siblings().removeClass('changeCor');
		api.closeToWin({
			name : 'root'
		});
		
		api.execScript({
			sync : true,
			name : 'root',
			script : 'openNeighboursPage("#neighbours")'
		});
		
	});
		
	});
}
