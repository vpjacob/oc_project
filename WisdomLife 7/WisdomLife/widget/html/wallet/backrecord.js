//var nowli = '<li class="item-content"><div class="item-inner"><div class="item-title">\"[withdrawno]\"</div>' + '<div class="item-after"><i class="iconfont icon-meidou"></i><span  class="detailnumber">\"[beannum]\"</span>' + '</div><div class="item-after"><span class="detaildate">\"[applytime]\"</span></div></div></li>';
//var nowTab = 1;
////默认
//var page1 = true;
//var page2 = true;
//var page3 = true;
//var pageNum1 = 1;
//var pageNum2 = 1;
//var pageNum3 = 1;
//控制刷新方法的触发
//var isRefresh = true;
var urId
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var content = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
	}
	FileUtils.readFile("info.json", function(info, err) {
			urId=info.userNo;
			change(1,'#ul_tab1',urId);
		});
	
	
//	var height = $('.buttons-tab').height();
//	$('.content-block').css('margin-top', height + 'px');

//	$("#choose").on('click', function() {
//		var top = $(this).children().hasClass('icon-top');
//		if (top) {
//			$(".secondul").show();
//			$(this).children().removeClass('icon-top').addClass('icon-down');
//		} else {
//			$(".secondul").hide();
//			$(this).children().removeClass('icon-down').addClass('icon-top');
//		}
//	})
	$("#back").bind("click", function() {
		api.closeWin();
	});
	//status：“类型//1:回购完成    0：回购申请中   2：回购失败”
	
	$("#a_tab1").on('click', function() {
		change(1,'#ul_tab1');
		$('li').remove();
		
	});
	$("#a_tab2").on('click', function() {
		change(2,'#ul_tab2');
		$('li').remove();
	});
	$("#a_tab3").on('click', function() {
		change(3,'#ul_tab3');
		$('li').remove();

	});
	
	function change(flag,changeId){
		AjaxUtil.exeScript({
	      script:"mobile.buyback.buyback",
	      needTrascation:true,
	      funName:"queryBuyBackRecord",
	      form:{
	       userNo:urId,
	       status:flag
	      },
	      success:function (data) {
	      	var listInfo = data.formDataset.buyBackRecord;
			var list = eval(listInfo);
		//	console.log('list.length' + list.length);
			if (data.formDataset.checked == 'true') {
				if (list.length==undefined ||list.length== 0 ||list.length=='') {
					api.toast({
					msg : "亲，您暂时没有相关数据！"
				});
				} else {
					//$('#ul_tab2').empty();
					
					for (var i = 0; i < list.length; i++) {
						var nowli ='<li class="item-content"><div class="item-inner"><div class="item-title">'+list[i].apply_time+'</div>' 
								  + '<div class="item-mid"><span  class="detailnumber"><img src="../../image/jinbi.png" alt="" class="img1"/><span class="spans">'+list[i].amount+'</span></span>' 
								  + '</div><div class="item-last"><span class="detaildate">'+list[i].open_bank+'</span></div></div></li>'
							$(changeId).append(nowli);
						}
					}
				} else {
						alert(data.formDataset.errorMsg);
					}
	       }
	    });
	}

}
