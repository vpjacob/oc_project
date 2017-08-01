apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	
	$('#back').click(function(){
		api.closeWin({
        });
	})
	
	FileUtils.readFile("info.json", function(info, err) {
			urId=info.userNo;
			silverAmount(urId);
			total(urId);
		});
	
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
	
function silverAmount(urId) {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "queryBeatSilverEggRecord",
		form : {
			userNo : urId
		},
		success : function(data) {
			var listInfo = data.formDataset.recordList;
			var list = eval(listInfo);
			//console.log('list.length' + list.length);
			if (data.formDataset.checked == 'true') {
				if (list==undefined || list=='' || list.length  ==''||list.length == 0 ||list.length==undefined) {
					api.toast({
						msg : "亲，您暂时没有记录哦！"
					});
					return false;
				}else{	
					for (var i = 0; i < list.length; i++) {
						//var nowli = '<li class="item-content"><div class="item-inner"><div class="item-title">' + list[i].beat_time + '</div><div class="item-mid">' + '<img src="../../image/jin.png" alt="" class="img1"/><span  class="span1">' + list[i].egg_count + '</span></div><div class="item-last"><img src="../../image/jinbi.png" alt="" class="img2"/>' + '<span class="span2">' + list[i].beat_money + '</span></div></div></li>';
						var nowli='<div class="same">'
								+'<div class="left">'+ list[i].beat_time +'</div>'
								+'<div class="right">'
								+'<img src="../../image/yin.png"/>'
								+'<span>' + list[i].egg_count+ '</span>'
								+'</div>'
								+'<div class="mid">'
								+'<img src="../../image/jinbi.png"/>'
								+'<span>' + list[i].beat_money + '</span>'
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
function total(urId) {
	AjaxUtil.exeScript({
		script : "mobile.accountdetail.accountdetail",
		needTrascation : true,
		funName : "querySilverAmount",
		form : {
			userNo : urId
		},
		success : function(data) {
			//var listInfo = data.formDataset;
			var list=$api.jsonToStr(data.formDataset);
			if (data.formDataset.checked == 'true') {
					data.formDataset.silverAmount==null?$('#silverAmount').html(0):$('#silverAmount').html(data.formDataset.silverAmount);
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}	
	
	
}
