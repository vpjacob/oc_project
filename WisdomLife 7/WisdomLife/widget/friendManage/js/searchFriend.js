var urId="";
apiready = function() {
//	alert(cityName);
	var header = $api.byId('title');
	var miancss = $api.dom('.box');
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(header, 'padding-top:1.6rem;');
            $api.css(header, 'height:3.7rem;');
            $api.css(miancss, 'margin-top:4.0rem;');
        }else{
            $api.css(header, 'padding-top:1.1rem;');
            $api.css(header, 'height:3.3rem;');
            $api.css(miancss, 'margin-top:3.5rem;');
        }
	};
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	
	$("#submit").on("submit", function() {
		selectUserInfo();
		return false;
	});
	//申请添加好友
	function selectUserInfo() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.friend.friend",
			needTrascation : false,
			funName : "selectUserInfo",
			form : {
				userInfo:$("#searchval").val()
			},
			success : function(data) {
				console.log("查询好友个人信息" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
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
							userInfo:$("#searchval").val()
						}
					});
					$(".noFriend").hide();
				} else {
					api.toast({
	                    msg:data.formDataset.errorMsg
                    });
					$(".noFriend").show();
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

}	
function goBack() {
	api.closeWin({
	});
}
