//其中，IOS状态栏高度为20px，Android为25px  
var headerH;
//footer高度为css样式中声明的30px.
var footerH;
//frame的高度为当前window高度减去header和footer的高度.
var frameH;
//用户信息
var userInfo = {};
//用户的钥匙
var userkeyinfo = {};

//用户信息
var userInfo1 = {
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

var systemType;
var hasLogon;
var ajpush;
var back_flag = 0;
apiready = function() {
	api.addEventListener({
            name : 'keyback'
        }, function(ret, err) {
            var setViewFun = '_auto517_pl_appback();';
            if(back_flag == 1){
                api.execScript({
	                name : 'root',
	                frameName : 'welcome',
	                script : setViewFun
	            });
            }else{
      			api.confirm({
				    title: '温馨提示',
				    msg: '确定退出该程序吗？',
				    buttons: ['确定', '取消']
				}, function(ret, err) {
				    if(ret.buttonIndex == 1){
				    	//清空当前的城市名字
				    	api.setPrefs({
							key : 'cityname',
							value : ''
						});
				    	api.closeWidget({
			                id : 'A6921550712789',
			                retData : {
			                    name : 'closeWidget'
			                },
			                silent : true
		            });
				    }
				});
            }
        });
	//云修复在线监听
	api.addEventListener({
		name : 'smartupdatefinish'
	}, function(ret, err) {
		api.alert({
			title : '更新提示',
			msg : '更新已完成，重启生效',
		}, function(ret, err) {
			api.rebootApp();
		});
	});
	
	//	检查版本更新
	var appLocation=api.appVersion;
//	alert(appVersion);
	function checkAppVersion() {
		AjaxUtil.exeScript({
			script : "login.login", //need to do
			needTrascation : false,
			funName : "checkAppVersion",
			form : {},
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.version;
					var list = $api.strToJson(account);
					var appServerIos = list.ios_version;
					var appServerAndroid =	list.android_version;
					//ios端更新
					if (api.systemType == 'ios') {
//						alert("appServerIos"+appServerIos+"appServerIosUrl"+list.ios_url+"updateTime"+list.update_time+"description"+list.description);
						if (appServerIos > appLocation) {
							api.confirm({
								title : '提示',
								msg : '下载新的版本',
								buttons : ['确定', '取消']
							}, function(ret, err) {
								var index = ret.buttonIndex;
								if (index == 1) {
									api.accessNative({
										name : 'update',
										extra : {
											appServerIos : appServerIos,
											appServerIosUrl :list.ios_url,
											updateTime:list.update_time,
											description:list.description
										}
									}, function(ret, err) {
										if (ret) {

										} else {

										}
									});
									api.closeWin({});
								} else if (index == 2) {
									api.closeWidget({
										silent : true
									});
								}
							});
						}
					};
					//Android更新
					if (api.systemType == 'android') {
//						alert("appServerAndroid"+appServerAndroid+"appServerAndroidUrl"+list.android_url+"updateTime"+list.update_time+"description"+list.description);
						if (appServerAndroid > appLocation) {
							api.confirm({
								title : '提示',
								msg : '更新版本吗？',
								buttons : ['确定', '取消']
							}, function(ret, err) {
								var index = ret.buttonIndex;
								if (index == 1) {
									api.accessNative({
										name : 'update',
										extra : {
											appServerAndroid : appServerAndroid,
											appServerAndroidUrl :list.android_url,
											updateTime:list.update_time,
											description:list.description
										}
									}, function(ret, err) {
										if (ret) {

										} else {

										}
									});
								} else if (index == 2) {
									api.closeWidget({
										silent : true
									});
								}
							});
						}
					}

				} else {
					 api.toast({
	                     msg:data.formDataset.errorMsg
                     });
				}
			},
		error : function() {
			api.toast({
	            msg:'您的网络不给力啊，检查下是否连接上网络了！'
            });
		}
		});
	}

	checkAppVersion();
	   //widget 实现砸蛋
    api.addEventListener({
                         name : 'eggs'
                         }, function(ret, err) {
                         var reqUrl = 'html/wallet/myegg.html';
                         var name = "scan";
                         //打开登陆界面
                         api.openWin({
                                     name : name,
                                     url : reqUrl,
                                     bounces : false,
                                     rect : {
                                     x : 0,
                                     y : headerH,
                                     w : 'auto',
                                     h : frameH
                                     },
                                     animation : {
                                     type : "push", //动画类型（详见动画类型常量）
                                     subType : 'from_right', //动画子类型（详见动画子类型常量）
                                     duration : 300
                                     }
                                     });
                         
                         });
    
    
    //widget 实现小客商城
    api.addEventListener({
                         name : 'shopping'
                         }, function(ret, err) {
                         var reqUrl = 'shangjia/html/buyList.html';
                         var name = "scan";
                         //打开登陆界面
                         api.openWin({
                                     name : name,
                                     url : reqUrl,
                                     bounces : false,
                                     rect : {
                                     x : 0,
                                     y : headerH,
                                     w : 'auto',
                                     h : frameH
                                     },
                                     animation : {
                                     type : "push", //动画类型（详见动画类型常量）
                                     subType : 'from_right', //动画子类型（详见动画子类型常量）
                                     duration : 300
                                     }
                                     });
                         
                         });
    //widget 实现行车记录仪
    api.addEventListener({
                         name : 'carRecoder'
                         }, function(ret, err) {
                         var reqUrl = 'html/equipment/allType.html';
                         var name = "scan";
                         //打开登陆界面
                         api.openWin({
                                     name : name,
                                     url : reqUrl,
                                     bounces : false,
                                     rect : {
                                     x : 0,
                                     y : headerH,
                                     w : 'auto',
                                     h : frameH
                                     },
                                     animation : {
                                     type : "push", //动画类型（详见动画类型常量）
                                     subType : 'from_right', //动画子类型（详见动画子类型常量）
                                     duration : 300
                                     }
                                     });
                         
                         });


