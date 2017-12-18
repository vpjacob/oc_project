var urId="";
apiready = function() {
//	alert(cityName);
	var header = $api.byId('title');
	var miancss = $api.dom('.boxBot');
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
	//点击好友列表进行跳转
	$(".botSec").on("click",".boxBotSame",function(){
		api.openWin({
				name : 'stealEgg',
				url : 'stealEgg.html',
				reload : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					otherId:$(this).attr("datas")
				}
			});
	})	
	//加载好友列表和昨日砸蛋情况
	function friendEggList() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.stealegg",
			needTrascation : false,
			funName : "friendEggList",
			form : {
				userNo:urId,
				page:1
			},
			success : function(data) {
				console.log("加载本用户更多好友列表和昨日砸蛋情况" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var accont = data.formDataset.friendEggList;	
					var list=$api.strToJson(accont);
					var model="";
					if(accont=='' || String(accont)=="undefined" || String(accont)=="null" || String(accont)=="{}"){
						api.toast({
	                        msg:'您暂无好友，赶快添加好友去吧'
                        });
					}else{
					for(var i=0;i<list.length;i++){
						var nickName="";
                      	var eggMoney="";
                      	var model="";
                      	var headImage="";
                      	var realName="";
                      	var rankImg="";
                      		if(String(list[i].username)=="" || String(list[i].username)=="null" || String(list[i].username)=="undefined"){
                      			nickName="昵称暂无"
                      		}else{
                      			nickName=list[i].username;
                      		};
                      		if(String(list[i].beat_money)=="" || String(list[i].beat_money)=="null" || String(list[i].beat_money)=="undefined"){
                      			eggMoney="暂无"
                      		}else{
                      			eggMoney=list[i].beat_money;
                      		};
                      		if(String(list[i].head_image)=="" || String(list[i].head_image)=="null" || String(list[i].head_image)=="undefined"){
                      			headImage="../../image/eggList/icon_c.png"
                      		}else{
                      			headImage=rootUrl+list[i].head_image;
                      		};
                      		if(String(list[i].real_name)=="" || String(list[i].real_name)=="null" || String(list[i].real_name)=="undefined"){
                      			realName="暂无"
                      		}else{
                      			realName=list[i].real_name;
                      		};
                      		if(i==0){
                      			rankImg='<img src="../../image/stealEgg/gold.png" alt="" class="topImg"/>'
                      		}else if(i==1){
                      			rankImg='<img src="../../image/stealEgg/sliver.png" alt="" class="topImg"/>'
                      		}else if(i==2){
                      			rankImg='<img src="../../image/stealEgg/copper.png" alt="" class="topImg"/>'
                      		}else{
                      			rankImg='<div class="topImg">'+(i+1)+'</div>';
                      		}
						model+='<div class="boxBotSame" data="'+list[i].steal_gold_status+'" datas="'+list[i].friend_no+'">'
							+''+rankImg+''
							+'<div class="main">'
							+'<img src="'+headImage+'" alt="" class="mainImg"/>'			
							+'<span class="nickName">'+nickName+'</span>'				
							+'<span class="realName">真实姓名:'+realName+'</span>'				
							+'<span class="last">枚</span>'				
							+'<span class="mid">'+eggMoney+'</span>'				
							+'<img src="../../image/eggList/icon_a.png" alt="" class="botGold"/>'				
							+'</div>'				
							+'</div>'	
						$("#friendEggList").append(model);								
					}	
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
	friendEggList();
}	
function goBack() {
	api.closeWin({
	});
}
