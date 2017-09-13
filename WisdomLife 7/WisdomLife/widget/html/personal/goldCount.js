var urId;
apiready = function() {
	var header = $api.byId('header');
	var top = $api.byId('top');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
		$api.css(top, 'margin-top:20px;');
	}
	$('#back').click(function(){
		api.closeWin({
        });
	});
	
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    record(urId);
		
	$('#jinbicount').click(function() {
		api.openWin({
			name : 'jinbicount',
			url : 'jinbicount.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	
	$('#yinbicount').click(function() {
		api.openWin({
			name : 'yinbicount',
			url : 'yinbicount.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#tjcount').click(function() {
		api.openWin({
			name : 'tjcount',
			url : 'tjcount.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#buyback').click(function() {
		api.openWin({
			name : 'backcount',
			url : 'backcount.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#goldPay').click(function() {
		api.openWin({
			name : 'goldPay',
			url : 'goldPay.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
function record(urId) {
	AjaxUtil.exeScript({
		script : "mobile.accountdetail.accountdetail",
		needTrascation : true,
		funName : "queryAllAccountInfo",
		form : {
			userNo : urId
		},
		success : function(data) {
			console.log($api.jsonToStr(data));
			var listInfo = data.formDataset;
			var list=$api.jsonToStr(data.formDataset);
			console.log('data.formDataset'+list);
			if (data.formDataset.checked == 'true') {
					data.formDataset.balance==0?$('#balance').html(0.00):$('#balance').html(data.formDataset.balance);
					data.formDataset.mayBack==0?$('#mayBack').html(0.00):$('#mayBack').html(data.formDataset.mayBack);
					data.formDataset.alreadyBack==null?$('#alreadyBack').html(0.00):$('#alreadyBack').html(data.formDataset.alreadyBack);
					data.formDataset.goldAmount==null?$('#goldAmount').html(0.00):$('#goldAmount').html(data.formDataset.goldAmount);
					data.formDataset.silverAmount==null?$('#silverAmount').html(0.00):$('#silverAmount').html(data.formDataset.silverAmount);
					data.formDataset.recommendAmount==null?$('#recommendAmount').html(0.00):$('#recommendAmount').html(data.formDataset.recommendAmount);
					data.formDataset.alreadyBack==null?$('#goldback').html(0.00):$('#goldback').html(data.formDataset.alreadyBack);
					data.formDataset.goldUselessCount==null?$('#deadG').html(0.00):$('#deadG').html(data.formDataset.goldUselessCount);
					data.formDataset.silverUselessCount==null?$('#deadY').html(0.00):$('#deadY').html(data.formDataset.silverUselessCount);
					data.formDataset.payGoldCoinAmount==null?$('#payCount').html(0.00):$('#payCount').html(data.formDataset.payGoldCoinAmount);
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}
	
	
	
	
	
	
	
	
	
	
}