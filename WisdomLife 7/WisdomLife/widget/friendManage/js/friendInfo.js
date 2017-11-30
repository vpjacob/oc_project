var urId="";
var friendNo="";
apiready = function() {
//	alert(cityName);
	var userInfo=api.pageParam.userInfo;
	var header = $api.byId('title');
	var miancss = $api.dom('.box');
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(header, 'padding-top:1.6rem;');
            $api.css(header, 'height:3.7rem;');
            $api.css(miancss, 'margin-top:4.3rem;');
        }else{
            $api.css(header, 'padding-top:1.1rem;');
            $api.css(header, 'height:3.2rem;');
            $api.css(miancss, 'margin-top:3.8rem;');
        }
	};
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	function selectUserInfo() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.friend.friend",
			needTrascation : false,
			funName : "selectUserInfo",
			form : {
				userInfo:userInfo
			},
			success : function(data) {
				console.log("查询好友个人信息" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var list= $api.strToJson(data.formDataset.userInfo);	
					if(String(list.head_image)=="null" || String(list.head_image)=="undefined" || String(list.head_image)=="" || String(list.head_image)=="未知"){
						$("#headImg").attr("src","../../image/friendManage/holderImg.png");
					}else{
						$("#headImg").attr("src", rootUrl + list.head_image);
					};
					if(String(list.username)=="null" || String(list.username)=="undefined" || String(list.username)==""){
						$(".topMid").html("昵称暂无");
					}else{
						$(".topMid").html(list.username);
					};
					if(String(list.sex)=="男"){
						$(".sex").attr("src","../../image/friendManage/sexMan.png");
					}else if(String(list.sex)=="女"){
						$(".sex").attr("src","../../image/friendManage/sexGirl.png");
					};
					$(".topLast").html("ID:"+list.user_no);
					friendNo=list.user_no;
					if(String(list.address)=="null" || String(list.address)=="undefined" || String(list.address)==""){
						$("#cityName").html("暂无");
					}else{
						$("#cityName").html(list.address);
					};
					if(String(list.birthdaystr)=="null" || String(list.birthdaystr)=="undefined" || String(list.birthdaystr)==""){
						$("#age").html("暂无");
					}else{
						$("#age").html(list.birthdaystr);
					};
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
	//查询相关人员的资料
	selectUserInfo();
	//申请添加好友
	function friendApply() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.friend.friend",
			needTrascation : false,
			funName : "friendApply",
			form : {
				userNo:urId,
				userInfo:userInfo
			},
			success : function(data) {
				console.log("添加好友" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					$(".addFriend").attr("disabled", true);
					api.toast({
	                    msg:data.formDataset.msg
                    });
                    setTimeout(function(){api.closeWin({})},500);
//                  api.closeWin({});
				} else {
					api.toast({
	                    msg:data.formDataset.errorMsg
                    });
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
	$(".addFriend").click(function(){
		friendApply();
	})
}	
function goBack() {
	api.closeWin({
	});
}