//实现广告开屏跳转
    api.addEventListener({
                         name : 'startAdvertisement'
                         }, function(ret, err) {
                         
                         var da = ret.value;
                         var skipurl = da.skipUrl;
                         var skipNo = da.skipNo;
                         //                         alert(skipurl + skipNo);
                         
                         //                         var reqUrl = 'html/wallet/myegg.html';
                         var name = "startAdvertisement";
                         
                         
                         if (String(skipurl) == "000000") {
                         api.openFrame({//商家列表
                                       name : 'commonProvider',
                                       url : 'shangjia/html/newIndex.html',
                                       bounces : false,
                                       reload : true,
                                       rect : {
                                       x : 0,
                                       y : 0,
                                       w : 'auto',
                                       h : frameH + headerH,
                                       }
                                       });
                         
                         } else if(String(skipurl) == "111111") {
                         api.openWin({//商城列表
                                     name : 'busList',
                                     url : 'shangjia/html/buyList.html',
                                     slidBackEnabled : true,
                                     animation : {
                                     type : "push", //动画类型（详见动画类型常量）
                                     subType : "from_right", //动画子类型（详见动画子类型常量）
                                     duration : 300 //动画过渡时间，默认300毫秒
                                     }
                                     });
                         } else if(String(skipurl) == "222222") {
                         api.openWin({//金蛋商城列表
                                     name : 'eggstore',
                                     url : 'shangjia/eggstore/eggMain.html',
                                     slidBackEnabled : true,
                                     animation : {
                                     type : "push", //动画类型（详见动画类型常量）
                                     subType : "from_right", //动画子类型（详见动画子类型常量）
                                     duration : 300 //动画过渡时间，默认300毫秒
                                     }
                                     });
                         } else if(String(skipurl) == "333333") {
                         api.openWin({//积分商城列表
                                     name : 'integralStore',
                                     url : 'shangjia/integralStore/eggMain.html',
                                     slidBackEnabled : true,
                                     animation : {
                                     type : "push", //动画类型（详见动画类型常量）
                                     subType : "from_right", //动画子类型（详见动画子类型常量）
                                     duration : 300 //动画过渡时间，默认300毫秒
                                     }
                                     });
                         }else if(skipNo=="" || String(skipNo)=="null" || String(skipNo)=="undefined"){
                         api.confirm({
                                     title : '提示',
                                     msg : '您即将跳转到' + skipurl,
                                     buttons : ['确定', '取消']
                                     }, function(ret, err) {
                                     var index = ret.buttonIndex;
                                     if (index == 1) {
                                     var browser = api.require('webBrowser');
                                     browser.open({
                                                  url : skipurl
                                                  });
                                     }
                                     })
                         }else if(skipurl=="" || String(skipurl)=="null" || String(skipurl)=="undefined"){
                         //获取商品或商家id
                         queryGoodOrMerchantByNo(skipNo);
                         };
                         
                         });
    

	hasLogon = api.getPrefs({
	    sync:true,
	    key:'hasLogon'
    });


	//输出Log，Log将显示在APICloud Studio控制台
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
//	footerH = $("#footer").css("height").split("px")[0];
	footerH=50;
