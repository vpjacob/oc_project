var memberid;
var name;
apiready = function() {
    var header = $api.byId('header');
	if(api.systemType=='ios')
	{	  
	    var cc=$api.dom('.content');
		$api.css(header,'margin-top:20px;');
		$api.css(cc,'margin-top:20px;');		
	}
	memberid = api.pageParam.memberid;
	name = api.pageParam.name;
	
	$("#keywods").click(function() {
	
		var word1 = $("#word1").val() == null ? "" : $("#word1").val();
		var word2 = $("#word2").val() == null ? "" : $("#word2").val();
		var word3 = $("#word3").val() == null ? "" : $("#word3").val();
		var word4 = $("#word4").val() == null ? "" : $("#word4").val();
		var word5 = $("#word5").val() == null ? "" : $("#word5").val();
		
		var keyword = word1 + "," + word2 +"," + word3 + "," + word4 + "," + word5;
		//alert(keyword);
				

		AjaxUtil.exeScript({
		
			script : "managers.home.person",
			needTrascation : false,
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
				keyword : keyword,
				couple : "",
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