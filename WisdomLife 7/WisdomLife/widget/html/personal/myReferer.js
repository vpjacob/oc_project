var urId;
apiready = function(){
		FileUtils.readFile("info.json", function(info, err) {
			urId = info.userNo;
		});


		var param = api.pageParam;
//		$(".top").find("p").html(param.address);
		$(".top").find("p").html('我的二维码');
		$(".bottom").find("img").attr("src",param.imgpath);
		
		$("#goback").click(function(){
			goback();
		});
		
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
	   if(api.systemType=='ios')
	   {	  
	       var cc=$api.dom('.content');
		   $api.css(header,'margin-top:20px;');
		   $api.css(cc,'margin-top:20px;');		
	   }
//监听页面的长按事件	   
	   api.addEventListener({
		    name:'longpress'
		}, function(ret, err){        
		   $('#photo').show();
		});
	   
	   
//	   $(document).on('click','#showShare',function() {
//			$('#photo').show();
//			
//		});
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
					url : rootUrl + "/jsp/recommendmobile?userNo=" + urId + "&userType=1",
					title : '小客智慧生活',
					description : '小客智慧生活服务平台  小客为您开启智慧生活！！！',
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
					description : '小客智慧生活服务平台  小客为您开启智慧生活！！！',
					thumb : 'widget://image/a.png',
					contentUrl : rootUrl + "/jsp/recommendmobile?userNo=" + urId + "&userType=1",
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
			text : '小客智慧生活' + rootUrl + "/jsp/recommendmobile?userNo=" + urId + "&userType=1",
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
	function goback()
	{
		api.closeWin();
	}
