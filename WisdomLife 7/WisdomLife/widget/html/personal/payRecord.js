apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	};
	
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    queryPayMerchantRecord(urId);

	function queryPayMerchantRecord(urId) {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.center.pay.pay",
			needTrascation : true,
			funName : "queryPayMerchantRecord  ",
			form : {
				userNo : urId
			},
			success : function(data) {
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.payRecordList;
					var list = $api.strToJson(account);
					console.log($api.jsonToStr(data));
					if (list == undefined || list == '' || list.length == '' || list.length == 0 || list.length == undefined) {
						api.toast({
							msg : "亲，您暂时没有支付记录！"
						});
					} else {
						for (var i = 0; i < list.length; i++) {
							var type=""
							if(list[i].pay_type==1){
								type="支付宝"
							}else if(list[i].pay_type==2){
								type="金币余额"
							}else if(list[i].pay_type==3){
								type="微信支付"
							}
							var nowList='<div class="box">'
									+'<div class="bottom">'	
									+'<div class="user">'
		                            +'<div class="same">' 
									+'<span>商家名称：</span>'
									+'<span>'+list[i].merchant_name+'</span>'
									+'</div>'
									+'</div>'	
									+'<div class="user">'
									+'<div class="same">'	
									+'<span>商家ID：</span>'
									+'<span>'+list[i].merchant_no+'</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'	
									+'<span>支付类型：</span>'
									+'<span>'+type+'</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'	
									+'<span>支付金额：</span>'
									+'<span>'+list[i].mount+'</span>'
									+'</div>'
									+'</div>'
									+'<div class="user">'
									+'<div class="same">'	
									+'<span>支付时间：</span>'
									+'<span>'+list[i].create_time+'</span>'
									+'</div>'
									+'</div>'
									+'</div>'
									+'</div>'
						$('#showLists').append(nowList);
						}
					}

				} else {
					alert(data.formDataset.errorMsg);
				}
			}
		});
	}


	
}
function goBack() {
	api.closeWin({
	});
}

var flag = true;
$("#choose").click(function() {
	if (flag == true) {
		$(".secondul").show();
		flag = false;
	} else {
		$(".secondul").hide();
		flag = true;
	}
}); 

$("#seven").click(function() {
	alert('待开通');
});
$("#mouth").click(function() {
	alert('待开通');
});
$("#mouths").click(function() {
	alert('待开通');
});
$("#halfYeay").click(function() {
	alert('待开通');
});



