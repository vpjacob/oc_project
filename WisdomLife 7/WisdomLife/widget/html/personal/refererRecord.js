var urId;
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var content = $api.dom('.content');
		
        if (api.screenHeight == 2436){
            $api.css(header, 'margin-top:44px;');
            $api.css(content, 'margin-top:44px;');
        }else{
            $api.css(header, 'margin-top:20px;');
            $api.css(content, 'margin-top:20px;');
        }
	}
	
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    record(urId);
	
	$("#back").bind("click", function() {
		api.closeWin();
	});
	//推荐个人  推荐商家切换
	$(".referChange .span2").click(function(){
		$(this).addClass("special").prev().removeClass("special");
		$("#record").empty();
		//推荐商家记录
		queryRecommendBussness(urId);
	});
	$(".referChange .span1").click(function(){
		$(this).addClass("special").next().removeClass("special");
		$("#busRecord").empty();
		//推荐个人记录
		record(urId);
	});
	
function record(urId) {
	AjaxUtil.exeScript({
		script : "managers.recommand.recommendpage",
		needTrascation : true,
		funName : "queryRecommendByVisiter",
		form : {
			userNo : urId
		},
		success : function(data) {
			var listInfo = data.formDataset.recommendList;
			var list = eval(listInfo);
			console.log('list'+list);
			console.log('listInfo'+listInfo);
			if (data.formDataset.checked == 'true') {
				if (list==undefined || list=='' || list.length  ==''||list.length == 0 ) {
					api.toast({
					msg : "亲，您暂时没有推荐个人记录！"
				});
					return false;
				} else {
					var nowli="";
					for (var i = 0; i < list.length; i++) {
								var headImg="";
								if(String(list[i].head_image)== "null" || String(list[i].head_image)== "undefined"){
				       					headImg='../../image/eggList/icon_c.png';
				       			}else{
				       				headImg=rootUrl+list[i].head_image;
				       			}
				       			var time=list[i].create_time.split(' ');
								nowli+='<div class="same">'
								+'<li ><img src="'+headImg+'" alt="" /></li>'
								+'<li >'+list[i].username+'</li>'
								+'<li >'+list[i].phone+'</li>'
		 						+'<li >'+time[0]+'</li>'
		 						+'</div>'				
					}
						$('#record').html(nowli);
				}
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

function queryRecommendBussness(urId) {
	AjaxUtil.exeScript({
		script : "managers.recommand.recommendpage",
		needTrascation : true,
		funName : "queryRecommendBussness",
		form : {
			userNo : urId
		},
		success : function(data) {
			console.log($api.jsonToStr(data));
			var listInfo = data.formDataset.bussnessList;
			var list = eval(listInfo);
			console.log('list'+list);
			console.log('listInfo'+listInfo);
			if (data.formDataset.checked == 'true') {
				if (list==undefined || list=='' || list.length  ==''||list.length == 0 ) {
					api.toast({
					msg : "亲，您暂时没有推荐商家记录！"
				});
					return false;
				} else {
					var nowli="";
					for (var i = 0; i < list.length; i++) {
								var headImg="";
								if(String(list[i].head_image)== "null" || String(list[i].head_image)== "undefined"){
				       					headImg='../../image/eggList/icon_c.png';
				       			}else{
				       				headImg=rootUrl+list[i].head_image;
				       			}
				       			var time=list[i].create_time.split(' ');
								nowli+='<div class="same">'
										+'<li ><img src="'+headImg+'" alt="" /></li>'
										+'<li >'+list[i].username+'</li>'
										+'<li >'+list[i].phone+'</li>'
		 								+'<li >'+time[0]+'</li>'
		 								+'</div>'				
					}
						$('#busRecord').html(nowli);
				}
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

}
