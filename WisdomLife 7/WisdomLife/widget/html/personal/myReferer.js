var urId;
var busPath="";
var flag=1;
apiready = function() {
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	//拼接服务器地址端口、执行方法、传递参数  推荐商家路径
	//个人推荐的路径	
	var param = api.pageParam;
//	$(".top").find("p").html('我的二维码');
	$(".bottom").find("img").attr("src", param.imgpath);
	var address = rootUrl + "/jsp/manager/recommand/myProviderMoblieReg?userNo=" + urId + "&userType=2";
	//请求二维码模块
	var scanner = api.require('scanner');
	scanner.encode({
		string : address,
		save : {
			imgPath : 'fs://',
			imgName : 'referBuser.png'
		}
	}, function(ret, err) {
		if (ret.status) {
			busPath=ret.savePath;
		} else {
			api.alert({
				msg : JSON.stringify(err)
			}, function(ret, err) {
				//coding...
			});
		}
	});

	$("#goback").click(function() {
		goback();
	});
	
	//推荐个人  推荐商家切换
	$(".referChange .span2").click(function(){
		$(".bottom").find("img").attr("src", busPath);
		$(this).addClass("special").prev().removeClass("special");
		flag=2;
	})
	$(".referChange .span1").click(function(){
		$(".bottom").find("img").attr("src", param.imgpath);
		$(this).addClass("special").next().removeClass("special");
		flag=1;
	})
	
	$('#tjrecord').click(function() {
		api.openWin({
			name : 'refererRecord',
			url : 'refererRecord.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		var dd = $api.dom('.referChange');
		$api.css(header, 'margin-top:1rem;');
		$api.css(cc, 'margin-top:1rem;');
		$api.css(dd, 'margin-top:3.2rem;');
	}
	//监听页面的长按事件
	api.addEventListener({
		name : 'longpress'
	}, function(ret, err) {
		$('#photo').show();
	});

	$(document).on('click', '.share_sub', function() {
		$('#photo').hide();
	});

	$("#qq_share").bind("click", function() {
		var qq = api.require('qq');
		var qqUrl="";
		qq.installed(function(ret, err) {
			
			if (ret.status) {
				$('#photo').hide();
				if(flag==1){
					qqUrl=rootUrl + "/jsp/recommendmobile?userNo=" + urId + "&userType=1"
				}else if(flag==2){
					qqUrl=address;
				}
				qq.shareNews({
					type : 'QFriend',
					url : qqUrl,
					title : '小客科技改变生活',
					description : '小客创享智慧未来,与您携手共享科技生活！',
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
		var wxUrl=""
		wx.isInstalled(function(ret, err) {
			if (ret.installed) {
				$('#photo').hide();
				if(flag==1){
					wxUrl=rootUrl + "/jsp/recommendmobile?userNo=" + urId + "&userType=1"
				}else if(flag==2){
					wxUrl=address;
				}
				wx.shareWebpage({
					apiKey : '',
					scene : 'session',
					title : '小客科技改变生活',
					description : '小客创享智慧未来,与您携手共享科技生活！',
					thumb : 'widget://image/a.png',
					contentUrl :wxUrl,
//					userName : 'A6921550712789',
//					path : '',
				}, function(ret, err) {
					console.log($api.jsonToStr(ret))
					if (ret.status) {
						alert('分享成功');
					} else {
						alert(err.code);
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
		var sms="";
		if (flag == 1) {
			sms = rootUrl + "/jsp/recommendmobile?userNo=" + urId + "&userType=1"
		} else if (flag == 2) {
			sms = address;
		}

		api.sms({
			text : '小客科技改变生活' + sms,
		}, function(ret, err) {
			if (ret && ret.status) {
				//已发送
				$('#photo').hide();
			} else {
				//发送失败
			}
		});

	});
};
function goback() {
	api.closeWin();
}
