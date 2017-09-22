var memberid;
var urId='';
apiready = function() {
	memberid = api.pageParam.memberid;
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	$("#back").bind("click", function() {
		api.closeWin();
	});

	$("#regist").bind("click", function() {
		var tel = $(".num").val();
		var mess = $(".conter").val();

		//		reg = /^(?=.{6,25})(?=.*[a-z])(?=.*[0-9])[0-9a-z]*$/;
		var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
		//手机号
		var reg1 = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/;
		//邮箱
		var reg2 = /^[1-9]\d{4,8}$/;
		// QQ
		if (!reg.test(tel) && !reg1.test(tel) && !reg2.test(tel)) {
			api.alert({
				msg : '请您留下正确的联系方式'
			}, function(ret, err) {
				$(".num").val("").focus();
			});
			return;
		}

		if (tel == '' || mess == '') {
			alert('请填写反馈信息或者留下您的联系方式');
			return;
		}
		AjaxUtil.exeScript({//插入一条反馈
			script : "managers.feedback.feedback",
			needTrascation : false,
			funName : "insertFeedBack",
			form : {
				feedback_no:urId,
				feedback_type:$("#picker").val(),
				feedback_content:$(".conter").val(),
				//memberid : memberid,
//				feedtype : $("#picker").val(),
//				feed : $(".conter").val(),
				link : $(".num").val()
			},
			success : function(data) {//请求成功
							console.log(JSON.stringify(data));
				if (data.execStatus === "true" && data.formDataset.checked === "true") {
					$(".hide").show();
					$(".good").bind("click", function() {
						$(".hide").hide();
						api.closeWin();
					});
				} else {
					api.alert({
						msg : '提交失败'
					}, function(ret, err) {
						//coding...
					});

				}
			}
		});
	});
};
