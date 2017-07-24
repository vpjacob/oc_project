apiready = function(){
    var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var content = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
	}

     $("#choose").on('click',function(){
    var top=$(this).children().hasClass('icon-top');
       if(top){
          $(".secondul").show();
          $(this).children().removeClass('icon-top').addClass('icon-down');
       }else{
          $(".secondul").hide();
          $(this).children().removeClass('icon-down').addClass('icon-top');
       }
    })
    $("#back").bind("click", function() {
		api.closeWin();
	});
	
	$('#aboutWeek').click(function(){
	   hideUl();
	   getInfo('2', '1');
	})
	$('#aboutMonth').click(function(){
	   hideUl();
	   getInfo('3', '1');
	})
	$('#aboutQuarter').click(function(){
	   hideUl();
	   getInfo('4', '1');
	})
	$('#halfYear').click(function(){
	   hideUl();
	   getInfo('5', '1');
	})
}

function hideUl(){
    $(".secondul").hide();
	$('.icon-down').removeClass('icon-down').addClass('icon-top');
}
function getInfo(messagetype, toPage) {
	api.showProgress();
	api.ajax({
		url : rootUrl + '/api/commmonweal/donateList',
		method : 'post',
		data : {
			values : {
				dateType : messagetype,
				toPage : toPage,
				pageSize : 10
			}
		}
	}, function(ret, err) {
		api.hideProgress();
//		alert($api.jsonToStr(ret));
		if (ret) {
			if (ret.execStatus == "true") {
				var result = ret.formDataset.entity;
				if (messagetype == "2") {//近一周
					getWeek(result);
				} else if (messagetype == "3") {//近一个月
					setMonth(result);
				} else if (messagetype == "4") {//近一个季度
					setQ(result);
				}else if (messagetype == "5") {//近半年
					sethalfYear(result);
				}
			} else {
				api.hideProgress();
				api.toast({
					msg : "数据请求失败，请重试"
				});
			}
		} else {
			api.hideProgress();
			api.toast({
				msg : "数据请求失败，请重试"
			});
		}
	})
}


function getWeek(info) {
//	var totalItem = info.totalItem;
//	if (totalItem == "0") {
//		$("#back_tab1").show();
//	} else {//数据不为0  背景隐藏
//		$("#back_tab1").hide();
//	}
}

function setMonth(info) {
//	var totalItem = info.totalItem;
//	if (totalItem == "0") {
//		$("#back_tab2").show();
//	} else {//数据不为0  背景隐藏
//		$("#back_tab2").hide();
//	}
}

function setQ(info) {
//	var totalItem = info.totalItem;
//	if (totalItem == "0") {
//		$("#back_tab3").show();
//	} else {//数据不为0  背景隐藏
//		$("#back_tab3").hide();
//		$('li').remove();
//		var length = info.list.length;
//		var newsResult = "";
//		for (var i = 0; i < length; i++) {
//			var result = nowli.replace("\"[content]\"", info.list[i].content);
//			result= result.replace("\"[messagetime]\"", info.list[i].messagetime);
//			newsResult+=result;
//		}
//		$('#tab3').append(newsResult);
//	}
}

function sethalfYear(info) {
//	var totalItem = info.totalItem;
//	if (totalItem == "0") {
//		$("#back_tab2").show();
//	} else {//数据不为0  背景隐藏
//		$("#back_tab2").hide();
//	}
}