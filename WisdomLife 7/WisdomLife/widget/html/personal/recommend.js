var membercode;
var nowli = "<li class='item-content' style='border-bottom: 1px solid #f6f6f6;'>" + "<div class='item-inner'><div class='pic-left'><img src='\"[src]\"' /></div><div class='title-mid'><p>\"[person]\"</p></div>" + "<div class='timer'>\"[time]\"</div></div></li>";
apiready = function() {
	membercode = api.pageParam.membercode;
	connectionType = api.connectionType;
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	if (connectionType == 'none' || connectionType == "unknown") {
		api.alert({
			msg : '当前网络不可用'
		});
	}

	var memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
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

	AjaxUtil.exeScript({
		script : "mobile.center.recommend.recommend",
		needTrascation : false,
		funName : "getList",
		form : {
			membercode : membercode
		},
		success : function(data) {//请求成功
			//			alert(JSON.stringify(data));
			if (data.execStatus === "true" && data.formDataset.checked === "true") {
				var feedcon = data.datasources[0].rows;
				var newresult = "";
				$('.list-block li').remove();
				if (feedcon.length > 0) {
					for ( a = 0; a < feedcon.length; a++) {
						var rows = feedcon[a];
						var nick = rows.nick;
						if (nick == null || nick == "") {
							nick = "匿名";
						}
						var result = nowli.replace("\"[person]\"", rows.membercode);
						result = result.replace("\"[time]\"", nick);
						if (!rows.headurl) {
							var headurl = '../../image/temp/wodetouxiang.png';
						} else {
							var headurl = rootUrl + rows.headurl;
						}
						result = result.replace("\"[src]\"", headurl);
						newresult += result;
					}
					$(".list-block ul").append(newresult);
				} else {
					api.alert({
						msg : '您尚未推荐其他人使用!'
					}, function(ret, err) {
						//coding...
					});
				}

			} else {
				api.alert({
					msg : '数据请求失败!'
				}, function(ret, err) {
					//coding...
				});
			}

		}
	});

	$("#back").bind("click", function() {
		api.closeWin();
	});

	$("#share").bind("click", function() {
		$('#photo').show();
	});
	$(document).on('click', '.share_sub', function() {
		$('#photo').hide();
	});

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
}