var urId="";
var friendNo="";
var stealFlag="false"
apiready = function() {
//	alert(cityName);
	var otherId=api.pageParam.otherId;
	var header = $api.byId('title');
	var miancss = $api.dom('.box');
	var first = $api.dom('.first');
	var secondul = $api.dom('.secondul');
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(header, 'padding-top:1.6rem;');
            $api.css(header, 'height:3.7rem;');
            $api.css(miancss, 'margin-top:4.3rem;');
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
	//点击加入黑名单
	var flag = true;
	$("#blacklist").click(function() {
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
	
	//查询个人信息
	function selectUserInfo() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.friend.friend",
			needTrascation : false,
			funName : "queryStealUser",
			form : {
				userNo:urId,
				friendNo:otherId
			},
			success : function(data) {
				console.log("查询好友个人信息" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var list= $api.strToJson(data.formDataset.stealUserInfo);	
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
					if(String(list.phone)=="null" || String(list.phone)=="undefined" || String(list.phone)==""){
						$("#tel").html("暂无");
					}else{
						$("#tel").html(list.phone);
					};
					if(String(list.real_name)=="null" || String(list.real_name)=="undefined" || String(list.real_name)==""){
						$("#realName").html("暂无");
					}else{
						$("#realName").html(list.real_name);
					};
					if(String(list.birthday)=="null" || String(list.birthday)=="undefined" || String(list.birthday)==""){
						$("#birDate").html("暂无");
					}else{
						$("#birDate").html(list.birthday);
					};
					if(String(list.create_time)=="null" || String(list.create_time)=="undefined" || String(list.create_time)==""){
						$("#registeDate").html("暂无");
					}else{
						$("#registeDate").html((list.create_time).split(" ")[0]);
					};
					$("#isSteal").attr("datas",list.user_no);
					if(String(data.formDataset.isSteal)=="0"){
						$("#isBackground").addClass("buttons");
						$("#isBackground").removeClass("buttonNo");
						$("#isSteal").attr("src","../../image/friendManage/goldEgg.png");
						stealFlag="true";
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
	 selectUserInfo();
	 
	 function deleteFriend() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.friend.friend",
			needTrascation : false,
			funName : "deleteFriend",
			form : {
				userNo:urId,
				friendNo:friendNo,
			},
			success : function(data) {
				console.log("同意拒绝好友申请" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					api.toast({
	                    msg:data.formDataset.msg
                    });
                    api.execScript({//刷新我的界面金币总数的数据
							name : 'addressBook',
							script : 'refresh();'
						});
                    setTimeout(function(){api.closeWin({})},500);
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
	$("#deleteFriend").click(function(){
		deleteFriend();
	});
	//跳转到偷金蛋
	$('#isBackground').click(function() {
		if(String(stealFlag)=="true"){
			api.openWin({//详情界面
				name : 'stealEgg',
				url : '../../stealEgg/html/stealEgg.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					otherId:$("#isSteal").attr("datas")
				}
			});
		}
	});
}	
function goBack() {
	api.closeWin({
	});
}
