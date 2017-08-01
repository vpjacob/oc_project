var memberid;
var code;
var wait = 60;
//用户信息
var userInfo = {
};
var satatus;
var isIos=false;
var urId='';
apiready = function() {
    memberid = api.pageParam.memberid;
    urId = api.pageParam.uer;
    if(urId.indexOf("V")==0){
    	$('#wanshan').css("display", "");
    	$('#hidePwd').css("display", "");
    }
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
		isIos=true;
	}
	var telphone = api.getPrefs({
		sync : true,
		key : 'telphone'
	});
	var referrer = api.getPrefs({
		sync : true,
		key : 'referrer'
	});
	var referrerName = api.getPrefs({
		sync : true,
		key : 'referrerName'
	});
	var membercode = api.getPrefs({
		sync : true,
		key : 'membercode'
	});
	
	getUesrInfo();
	$("#messageStatus").prop("checked", satatus);
	$("#messageStatus").bind("change", function() {
		var messageStatus = $("#messageStatus").prop("checked");
		AjaxUtil.exeScript({
			script : "mobile.center.message.message",
			needTrascation : true,
			funName : "changeStatus",
			form : {
				memberid : memberid,
				messageStatus : messageStatus
			},
			success : function(data) {
				if (data.execStatus == 'true') {
					api.toast({
						msg : '设置成功',
						duration : 2000,
						location : 'bottom'
					});
				} else {
					api.alert({
						msg : '系统出错,请您从新设置!'
					}, function(ret, err) {
						//coding...
					});
				}
			}
		});
	})
	
	$("#mymessage").bind("click", function() {
		api.openWin({//打开我的房间界面
			name : 'content',
			url : '../personal/content.html',
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
	});
	
	//退出登录
	$('#logout').click(function() {
		//把之前新闻页面跳转登录的状态改变
		api.setPrefs({
			key : 'isnew',
			value : false
		});
		//修改用户的扩展信息,更新用户的极光唯一标识
		AjaxUtil.exeScript({
			script : "login.login",
			needTrascation : false,
			funName : "updateMemberExtra",
			form : {
				memberid : memberid
			},
			success : function(data) {
			}
		});
		initUserInfoAndUserKeyInfo();
	});
	
	$("#getmark").bind("click", function() {//去评分
		var browser = api.require('webBrowser');
		if (isIos) {
			browser.open({
				url : 'https://itunes.apple.com/us/app/xiao-ke-zhi-hui-sheng-huo/id1182914885?l=zh&ls=1&mt=8'
			});
		} else {
			api.openApp({
				androidPkg : 'com.qihoo.appstore',
				mimeType : 'text/html',
				uri : 'http://zhushou.360.cn/detail/index/soft_id/3549854?recrefer=SE_D_%E6%99%BA%E6%85%A7%E7%94%9F%E6%B4%BB'
			}, function(ret, err) {
				if (ret) {

				} else {
					api.alert({
						msg : "您未安装360手机助手"
					});
				}
			});
		}

	});
	
	//修改密码
	$('#changePwd').click(function() {
		api.openWin({
			name : 'changepassword',
			url : '../personal/changepassword.html',
			reload : true,
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
	});
	
	$("#aboutus").bind("click", function() {
		api.openWin({//打开关于我们
			name : 'aboutus',
			url : '../personal/aboutus.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});

	$(document).on('click', '#shareAll', function() {
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
				}, function(ret, err) {
					if (ret.status) {
						api.alert({
							msg : "分享成功！"
						});
					} else {
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
						//alert(err.code);
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
}
function goback() {
	api.closeWin();
}

function closePage() {
	api.closeWin();
}

function showPro() {
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		text : '先喝杯茶...'
	});
}
function xiaoxi() {
	api.openWin({//打开意见反馈
		name : 'xiaoxi',
		url : '../home/xiaoxi.html',
		slidBackEnabled : true,
		pageParam : {
			memberid : memberid
		},
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}

function getUesrInfo() {
	api.showProgress();
	//获取设置推送是否开启
	AjaxUtil.exeScript({
		script : "mobile.center.message.message",
		needTrascation : false,
		funName : "getmessageStatus",
		form : {
			memberid : memberid
		},
		success : function(data) {
			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
				satatus = data.datasources[0].rows[0].messagestatus;
				$("#messageStatus").prop("checked", satatus);		
			} else {
				api.alert({
					msg : '获取个人信息失败,请您重新加载！'
				});
			}
			api.hideProgress();
		}
	})
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
	//用户的钥匙
	var userkeyinfo = {};
	FileUtils.writeFile(userInfo, "info.json");
	FileUtils.writeFile(userkeyinfo, "userkeyinfo.json", function() {
		api.execScript({
			sync : true,
			name : "root",
			frameName : 'weather',
			script : 'hideKey();'
		});
		api.hideProgress();
		//退出智果服务器
		api.accessNative({
		    name: 'logout',
		    extra: {
		        
		    }
		},
		function(ret,err){
		    if(ret){
		        //alert(JSON.stringify(ret));
		    }else{
		        //alert(JSON.stringify(err));
		    }
		});
		api.alert({
			title : '系统提示',
			msg : '已退出'
		}, function(ret, err) {
			name = "root";
			api.execScript({
				sync : true,
				name : "root",
				script : 'openmain();'
			});
			//			alert("关闭前");
			//			api.closeFrame({
			//				name : 'room'
			//			});
			api.execScript({
				sync : true,
				name : "root",
				frameName : 'room',
				script : 'close();'
			});
			//			alert("关闭后");
			api.closeToWin({
				name : name,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : 'from_right', //动画子类型（详见动画子类型常量）
					duration : 300
				}
			});
			setTimeout(function() {
				api.closeWin();
			}, 500);
		});
	});
}
