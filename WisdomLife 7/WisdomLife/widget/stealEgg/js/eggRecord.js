var urId="";
var page = 1;
var pageCount = 1;
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
	$('.accept').click(function() {
		api.openWin({//详情界面
			name : 'applyInfo',
			url : '../html/applyInfo.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
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
				console.log("获取金币综合" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {					
						var nickName="";
                      	var eggMoney="";
                      	var headImage="";
                      		if(String(data.formDataset.headImage)=="" || String(data.formDataset.headImage)=="null" || String(data.formDataset.headImage)=="undefined"){
                      			headImage="../../image/friendManage/boxBotImg.png"
                      		}else{
                      			headImage=rootUrl+data.formDataset.headImage;
                      		};
                      		if(String(data.formDataset.userName)=="" || String(data.formDataset.userName)=="null" || String(data.formDataset.userName)=="undefined"){
                      			nickName="昵称暂无"
                      		}else{
                      			nickName=data.formDataset.userName;
                      		};
                      		if(String(data.formDataset.totle)=="" || String(data.formDataset.totle)=="null" || String(data.formDataset.totle)=="undefined"){
                      			eggMoney="暂无"
                      		}else{
                      			eggMoney=data.formDataset.totle;
                      		};
                      		$("#headImage").attr("src",headImage);
                      		$("#nickName").html(nickName);
                      		$("#eggMoney").html(eggMoney);
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
	
	
	function MyEggRecord(pages) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.stealegg",
			needTrascation : false,
			funName : "MyEggRecord",
			form : {
				userNo:urId,
				page:pages
			},
			success : function(data) {
				console.log("金蛋记录" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var accont = data.formDataset.MyEggRecord;	
					var list=$api.strToJson(accont);
					var model="";
					if (String(list.length) == "undefined" || list.length == 0 || list == undefined || list == '' || list.length == '') {
						if (pages == 1) {
							api.toast({
								msg : '暂无金蛋记录'
							});
						} else {
							api.toast({
								msg : '无更多金蛋记录'
							});
						}
					} else {
						for(var i=0;i<list.length;i++){
							var nickName="";
	                      	var eggMoney="";
//	                      	var model="";
	                      	var typeFlag="";
	                      	var typeImg="";
	                      		if(String(list[i].user_name)=="" || String(list[i].user_name)=="null" || String(list[i].user_name)=="undefined"){
	                      			nickName="昵称暂无"
	                      		}else{
	                      			nickName=list[i].user_name;
	                      		};
	                      		if(String(list[i].beat_money)=="" || String(list[i].beat_money)=="null" || String(list[i].beat_money)=="undefined"){
	                      			eggMoney="暂无"
	                      		}else{
	                      			eggMoney=list[i].beat_money;
	                      		};
	                      		if(list[i].type=="2"){
	                      			typeFlag='<span>从</span><span>'+nickName+'</span><span>砸得</span>'
	                      			typeImg='<img src="../../image/stealEgg/clickegg.png" alt="" class="personImg"/>'
	                      		}else if(list[i].type=="1"){
	                      			typeFlag='<span>砸金蛋</span>'
	                      			typeImg='<img src="../../image/stealEgg/myegg.png" alt="" class="personImg"/>'
	                      		}
						var	model='<div class="stealSame">'	
								+'<div class="stealContent">'
								+''+typeImg+''
								+'<div class="right">'
								+'<div class="first">'
								+''+typeFlag+''
								+'</div>'
								+'<div class="sec">'
								+'<span>'+list[i].create_time+'</span>'
								+'</div>'
								+'<div class="lastBox">'
								+'<span>枚</span>'
								+'<span>'+eggMoney+'</span>'
								+'<img src="../../image/eggList/icon_a.png" alt="" class="botGold"/>'
								+'</div>'
								+'</div>'
								+'</div>'
								+'</div>'
							$("#MyEggRecord").append(model);								
						}	
					}
					pageCount = data.formDataset.count > 20 ? Math.ceil(data.formDataset.count / 20) : 1;
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
	MyEggRecord(page);
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (parseInt(page) <= parseInt(pageCount)) {
			page++;
			MyEggRecord(page);
		} else {
			page = parseInt(pageCount) + 1;
		}
	});
}	
function goBack() {
	api.closeWin({
	});
}
