var urId="";
apiready = function() {
//	alert(cityName);
	var header = $api.byId('title');
	var miancss = $api.dom('.box');
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(header, 'padding-top:1.6rem;');
            $api.css(header, 'height:3.7rem;');
            $api.css(miancss, 'margin-top:3.75rem;');
        }else{
            $api.css(header, 'padding-top:1.1rem;');
            $api.css(header, 'height:3.2rem;');
            $api.css(miancss, 'margin-top:3.25rem;');
        }
	};
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	//跳转到处理好友申请
	$(".box").on("click",".accept",function() {
		api.openWin({//详情界面
			name : 'applyInfo',
			url : '../html/applyInfo.html',
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
	//进行跳转到申请好友
	$('#addFriend').click(function() {
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
	
	//查询好友申请列表
	function friendApplyList() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.friend.friend",
			needTrascation : false,
			funName : "friendApplyList",
			form : {
				userNo:urId
			},
			success : function(data) {
				console.log("好友申请列表" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var accont = data.formDataset.friendApplyList;	
					var list=$api.strToJson(accont);
					var model="";
					for(var i=0;i<list.length;i++){
						var nickName="";
                      	var realName="";
                      	var headImg="";
                      	var statusColor="";
                      		if(String(list[i].username)=="" || String(list[i].username)=="null" || String(list[i].username)=="undefined"){
                      			nickName="昵称暂无"
                      		}else{
                      			nickName=list[i].username;
                      		};
                      		if(String(list[i].real_name)=="" || String(list[i].real_name)=="null" || String(list[i].real_name)=="undefined"){
                      			realName="暂无"
                      		}else{
                      			realName=list[i].real_name;
                      		};
                      		if(String(list[i].head_image)=="" || String(list[i].head_image)=="null" || String(list[i].head_image)=="undefined"){
                      			headImg="../../image/friendManage/boxBotImg.png"
                      		}else{
                      			headImg=rootUrl+list[i].head_image;
                      		}	
                      		if(list[i].status=="申请中"){
                      			statusColor="accept";
                      		}else{
                      			statusColor="state";
                      		}
						model+='<div class="same">'
							+'<div class="main">'	
							+'<div class="headImg">'
							+'	<img src="'+headImg+'" alt="" />'
							+'</div>'
							+'<span>'+nickName+'</span>'
							+'<span>真实姓名:'+realName+'</span>'
							+'<span class="'+statusColor+'" data="'+list[i].user_no+'">'+list[i].status+'</span>'
							+'</div>'
							+'</div>'
					}	
					$("#applyList").html(model);								
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
	friendApplyList();
}	
function goBack() {
	api.closeWin({
	});
}
