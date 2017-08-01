var urId;
apiready = function() {

FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		count(urId);
	});
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		//var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		//$api.css(cc, 'margin-top:20px;');
	}
	$('#toBack').click(function(){
		goBack();
	});
	
	$('#myrecord').click(function() {
		api.openWin({
			name : 'myrecord',
			url : '../wallet/myrecord.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#myegg').click(function() {
		api.openWin({
			name : 'myegg',
			url : '../wallet/myegg.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	
	//收益明细跳转
$('#incomeInfo').click(function() {
		api.openWin({
			name : 'goldCount',
			url : 'goldCount.html',
			reload : true,
			
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});	
	$('#wallet_buyback').click(function() {
		api.openWin({
			name : 'buyback',
			url : '../wallet/buyback.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	
}

function count(urId) {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "queryEggInfo",
		form : {
			userNo : urId
		},
		success : function(data) {
			if (data.formDataset.checked == 'true') {
				var account = data.formDataset.account;
				var list = $api.strToJson(account);
				$("#dotleft").html(list.gold_egg_count);
				$("#dotmidd").html(list.silver_egg_count);
				$("#dotright").html(list.balance_gold);

			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

function goBack() {
	api.closeWin({
	});
}	
