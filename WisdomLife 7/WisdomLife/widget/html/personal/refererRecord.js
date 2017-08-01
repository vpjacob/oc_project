var urId;
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var content = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
	}
	
	FileUtils.readFile("info.json", function(info, err) {
			urId=info.userNo;
			record(urId);
		});
	
	$("#back").bind("click", function() {
		api.closeWin();
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
			//console.log('list'+list);
			//var list=$api.strToJson(listInfo)

			if (data.formDataset.checked == 'true') {
				if (list==undefined || list=='' || list.length  ==''||list.length == 0 ) {
					api.toast({
					msg : "亲，您暂时没有推荐记录！"
				});
					return false;
				} else {
					//$('#ul_tab2').empty();
					for (var i = 0; i < list.length; i++) {
//						var nowli = '<div class="same"><li class="delete"><div class="detailone"><span class="detailLeft">推荐人：</span></div><span class="detailnumber">'+list[i].username+'</span></li>'
//								+ '<li class="delete"><div class="detailone"><span class="detailLeft">电话 ：</span></div><span class="detailnumber">'+list[i].phone+'</span></li>'
//	 							+ '<li class="delete"><div class="detailone"><span class="detailLeft">推荐时间：</span></div><span class="detailnumber">'+list[i].create_time+'</span></li>';
								if(list[i].head_image==null||list[i].head_image==undefined){
				       					list[i].head_image='../../image/morenpic_03.png';
				       			}
				       			var time=list[i].create_time.split(' ');
								var nowli='<div class="same">'
								+'<li ><img src="'+rootUrl+list[i].head_image+'" alt="" /></li>'
								+'<li >'+list[i].username+'</li>'
								+'<li >'+list[i].phone+'</li>'
		 						+'<li >'+time[0]+'</li>'
		 						+'</div>'				
						$('#record').append(nowli);
					}
				}
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}
}