//	alert($("#footer").css("height").split("px")[0]);
	//frame的高度为当前window高度减去header和footer的高
	frameH = api.winHeight - headerH - footerH;

	api.setPrefs({
		key : 'headerH',
		value : headerH
	});
	api.setPrefs({
		key : 'footerH',
		value : footerH
	});
	api.setPrefs({
		key : 'frameH',
		value : frameH
	});
	
//	initFile();

	ajpush = api.require('ajpush');

	ajpush.init(function(ret) {
		api.addEventListener({
			name : 'pause'
		}, function(ret, err) {
			onPause();
			//监听应用进入后台，通知jpush暂停事件
		})

		api.addEventListener({
			name : 'resume'
		}, function(ret, err) {
			onResume();
			//监听应用恢复到前台，通知jpush恢复事件
		})
	});

	//	getUserInfo();

	//打开天气页面
	//		openWeatherPage();
	// 阻止首页弹动
	api.setWinAttr({
		bounces : false
	});

	// 欢迎页 framegroup
	var welcome = function() {
		// 欢迎页
		api.openFrameGroup({
			name : 'welcome',
			bounces : false,
			index : 0,
			rect : {
				x : 0,
				y : 0,
				w : 'auto',
				h : 'auto'
			},
			scrollEnabled : true,
			frames : [{
				name : 'welcome_1',
				url : './html/welcome/welcome.html',
				bounces : false,
				opaque : true,
				bgColor : 'widget://res/drawable-xhdpi/welcome_1.png'
			}, {
				name : 'welcome_2',
				url : './html/welcome/welcome.html',
				bounces : false,
				opaque : true,
				bgColor : 'widget://res/drawable-xhdpi/welcome_2.png'
			}, {
				name : 'welcome_3',
				url : './html/welcome/welcome.html',
				bounces : false,
				opaque : true,
				bgColor : 'widget://res/drawable-xhdpi/welcome_3.png'
			}, {
				name : 'welcome_4',
				url : './html/welcome/welcome.html',
				bounces : false,
				opaque : true,
				bgColor : 'widget://res/drawable-xhdpi/welcome_4.png',
				pageParam : true
			}]
		}, function(ret, err) {
			var index = ret.index;
			var name = ret.name;
			if (index == 3) {
				api.execScript({
					frameName : name,
					script : 'showNowRegistButton();'
				});
				$api.setStorage('firstStart', true);
			} else {
				if ($api.getStorage('firstStart') == "undefined") {
					api.execScript({
						frameName : name,
						script : 'hideNowRegistButton();'
					});
				}
			}
		});
	};
	var indexOrWelcome = function(fn) {
		if ($api.getStorage('firstStart')) {
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
			fn && fn();
		}
	};
	indexOrWelcome(welcome());

};

function onPause() {
	onResume();
}


