var urId;
apiready = function() {
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
	$("#apply").click(function() {
		var yj = $("#yj").val();
		if(yj == ''){
			alert("请填写反馈意见！");
			return false;
		}
		applyExe(urId);
	});

	function applyExe(user_no) {
		AjaxUtil.exeJS({
			method : "insertOpinion.jhtml", //请求方法名
			form : {
				"yhbh" : user_no,
				"suggest" : $("#yj").val(),
				"email" : $("#lx").val()
			},
			success : function(data) {
				api.toast({
					msg : '意见反馈成功！',
					location : 'middle',
					global : true
				}); 
				api.closeWin({
				})
			}
		});
	}

}
