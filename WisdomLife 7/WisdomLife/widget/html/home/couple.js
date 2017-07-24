var memberid;
var couple;
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	memberid = api.pageParam.memberid;
	// 点击【保存】按钮获取选中的值传递给后台单独的方法。
	// 选中一个后变颜色
	$(".content span").click(function() {

		couple = $(this).attr("value");
		$(this).css("color", "blue");
		$(this).siblings().css("color", "black");
	});

	$("#couple").click(function() {

		AjaxUtil.exeScript({
			script : "managers.home.person",
			needTrascation : true,
			funName : "updatememberinfo",
			form : {
				headurl : "",
				nick : "",
				sex : "",
				birthday : "",
				address : "",
				telphone : "",
				pwd : "",
				idCard : "",
				c_user_sign : "",
				keyword : "",
				couple : couple,
				realname : "",
				memberid : memberid

			},
			success : function(data) {
				api.hideProgress();
				if (data.execStatus == 'true') {
					api.execScript({//刷新person界面数据
						name : 'room',
						script : 'refresh();'
					});
					api.execScript({//刷新person界面数据
						name : 'content',
						script : 'refresh();'
					});
					closePage();
				}
			}
		});

	});

	$('#goback').click(function() {
		closePage();

	});
}
function closePage() {
	api.closeWin();
}