function onResume() {
	ajpush.getRegistrationId(function(ret) {
		var registrationId = ret.id;
		api.setPrefs({
			key : 'registrationId',
			value : registrationId
		});
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
                     name: 'logout',
                     extra: { }
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
//		FileUtils.writeFile(userkeyinfo, "userkeyinfo.json", function() {
//			openWeatherPage();
//		});
		openWeatherPage();
	});

}

function getUserInfo() {		
	var hasRegist = api.getPrefs({
		sync : true,
		key : 'hasRegist'
	}); 
	var hasLogon = api.getPrefs({
		sync : true,
		key : 'hasLogon'
	}); 
	var memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	}); 
	var account = api.getPrefs({
		sync : true,
		key : 'account'
	}); 
	var nickname = api.getPrefs({
		sync : true,
		key : 'nickname'
	}); 
	var telphone = api.getPrefs({
		sync : true,
		key : 'telphone'
	}); 
	
	//是否已登录	
	if (String(hasLogon) == 'true') {

		//获取手机的唯一标识
		var deviceId = api.deviceId;
		var connectionType = api.connectionType;
		//比如： wifi
		if (connectionType == 'none' || connectionType == "unknown") {
//			api.alert({
//				msg : '当前网络不可用,请连上网络并刷新重试'
//			}, function(ret, err) {
//				initUserInfoAndUserKeyInfo();
				openWeatherPage();
//			});
		} else {
			//用户当前登录状态时判断有没有其他手机登录如果有则退出当前用户刷新用户的相关初始化信息
			AjaxUtil.exeScript({
				script : "login.login", //need to do
				needTrascation : false,
				funName : "checkSingleLogin",
				form : {
					memberId : memberid,
					deviceId : deviceId
				},
				success : function(data) {
					if (data.execStatus === "true" && data.formDataset.checked === "true") {
						api.toast({
							msg : '您的账号已在其他地方登陆,您被强制下线,如果不是您的个人行为请立即联系管理员,谢谢!'
						});
					} else {
						openWeatherPage();
					}

				}
			});
		}
	} else {
		openWeatherPage();
	}


}

/**
 *打开周边首页
 */
function openAroundPage() {
	changeImage("around");
	
	api.openWin({//打开登录界面
		name : 'hshaf',
		url : 'xk.ppke.cn',
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	}); 


//	api.alert({
//		msg : '该模块暂未开放'
//	}, function(ret, err) {
//		//coding...
//	});
}

/**
 *打开邻里首页  改为跳转商城
 */
