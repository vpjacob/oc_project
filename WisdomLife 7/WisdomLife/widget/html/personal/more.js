var membercode;
apiready = function() {
	var header = $api.byId('header');
	memberid = api.pageParam.memberid;
	var satatus = api.pageParam.satatus;
	var isIos;
	var telphone = api.getPrefs({
			sync : true,
			key : 'telphone'
		});
	membercode = api.getPrefs({
		sync : true,
		key : 'membercode'
	});
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
		isIos = true;
	}

	$("#messageStatus").prop("checked", satatus);

	$("#messageStatus").bind("change", function() {
		var messageStatus = $("#messageStatus").prop("checked")
		//		alert(messageStatus);
		//		alert(memberid);
		AjaxUtil.exeScript({
			script : "mobile.center.message.message",
			needTrascation : true,
			funName : "changeStatus",
			form : {
				memberid : memberid,
				messageStatus : messageStatus
			},
			success : function(data) {
				ProgressUtil.hideProgress();
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

	$("#recommend").bind("click", function() {
		api.openWin({//打开推荐记录
			name : 'recommend',
			url : 'recommend.html',
			slidBackEnabled : true,
			pageParam : {
				membercode : membercode
			},
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});

	$("#getmark").bind("click", function() {
		var browser = api.require('webBrowser');
		if (isIos) {
			browser.open({
				url : 'https://itunes.apple.com/us/app/xiao-ke-zhi-hui-sheng-huo/id1171005961?l=zh&ls=1&mt=8'
			});
		} else {
			//          browser.open({
			//             url: 'http://zhushou.360.cn/detail/index/soft_id/3549854?recrefer=SE_D_%E6%99%BA%E6%85%A7%E7%94%9F%E6%B4%BB'
			//          });
			api.openApp({
				androidPkg : 'com.qihoo.appstore',
				mimeType : 'text/html',
				uri : 'http://zhushou.360.cn/detail/index/soft_id/3549854?recrefer=SE_D_%E6%99%BA%E6%85%A7%E7%94%9F%E6%B4%BB'
			}, function(ret, err) {
				if (ret) {

				} else {
					alert("您未安装360手机助手");
				}
			});
		}

	});
	$("#back").bind("click", function() {
		api.closeWin();
	});
	$("#qq_share").bind("click", function() {
		var qq = api.require('qq');
		qq.installed(function(ret, err) {
			if (ret.status) {
				$('#photo').hide();
				qq.shareNews({
					type : 'QFriend',
					url : rootUrl + "/jsp/share?membercode=" + membercode+"&telphone="+telphone,
					title : '小客智慧生活',
					description : '史上最好用的物业管理软件，快来下载吧！！！',
					//					imgUrl : 'http://community.apicloud.com/bbs/uc_server/avatar.php?uid=20639&size=middle'
					imgUrl : 'widget://image/a.png'
					//					imgUrl : ''
				}, function(ret, err) {
					if (ret.status) {
						alert("分享成功！");
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
					contentUrl : rootUrl + "/jsp/share?membercode="+membercode+"&telphone="+telphone
				}, function(ret, err) {
					if (ret.status) {
						alert('分享成功');
					} else {
						//						alert(err.code);
					}
				});
			} else {
				alert('当前设备未安装微信客户端');
			}
		});

	});
	$("#sms_share").bind("click", function() {
		api.sms({
			//			numbers : ['10086'],
			text : '史上最好用的物业管理软件，快来下载吧！！！' + rootUrl + "/jsp/share?membercode=" + membercode+"&telphone="+telphone,
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