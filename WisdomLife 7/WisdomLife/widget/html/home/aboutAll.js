apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		document.body.addEventListener('touchstart', function () { });
		var cc = $api.dom('.box');
		if (api.screenHeight == 2436){
			$api.css(header, 'padding-top:2.2rem;');
			$api.css(header, 'height:4.4rem;');
			$api.css(cc, 'margin-top:4.4rem;');
		}else{
			$api.css(header, 'padding-top:1rem;');
			$api.css(header, 'height:3.2rem;');
			$api.css(cc, 'margin-top:3.2rem;');
		}
	}
	$("#aboutUs").bind("click", function() {
		api.openWin({//打开关于我们
			name : 'aboutus',
			url : '../personal/aboutus.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$("#serverP").bind("click", function() {
		api.openWin({//打开关于我们
			name : 'serverP',
			url : '../registe/serverP.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
		//版本信息
	$('#version').click(function() {
		api.accessNative({
			name : 'showVersionCode',
			extra : {
			}
		}, function(ret, err) {
			if (ret) {
				//                                    alert(JSON.stringify(ret));
			} else {
				//                                    alert(JSON.stringify(err));
			}
		});

	}); 
	$('#contactUs').click(function() {
		api.call({
			type : 'tel_prompt',
			number : 4000046177
		});
	});
}
function goBack() {
	api.closeWin();
}