function openNeighboursPage(show) {
	$(show).find("p").addClass("changeCor").parent().siblings().find("p").removeClass("changeCor");
	$("#center").find("img").attr("src","image/mainimg/wd.png");
	$("#around").find("img").attr("src","image/mainimg/gj.png");
	$("#shop").find("img").attr("src","image/mainimg/sj.png");
	$("#neighbours").find("img").attr("src","image/mainimg/sc1.png");
	api.openFrame({
		name : 'busList',
		url : 'shangjia/html/buyList.html',
		bounces : false,
		 rect : {
          x : 0,
          y : 0,
          w : 'auto',
          h : headerH+frameH
        },
//		animation : {
//			type : "push", //动画类型（详见动画类型常量）
//			subType : "from_right", //动画子类型（详见动画子类型常量）
//			duration : 300 //动画过渡时间，默认300毫秒
//		},
		pageParam : {
          indexid : true
        },
	});
//	api.toast({
//	    msg:'程序猿卖力开发中，敬请期待！'
//  });
//	memberid = api.getPrefs({
//		sync : true,
//		key : 'memberid'
//	});
//	//	changeImage("neighbours");
//	$("#neighbours").addClass("changeCor").siblings().removeClass("changeCor");
//	FileUtils.readFile("info.json", function(info, err) {
//		hasLogon = info.hasLogon;
//		if (hasLogon != true) {
//			reqUrl = 'html/registe/logo.html';
//			name = "login";
//			api.openWin({
//				name : name,
//				url : reqUrl,
//				bounces : false,
//				rect : {
//					x : 0,
//					y : headerH,
//					w : 'auto',
//					h : frameH
//				},
//				animation : {
//					type : "push", //动画类型（详见动画类型常量）
//					subType : 'from_right', //动画子类型（详见动画子类型常量）
//					duration : 300
//				}
//			});
//			//			api.setPrefs({
//			//				key : 'isnearby',
//			//				value : true
//			//			});
//			//			api.openWin({//打开登录界面
//			//				name : 'initw',
//			//				url : 'html/zhwhOM/initw.html',
//			//				slidBackEnabled : true,
//			//				animation : {
//			//					type : "push", //动画类型（详见动画类型常量）
//			//					subType : "from_right", //动画子类型（详见动画子类型常量）
//			//					duration : 300 //动画过渡时间，默认300毫秒
//			//				}
//			//			});
//		} else {
//			back_flag = 1;
//			api.setPrefs({
//				key : 'isnearby',
//				value : true
//			});
//			api.openFrame({//打开登录界面
//				name : 'welcome',
//				url : 'html/zhwhOM/welcome.html',
////				slidBackEnabled : true,
////				animation : {
////					type : "push", //动画类型（详见动画类型常量）
////					subType : "from_right", //动画子类型（详见动画子类型常量）
////					duration : 300 //动画过渡时间，默认300毫秒
////				},
//				rect:{
//					x:0,
//					y:headerH,
//					w:'auto',
//					h:frameH
//				},
////				showProgress:false,
//				progress:{
//				    type:"default",                //加载进度效果类型，默认值为default，取值范围为default|page，default等同于showProgress参数效果；为page时，进度效果为仿浏览器类型，固定在页面的顶部
//				    title:"加载中",               //type为default时显示的加载框标题
//				    text:"请稍后..."                //type为page时进度条的颜色，默认值为#45C01A，支持#FFF，#FFFFFF，rgb(255,255,255)，rgba(255,255,255,1.0)等格式
//				},
//				reload:true,
//				pageParam : {
//					uid : memberid,
//					frameH:frameH,
//					headerH:headerH
//				}
//			});
//		}
//	});
}


/**
 *打开天气新闻首页
 */
function openWeatherPage() {
	$("#weather").siblings().find("p").removeClass("changeCor");
	$("#center").find("img").attr("src","image/mainimg/wd.png");
	$("#around").find("img").attr("src","image/mainimg/gj.png");
	$("#shop").find("img").attr("src","image/mainimg/sj.png");
	$("#neighbours").find("img").attr("src","image/mainimg/sc.png");
	changeImage("weather");
	api.openFrame({
		name : 'weather',
		url : 'html/homepage.html',
		bounces : false,
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : frameH+headerH
		},
		reload:true,//点击主页刷新
	});
	//清空当前的城市名字 初始加载当前的城市
	api.setPrefs({
		key : 'cityname',
		value : ''
	});
}

/**
 *根据当前的用户状态判断向哪个页面跳转
 */
function openCenterPage(show) {
	$(show).find("p").addClass("changeCor").parent().siblings().find("p").removeClass("changeCor");
//	alert($(show).find("p").addClass("changeCor").parent().siblings().find("p").html());
	$("#center").find("img").attr("src","image/mainimg/wd1.png");
	$("#around").find("img").attr("src","image/mainimg/gj.png");
	$("#shop").find("img").attr("src","image/mainimg/sj.png");
	$("#neighbours").find("img").attr("src","image/mainimg/sc.png");
	var hasRegist = api.getPrefs({
		sync : true,
		key : 'hasRegist'
	});
	var hasLogon = api.getPrefs({
		sync : true,
		key : 'hasLogon'
	});
	var memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
	var account = api.getPrefs({
		sync : true,
		key : 'account'
	});
	var reqUrl = "html/registe/register.html";
	var name = "register";
	//没有登陆的情况下
    if (String(hasLogon) != 'true') {
      reqUrl = 'html/registe/logo.html';
      name = "login";
      api.openWin({
        name : name,
        url : reqUrl,
        bounces : false,
        rect : {
          x : 0,
          y : headerH,
          w : 'auto',
          h : frameH
        },
        animation : {
          type : "push", //动画类型（详见动画类型常量）
          subType : 'from_right', //动画子类型（详见动画子类型常量）
          duration : 300
        }
      })
    } else {
      //已经登陆的情况下
      api.openFrame({
        name : 'room',
        url : 'nmy/my.html',
        bounces : false,
        rect : {
          x : 0,
          y : 0,
          w : 'auto',
          h : frameH+headerH
        },
        reload:true,//点击我的刷新
        pageParam : {
          memberid : memberid
        },
      });
    } 
}

