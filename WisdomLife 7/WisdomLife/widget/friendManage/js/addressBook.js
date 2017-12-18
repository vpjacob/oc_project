var urId="";
var myfriendList;
apiready = function() {
//	alert(cityName);
	var header = $api.byId('title');
	var miancss = $api.dom('.box');
	var first = $api.dom('.first');
	var secondul = $api.dom('.secondul');
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(header, 'padding-top:1.6rem;');
            $api.css(header, 'height:3.7rem;');
            $api.css(miancss, 'margin-top:4.2rem;');
            $api.css(secondul, 'top:4.2rem;');
            $api.css(first, 'top:3.8rem;');
        }else{
            $api.css(header, 'padding-top:1.1rem;');
            $api.css(header, 'height:3.2rem;');
            $api.css(miancss, 'margin-top:3.8rem;');
            $api.css(secondul, 'top:3.7rem;');
            $api.css(first, 'top:3.3rem;');
        }
	};
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	
	//进行跳转到申请好友
	$('#goToFriend').click(function() {
		api.openWin({//详情界面
			name : 'addFriend',
			url : '../html/addFriend.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
		});
	});
	//跳转到好友申请列表
	$('.topContent').click(function() {
		api.openWin({//详情界面
			name : 'friendApply',
			url : '../html/friendApply.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
		});
	});
	//跳转到好友申请列表
	$('.boxBot').on("click",".boxBotLast",function() {
		api.openWin({//详情界面
			name : 'listFriendInfo',
			url : '../html/listFriendInfo.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				otherId:$(this).attr("data")
			}
		});
	});
	
	//扫一扫添加好友
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

	
	//点击添加好友展示分类列表
	var flag = true;
	$("#addFriend").click(function() {
		if (flag == true) {
			$("div.first").show();
			$(".secondul").show();
			$(".black_box").show();
			flag = false;
		} else {
			$("div.first").hide();
			$(".secondul").hide();
			$(".black_box").hide();
			flag = true;
		}
	});
	//点击列表选项
	$('.secondul').on('click', 'li', function() {
		$(this).addClass("typeSpecial");
		setTimeout(function() {
			$(".secondul").hide();
			flag = true;
			$(".black_box").hide();
			$("div.first").hide();
			$(".secondul li").removeClass("typeSpecial");
		}, 200);
	});
	//点击蒙版消失
	$('.black_box').on('click', function() {
		$(".secondul").hide();
		$("div.first").hide();
		flag = true;
		$(".black_box").hide();
	});
	//查询我的好友列表
	function friendList() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.friend.friend",
			needTrascation : false,
			funName : "friendList",
			form : {
				userNo:urId
			},
			success : function(data) {
				console.log("所有好友列表" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					myfriendList = data.formDataset.friendList;	
					if(myfriendList=='' || String(myfriendList)=="undefined" || String(myfriendList)=="null" || String(myfriendList)=="{}"){
						api.toast({
	                        msg:'您暂无好友，赶快添加好友去吧'
                        });
					}else{
						var str= sortPY(myfriendList);
						createLi(str);
					}
					
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
	
	friendList();
	//查询好友申请数量
	function friendApplyCount() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.friend.friend",
			needTrascation : false,
			funName : "friendApplyCount",
			form : {
				userNo:urId
			},
			success : function(data) {
				console.log("好友申请数量" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					 $(".topRight").html(data.formDataset.count);										
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
	friendApplyCount();
}	
	
function goBack() {
	api.closeWin({
	});
}
