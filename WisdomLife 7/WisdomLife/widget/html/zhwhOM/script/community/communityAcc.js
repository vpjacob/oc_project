/**
 * *举报圈子
 * */
myApp.onPageInit('communityInfoAccusation', function(page) {
	//被举报圈子ID
	var communityID = page.query.communityId;
	$$('#jubao_quanzi').attr('onclick', 'communityInfoAccusation_confirm("' + communityID + '");');
});
/*
 举报圈子
 * */
function communityInfoAccusation_confirm(communityID) {
	var report = $$("#report_community input[type = 'radio']:checked").next('div').find('span').html();

				var myApp = new Framework7({
					modalButtonOk: '确定',
					modalButtonCancel: '取消 '
				}); 
				myApp.confirm('是否确定提交举报该圈子？', '', function() {
					Auto517.UIChatbox._inputBar_close();
					mainView.router.loadPage('html/community/communityMain.html?reloadCommunityPage=1');
					
					var _data = {
						script: "managers.om.community.appcommunity",
						needTrascation: true,
						funName: "saveCommunityReport",
						form: "{communityId: '"+communityID+"',uid:'"+uid+"',report: '"+report+"'}"
				    };
	
					$$.ajax({
						url: rootUrl + "/api/execscript",
                        dataType: 'json',
                        type: 'post',
                        data: _data,
                        success: function(data) {
                       }
					});

                    var data = {
					script: "managers.om.community.appcommunity",
					needTrascation: false,
					funName: "deleteDecommunity",
					form: "{toCommunityID: '"+communityID+"',uid:'"+uid+"'}"
				    };
                    
					$$.ajax({
                           url: rootUrl + "/api/execscript",
                           data: data,
                           dataType: 'json',
                           type: 'post',
                           timeout: 5000,
                           success: function(data) {
                                  toast.show('已拉黑 ');
                              }
                           });
					},
					function() {

					}
				);
//	var report = $$("#report_community input[type = 'radio']:checked").next('div').find('span').html();
//
//	var myApp = new Framework7({
//		modalButtonOk: '确定',
//		modalButtonCancel: '取消 '
//	});
//	myApp.confirm('是否确定提交举报该圈子？', '', function() {
//			mainView.router.loadPage('html/community/communityMain.html?reloadCommunityPage=1');
//			$$.ajax({
//				url: server_address + 'index.php/community/community_ajax/saveCommunityReport ',
//				dataType: 'json',
//				type: 'post',
//				data: {
//					communityID: communityID,
//					uid: uid,
//					report: report
//				},
//				success: function(data) {
//
//				}
//			});
//
//			$$.ajax({
//				url: server_address + 'index.php/community/community_ajax/deleteDecommunity ',
//				data: {
//					uid: uid,
//					toCommunityID: communityID
//				},
//				dataType: 'json',
//				type: 'post',
//				timeout: 5000,
//				success: function(data) {
//					toast.show('已拉黑 ');
//					mainView.router.back();
//				}
//			});
//		},
//		function() {
//
//		}
//	);
}
/**
 * *举报动态
 * */

myApp.onPageInit('communityCircleNewsAcc', function(page) {
	//被举报圈子ID
	
	var communityID = page.query.communityId;
	var dynamicID = page.query.dynamicId;
	$$('#jubao_news').attr('onclick', 'communityNewsAccusation_confirm("' + communityID + '","' + dynamicID + '")');
});

/**
 * 举报返回
 */
myApp.onPageBack('communityCircleNewsAcc',function(){
	Auto517.UIChatbox._inputBar_show_hide("show");
});

/*
		 举报动态
		 * */
function communityNewsAccusation_confirm(communityID, dynamicID) {
	var report = $$("#report_community_news input[type = 'radio']:checked").next('div').find('span').html();

	var myApp = new Framework7({
		modalButtonOk: '确定',
		modalButtonCancel: '取消 '
	});
	myApp.confirm('是否确定提交举报该动态？', '', function() {
			//			mainView.router.loadPage('html/community/communityInfoList.html?reloadCommunityPage=1');
			
			var _data = {
					script: "managers.om.community.appcommunity",
					needTrascation: true,
					funName: "saveCommunityNewsReport",
					form: "{communityId: '"+communityID+"',uid:'"+uid+"',report: '"+report+"',dynamicId:'"+dynamicID+"'}"
				    };
			
			$$.ajax({
				url: rootUrl + "/api/execscript",
				dataType: 'json',
				type: 'post',
				data: _data,
				success: function(data) {
					mainView.router.back();
				}
			});


		},
		function() {

		}
	);
}