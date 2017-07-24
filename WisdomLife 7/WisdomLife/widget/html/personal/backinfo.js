var id;
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	
	$('#back').click(function(){
		api.closeWin({
        });
	})
//	FileUtils.readFile("info.json", function(info, err) {
//			urId=info.userNo;
//			record(urId);
//			//total(urId);
//		});
	
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

//api.getPrefs({
//	    key: 'countId'
//	}, function(ret, err) {
//	     var countId = ret.value;
//	     console.log('countId'+countId);
//	     if(countId!=undefined && countId!=''){
//	     	record(countId);
//	     	api.setPrefs({
//				    key: 'countId',
//				    value: ''
//			});
//	     }
//});
id = api.pageParam.id;

record(id);
//详情
function record(countId) {
	AjaxUtil.exeScript({
		script : "mobile.accountdetail.accountdetail",
		needTrascation : true,
		funName : "queryBuyBackDetail ",
		form : {
//			userNo : urId,
			id:countId
		},
		success : function(data) {
			var list=$api.strToJson(data.formDataset.buyBackDetail);
			if (data.formDataset.checked == 'true'){					
					list.username==null?$('#username').html(0.00):$('#username').html(list.username);
					list.apply_time==null?$('#apply_time').html(0.00):$('#apply_time').html(list.apply_time);
					list.phone==null?$('#model').html(0.00):$('#model').html(list.phone);
					list.open_bank==null?$('#open_bank').html(0.00):$('#open_bank').html(list.open_bank);
					list.card_no==null?$('#card_no').html(0.00):$('#card_no').html(list.card_no);
					list.amount==null?$('#amount').html(0.00):$('#amount').html(list.amount);
					list.amount==null?$('#count').html(0.00):$('#count').html(list.amount);
					list.buy_no==null?$('#buyNo').html(0.00):$('#buyNo').html(list.buy_no);
					list.factorage==null?$('#factorage').html(0.00):$('#factorage').html(list.factorage);
					list.actual_amount==null?$('#actual_amount').html(0.00):$('#actual_amount').html(list.actual_amount);
					list.reason==null?$('#reason').html('无'):$('#reason').html(list.reason);
					if(list.apply_status==null ||list.apply_status==0){
						$('#apply_status').html('无');
					}else if(list.apply_status==1){
						$('#apply_status').html('申请中');
					}else if(list.apply_status==2){
						$('#apply_status').html('申请完成');
					}else if(list.apply_status==3){
						$('#apply_status').html('申请失败');
					}
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}
	
}