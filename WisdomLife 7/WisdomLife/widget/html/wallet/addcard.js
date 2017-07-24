apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.paddingTwo');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:74px;');
	}
	bankLoad();
//	$("#submit").bind("click", function() {
//		var num = $("#num").val();
//		var vCode = $("#vCode").val();
//		var patrn = /^[a-zA-Z0-9]{8,26}$/;
//		if (num.replace(/(^s*)|(s*$)/g, "").length == 0 || vCode.replace(/(^s*)|(s*$)/g, "").length == 0) {
//			api.alert({
//				msg : '输入的密码不能为空'
//			});
//		} else if (num.replace(/(^s*)|(s*$)/g, "").length < 8) {
//			api.alert({
//				msg : '输入的密码长度不能少于八位'
//			});
//		} else if (num != vCode) {
//			api.alert({
//				msg : '两次输入的密码必须保持一致'
//			});
//		} else if (!patrn.test(num)) {
//			api.alert({
//				msg : '密码只能由数字和字母组成'
//			});
//		} else {
//		}
//	});
    $('#submit').click(function(){
       var index=document.getElementById('selectBank').selectedIndex;
       var name=$('#personName').val();
       var bankName=document.getElementById('selectBank').options[index].text;
       var bankId=$('#selectBank').val();
       var bankNumber=$('#bankNumber').val();
       var reg = /^(\d{16}|\d{19})$/;
       if(!name){
          api.alert({
			   msg : '持卡人姓名不能为空'
		   });
       }else if(bankName=='请选择开户银行'){
          api.alert({
			   msg : '请选择开户银行'
		   });
       }else if(!reg.test(bankNumber) || !bankNumber){
          api.alert({
			   msg : '请输入正确银行卡号'
		   });
       }else{
           getCommit(bankId,name,bankNumber);
       }
    })
	$("#back").bind("click", function() {
		api.closeWin();
	});
};

/**
 *加载银行 /api/commmonweal/savebank
 */
function bankLoad() {
	var selectBank = document.getElementById("selectBank");
	selectBank.innerHTML = "";
	var banka = new Option();
	banka.value = "请选择开户银行";
	banka.text = "请选择开户银行";
	selectBank.options.add(banka);
	for (var i = 0; i < bank.length; i++) {
		var banka = new Option();
		banka.value = bank[i].bankcode;
		banka.text = bank[i].bankname;		
		selectBank.options.add(banka);
	}
}

function getCommit(bankId,name,bankNumber) {
	api.showProgress();
	api.ajax({
		url : rootUrl + '/api/commmonweal/savebank',
		method : 'post',
		data : {
			values : {
				bankid : bankId,
				accountname : name,
				bankacount : bankNumber
			}
		}
	}, function(ret, err) {
		api.hideProgress();
//		alert($api.jsonToStr(ret));
		if (ret) {
			if (ret.execStatus == "true" && ret.formDataset.entity.code =="1") {
				api.toast({
					msg : "添加银行卡成功"
				});
			} else {
				api.hideProgress();
				api.toast({
					msg : "添加银行卡失败，请重试"
				});
			}
		} else {
			api.hideProgress();
			api.toast({
				msg : "添加银行卡失败，请重试"
			});
		}
	})
}