//切换图片
function changeImage(myUrl) {
	$("a").each(function() {
		if ($(this).attr("id") != myUrl) {
			$(this).find('img').attr('src', $(this).find('img').attr('src').replace('_click', ''));
			$(this).find('span').eq(1).css('color', '#828282');
		} else {
			$(this).find('img').attr('src', $(this).find('img').attr('src').replace('_click', '').replace('.png', '_click.png'));
			$(this).find('span').eq(1).css('color', '#0eaae0');
		}
	});
}
//管家判断是否登录
function showAround(show) {
	$(show).find("p").addClass("changeCor").parent().siblings().find("p").removeClass("changeCor");
	$("#center").find("img").attr("src","image/mainimg/wd.png");
	$("#around").find("img").attr("src","image/mainimg/gj1.png");
	$("#shop").find("img").attr("src","image/mainimg/sj.png");
	$("#neighbours").find("img").attr("src","image/mainimg/sc.png");
	api.getPrefs({
		key : 'hasLogon'
	}, function(ret, err) {
		var hasLogonl = ret.value;
		if (String(hasLogonl) != 'true') {
			api.openWin({
				name : 'login',
				url : 'html/registe/logo.html',
				bounces : false,
				rect : {
					x : 0,
					y : headerH,
					w : 'auto',
					h : frameH
				},
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : 'from_right', //动画子类型（详见动画子类型常量）
					duration : 300
				}
			});
		} else {
			api.openFrame({
				name : 'guanjia',
				url : 'nmy/housekeeper.html',
				bounces : false,
				reload : true,
				rect : {
					x : 0,
					y : 0,
					w : 'auto',
					h : frameH+headerH
				}
			});

		}
	});

}

function openmain() {
//	$("#weather").addClass("changeCor").siblings().removeClass("changeCor");
	api.openFrame({
		name : 'weather',
		url : 'html/homepage.html',
		bounces : false,
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : frameH+headerH
		},
		reload:true,  //实现登录退出后回显刷新
	});
//	清空当前的城市名字 初始加载当前的城市
	api.setPrefs({
		key : 'cityname',
		value : ''
	});
}
function openCommonweal(show) {
	$(show).find("p").addClass("changeCor").parent().siblings().find("p").removeClass("changeCor");
	$("#center").find("img").attr("src","image/mainimg/wd.png");
	$("#around").find("img").attr("src","image/mainimg/gj.png");
	$("#shop").find("img").attr("src","image/mainimg/sj1.png");
	$("#neighbours").find("img").attr("src","image/mainimg/sc.png");
	api.openFrame({
		name : 'commonProvider',
		url : 'shangjia/html/newIndex.html',
		bounces : false,
		reload:true,
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : frameH+headerH,
			
		}
			
	});
};
//6.19商家可以维护 砸蛋的页面跳转
//function openCommonweal() {
//	$("#shop").addClass("changeCor").siblings().removeClass("changeCor");
//	api.openFrame({
//		name : 'commonProvider',
//		url : 'seller/seller.html',
//		bounces : false,
//		reload:true,
//		rect : {
//			x : 0,
//			y : headerH,
//			w : 'auto',
//			h : frameH,
//		}
//			
//	});
//}
