var urId="";
var page = 1;
var pageCount = 1;
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
	//加载更多动态
	function dynamicList(pages) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.stealegg",
			needTrascation : false,
			funName : "dynamicList",
			form : {
				userNo:urId,
				page:pages
			},
			success : function(data) {
				console.log("最新动态" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var accont = data.formDataset.dynamicList;	
					var arr=$api.strToJson(accont);
//					var arr=list;
					if(accont=='' || String(accont)=="undefined" || String(accont)=="null" || String(accont)=="{}"){
						api.toast({
	                        msg:'您暂无好友动态'
                        });
					}else{
					var map = {};
			        var dest = [];
			        //按时间顺序进行分类
			        for(var i = 0; i < arr.length; i++){
			            var ai = arr[i];
			            if(!map[ai.day]){
			                dest.push({
			                    id: ai.day,
			                    data: [ai]
			                });
			                map[ai.day] = ai;
			            }else{
			                for(var j = 0; j < dest.length; j++){
			                    var dj = dest[j];
			                    if(dj.id == ai.day){
			                        dj.data.push(ai);
			                        break;
			                    }
			                }
			            }
			        }
					var changeJson=dest;
					console.log("转化为以后的json" + $api.jsonToStr(changeJson));
					for(var j=0;j<changeJson.length;j++){
						var list=changeJson[j].data;
						var dataId=changeJson[j].id;
						var outModel='<div class="same">'
									+'<div class="date">'
									+''+(changeJson[j].id).substring(5)+''
									+'</div>'
									+'<img src="../../image/stealEgg/border.png" alt="" class="theTop"/>';
//									+'</div>';
						for(var i=0;i<list.length;i++){
							var nickName="";
	                      	var eggMoney="";
//	                      	var model="";
	                      		if(String(list[i].username)=="" || String(list[i].username)=="null" || String(list[i].username)=="undefined"){
	                      			nickName="昵称暂无"
	                      		}else{
	                      			nickName=list[i].username;
	                      		};
	                      		if(String(list[i].egg_money)=="" || String(list[i].egg_money)=="null" || String(list[i].egg_money)=="undefined"){
	                      			eggMoney="暂无"
	                      		}else{
	                      			eggMoney=list[i].egg_money;
	                      		};
							var model='<div class="context">'
								+'<img src="../../image/stealEgg/dot.png" alt="" class="dot"/>'
								+'<span class="name">'+nickName+'</span>'
								+'<span class="spanSame">偷了</span>'
								+'<span class="gold">'+eggMoney+'</span>'
								+'<span class="spanSame">枚金币</span>'
								+'<span class="time">'+(list[i].create_time).split(" ")[1]+'</span>'
								+'<img src="../../image/stealEgg/border.png" alt="" class="border"/>'
								+'</div>';
							outModel = outModel + model;
						}	
						outModel = outModel+'</div>';
						$("#dynamicList").append(outModel);								
//						pageCount = data.formDataset.count > 10 ? Math.ceil(data.formDataset.count / 10) : 1;
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
	dynamicList(page);
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		if (parseInt(page) <= parseInt(pageCount)) {
			page++;
			dynamicList(page);
		} else {
			page = parseInt(pageCount) + 1;
		}
	});
	
}	
function goBack() {
	api.closeWin({
	});
}
