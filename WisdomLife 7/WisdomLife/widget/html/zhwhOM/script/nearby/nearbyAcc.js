//举报用户
myApp.onPageInit('nearby_user_report', function(page) {
	//被举报人ID
	var userID = page.query.userID;
	var type = page.query.type;
//	$$("#nearby_user_report_back").on('click',function(){
//		window.Auto517.UIChatbox._inputBar_show_hide("show");
//		mainView.router.back();
//		
//	})
	$$('#jubao').attr('onclick', 'nearby_report_insertUser_confirm("' + userID + '","' + type + '");');
});
//举报用户
function nearby_report_insertUser_confirm(userID,innertype) {

	//举报内容report
	var report = $$("#report input[type='radio']:checked").next('div').find('span').html();
	//	var re = JSON.stringify(report);
	var myApp = new Framework7({
		modalButtonOk: '确定',
		modalButtonCancel: '取消'
	});
	myApp.confirm('是否确定提交举报该用户？', '', function() {
		var flag=1;
		if($$('input[name="same-black"]').prop('checked')==true){	
			flag=2;	
		}
		var _data = {
			script: "managers.om.user.user",
			needTrascation: true,
			funName: "getReport",
			form: "{userID: '"+userID+"',uid:'"+uid+"',report:'"+report+"',flag: "+flag+"}"
		};
		$$.ajax({
			url: rootUrl + "/api/execscript",
			method: 'post',
			dataType: 'json',
			data: _data,
			success: function(data) {
				if(data.execStatus == 'true'){
					toast.show("举报成功");
					if(flag==2){
						if(innertype == 1){
							mainView.router.loadPage('html/nearby/nearbyMain.html');
							getNearbyPersonnelList('0', $$('#personnel_time').val(),$$('#personnel_gender').val(),$$('#personnel_ageMin').val(),$$('#personnel_ageMax').val(), $$('#personnel_con').val());
						}else if(innertype == 3){
							mainView.router.back({
								url : 'html/maillist/maillist.html',
								force : true
							});
						}else if(innertype == 5){
							mainView.router.back({
								url : 'html/maillist/maillist.html?type=1',
								force : true
							});
						}else if(innertype == 4){
							mainView.router.back({
								url: 'html/maillist/addfriends.html',
								force: false
							});
						}
					}else{
						mainView.router.back(/*{
							url:'html/user/userinfo_view.html',
							force:false
						}*/);
					}
				}
				
			},
			error: function(xhr, type) {
				toast.show("举报失败");
			}
		});
		},
		function() {

		}
	);
}
//举报用户动态
myApp.onPageInit('nearby_news_report', function(page) {
	//被举报人ID
	//	var userID = page.query.userID;
	var dynamicID = page.query.dynamicId;

	$$('#jubao_nearby_news').attr('onclick', 'nearby_report_acc(' + dynamicID + ');');
});
//举报用户
function nearby_report_acc(dynamicID) {

	//举报内容report
	var report = $$("#report_nearby_news input[type='radio']:checked").next('div').find('span').html();
	//	var re = JSON.stringify(report);
	var myApp = new Framework7({
		modalButtonOk: '确定',
		modalButtonCancel: '取消'
	});
	myApp.confirm('是否确定提交举报该动态？', '', function() {
		var _data = {
			script: "managers.om.nearby.nearby",
			needTrascation: true,
			funName: "getDynamicReport",
			form: "{dynamicID: '"+dynamicID+"',uid:'"+uid+"',report:'"+report+"'}"
		};
		$$.ajax({
			url: rootUrl + "/api/execscript",
			method: 'post',
			dataType: 'json',
			data: _data,
			success: function(data) {
				if(data.execStatus == 'true'){
					toast.show("举报成功");
					mainView.router.back();
				}
				
			},
			error: function(xhr, type) {
				toast.show("举报失败");
			}
		});

//			$$.ajax({
//				url: rootUrl + 'index.php/nearby/personnel/Personnel_ajax/saveUserAccReport',
//				dataType: 'json',
//				type: 'post',
//				data: {
//
//					dynamicID: dynamicID,
//					uid: uid,
//					report: report
//				},
//				success: function(data) {
//
//					mainView.router.back();
//				}
//			});
			//			if ($$('input[name="same-black"]').prop('checked')) {
			//				$$.ajax({
			//							url: rootUrl + 'index.php/user/user_info/insertDefriend',
			//							data: {
			//								userID: uid,
			//								toUserID: userID
			//							},
			//							dataType: 'json',
			//							type: 'post',
			//							timeout: 5000,
			//							success: function(data) {
			//								toast.show('已拉黑');
			//							}
			//						});
			//			}
		},
		function() {

		}
	);
}