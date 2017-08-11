apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	};
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		queryPayMerchantRecord(urId);

	});

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
							var time=list[i].create_time.split(' ');
							var nowList='<div class="same">'
									+'<div class="sameBox">'
									+'<div class="left">'
									+'<span>'+time[0]+'</span>'
									+'<span>'+time[1]+'</span>'
									+'</div>'
									+'<div class="mid">'
									+'<span>商家ID</span>'
									+'<span>'+list[i].merchant_no+'</span>'
									+'</div>'
									+'<div class="right">'
									+'<span >'+list[i].mount+'元</span>'
									+'<span >'+list[i].merchant_name+'</span>'
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



