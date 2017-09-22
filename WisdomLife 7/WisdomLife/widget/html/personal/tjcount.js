apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	
	$('#back').click(function(){
		api.closeWin({
        });
	})
	
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    Amount(urId);
	total(urId);
	
	$("#choose").on('click', function() {
		var top = $(this).children().hasClass('icon-top');
		if (top) {
			$(".secondul").show();
			$(this).children().removeClass('icon-top').addClass('icon-down');
		} else {
			$(".secondul").hide();
			$(this).children().removeClass('icon-down').addClass('icon-top');
		}
	});
function total(urId) {
	AjaxUtil.exeScript({
		script : "mobile.accountdetail.accountdetail",
		needTrascation : true,
		funName : "queryRecommendAmount",
		form : {
			userNo : urId
		},
		success : function(data) {
			//var listInfo = data.formDataset;
			var list=$api.jsonToStr(data.formDataset);
			console.log('data.formDataset'+list);
			if (data.formDataset.checked == 'true') {
					data.formDataset.recommendAmount==null?$('#recommendAmount').html(0):$('#recommendAmount').html(data.formDataset.recommendAmount);
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

function Amount(urId) {
	AjaxUtil.exeScript({
		script : "mobile.accountdetail.accountdetail",
		needTrascation : true,
		funName : "queryMyRecommendDeductList",
		form : {
			userNo : urId
		},
		success : function(data) {
			var listInfo = data.formDataset.recommendList;
			var list = eval(listInfo);
			//console.log('list.length' + list.length);
			if (data.formDataset.checked == 'true') {
				if (list==undefined || list=='' || list.length  ==''||list.length == 0 ||list.length==undefined ) {
					api.toast({
						msg : "亲，您暂时没有记录哦！"
					});
					return false;
				}else{	
					for (var i = 0; i < list.length; i++) {
						//var nowli = '<li class="item-content"><div class="item-inner"><div class="item-title">' + list[i].beat_time + '</div><div class="item-mid">' + '<img src="../../image/jin.png" alt="" class="img1"/><span  class="span1">' + list[i].egg_count + '</span></div><div class="item-last"><img src="../../image/jinbi.png" alt="" class="img2"/>' + '<span class="span2">' + list[i].beat_money + '</span></div></div></li>';
						
						var time=list[i].create_time.split(' ');
						//console.log('time'+time[0]);
						var nowli='<div class="same">'
								+'<div class="left">'+ time[0]+'</div>'
								+'<div class="mid">'
								+'<span>客户</span>'
								+'<span>'+ list[i].user_name +'</span>'
								+'</div>'
								+'<div class="right">'
								+'<img src="../../image/jinbi.png"/>'
								+'<span>' +list[i].referee_income + '</span>'
								+'</div>'
								+'</div>';
						$('#model').append(nowli);
					}
				}
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}
	
}