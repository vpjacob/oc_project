var urId="";
apiready = function() {
//	alert(cityName);
	var header = $api.byId('title');
	var miancss = $api.dom('.box');
	var title_div = $api.dom('.title_div');
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(header, 'padding-top:1.6rem;');
            $api.css(header, 'height:3.7rem;');
            $api.css(miancss, 'margin-top:4.3rem;');
            $api.css(title_div, 'margin-top:0.8rem;');
        }else{
            $api.css(header, 'padding-top:1.1rem;');
            $api.css(header, 'height:3.2rem;');
            $api.css(miancss, 'margin-top:3.8rem;');
            $api.css(title_div, 'margin-top:0.3rem;');
        }
	};
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	//生成我的二维码信息
	var address = urId;
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
			$("#ewmImg").attr("src",ret.savePath);
			$("#blackMidImg").attr("src",ret.savePath);
		} else {
			api.alert({
				msg : JSON.stringify(err)
			}, function(ret, err) {
				//coding...
			});
		}
	});
	$('#scan').click(function() {
		var scanner = api.require('scanner');
		scanner.open(function(ret, err) {
			if (ret.eventType == 'success') {
				console.log('扫描拿回到的信息'+$api.jsonToStr(ret));
				api.openWin({//详情界面
						name : 'friendInfo',
						url : '../html/friendInfo.html',
						slidBackEnabled : true,
						animation : {
							type : "push", //动画类型（详见动画类型常量）
							subType : "from_right", //动画子类型（详见动画子类型常量）
							duration : 300 //动画过渡时间，默认300毫秒
						},
						pageParam : {
							userInfo:ret.msg
						}
					});
			} else {
				console.log("扫描好友二维码：" + JSON.stringify(err));
			}
		});
	}); 
	//获取二维码的头像及昵称
	function myEggRecordMyInfo() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.stealegg",
			needTrascation : false,
			funName : "myEggRecordMyInfo",
			form : {
				userNo:urId
			},
			success : function(data) {
				console.log("获取头像" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {		
              	var headImage="";
              	var nickName=""
              		if(String(data.formDataset.headImage)=="" || String(data.formDataset.headImage)=="null" || String(data.formDataset.headImage)=="undefined"){
              			headImage="../../image/stealEgg/defaultImg.png"
              		}else{
              			headImage=rootUrl+data.formDataset.headImage;
              		};
              		$("#headImage").attr("src",headImage);
              		if(String(data.formDataset.userName)=="" || String(data.formDataset.userName)=="null" || String(data.formDataset.userName)=="undefined"){
              			nickName="昵称暂无"
              		}else{
              			nickName=data.formDataset.userName;
              		};
              		$("#nickName").html(nickName);
				} else {
					alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.hideProgress();
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！" 
				});
			}
		});
	};
	myEggRecordMyInfo();
	//点击二维码放大
	$("#ewmImg").click(function(){
		$(".black_box").show();
	});
	$(".black_box").click(function(){
		$(this).hide();
	});
	$("#searchval").focus(function(){
		//阻止软键盘弹出
		 document.activeElement.blur();
		api.openWin({//详情界面
			name : 'searchFriend',
			url : '../html/searchFriend.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
		});
	})
}	
function goBack() {
	api.closeWin({
	});
}
