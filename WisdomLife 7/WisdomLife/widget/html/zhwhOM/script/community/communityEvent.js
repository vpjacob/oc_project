//查找圈子信息
function getCommunitylList(searchFlag){
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getCommunityList",
		form: "{ownerId:'"+uid+"',itemsPerLoad:1000,lastIndex:0}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data:_data,
		type: 'post',
		success: function(data) {
						// 生成新条目的HTML
		initCommunitylList(data,searchFlag);
			if(typeof(api) != 'undefined'){
				writeFile(data,'community',1);
				iCache($$('.cache'),"/community/pic/");
			}
		}
	});
}
//查找圈子中的动态
getCommunityDyList = function(searchFlag,communityId,dynamicLastId,fromPageType){
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getCommunityDynamicList",
		form: "{communityId: '"+communityId+"',dynamicLastId: '"+dynamicLastId+"',beginLat: "+user_lat+",beginLon: "+user_lon+",pageCount: 20}"
	};
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data: _data,
		type: 'post',
		success: function(data) {
			
			// 生成新条目的HTML
			initCommunityDyList(data,searchFlag,communityId,fromPageType);
			if(typeof(api) != 'undefined' && searchFlag != 2){
				writeFile(data,'communityDyAll',communityId);
				iCache($$('.cache'),"/communityDy/pic/");
			}
		}
	});
}

//查找单个圈子
getCommunityForDy = function(searchFlag,communityId){
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getCommunityOneForDy",
		form: "{communityId:'"+communityId+"'}"
	};
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data: _data,
		type: 'post',
		success: function(data) {
			// 生成新条目的HTML
			initCommunityDyOne(data,searchFlag,communityId);
			if(typeof(api) != 'undefined'){
				writeFile(data,'communityDy',communityId);
				iCache($$('.cache'),"/communityDy/pic/");
			}
		}
	});
}

//查找需要提示的成员
searchManageForMessaage = function(){
	
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getCommunityJoinMessage",
		form: "{userId: '"+uid+"'}"
	};
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data: _data,
		type: 'post',
		success: function(data) {
			var resultDy = data.datasources[0].rows;
			for (var i = 0; i < resultDy.length; i++) {
					api.notification({
						notify : {
							content : '新成员申请加入',
							extra:'applyNews'
						}
					}, function(ret, err) {
						if (ret && ret.id) {
						}
					});
			}
		}
	});
	
//	$$.ajax({
//		url: server_address + 'index.php/community/Community_ajax/getCommunityJoinMessage',
//		dataType: 'json',
//		data: {
//			userId: uid
//		},
//		type: 'post',
//		success: function(data) {
//			var resultDy = data.communityJoinMess;
//			for (var i = 0; i < resultDy.length; i++) {
//					api.notification({
//						notify : {
//							content : '新成员申请加入'
//						}
//					}, function(ret, err) {
//						if (ret && ret.id) {
//							
//						}
//					});
//			}
//		}
//	});
}

//查找需要提示的成员
searchManageForList = function(){
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getCommunityJoinPersons",
		form: "{userId: '"+uid+"'}"
	};
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data: _data,
		type: 'post',
		success: function(data) {
			var resultDy = data.datasources[0].rows;
			// 生成新条目的HTML
			initCommunityManageForList(resultDy);
		}
	});
	
//	$$.ajax({
//		url: server_address + 'index.php/community/Community_ajax/getCommunityJoinPersons',
//		dataType: 'json',
//		data: {
//			userId: uid
//		},
//		type: 'post',
//		success: function(data) {
//			var resultDy = data.communityJoinMess;
//			// 生成新条目的HTML
//			initCommunityManageForList(resultDy);
//		}
//	});
}

$$(document).on('click','#submitCommunityJoin',function(){
	var communityname = $$(this).data("communityname");
	var communityId = $$(this).data("communityId");
	var joinUserId = $$(this).data("joinUserId");
	var cardId = communityId + 'resultJoinMess';
			$$('#'+cardId).remove();
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: true,
		funName: "saveCommunityPersonYes",
		form: "{userId: '"+uid+"',communityId:'"+communityId+"',joinUserId:'"+joinUserId+"',communityname:'"+communityname+"'}"
	};		
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data: _data,
		type: 'post',
		success: function(data) {
//			Auto517.RongCloud.joinGroup(communityId,communityname);
			//融云
			
			
		}
	});
	
//	$$.ajax({
//		url: server_address + 'index.php/community/Community_ajax/saveCommunityPersonYes',
//		dataType: 'json',
//		data: {
//			userId: uid,
//			communityId: communityId,
//			joinUserId: joinUserId
//		},
//		type: 'post',
//		success: function(data) {
//			
//		}
//	});
});

$$(document).on('click','#concelCommunityJoin',function(){
	var communityId = $$(this).data("communityId");
	var joinUserId = $$(this).data("joinUserId");
	var cardId = communityId + 'resultJoinMess';
			$$('#'+cardId).remove();
			
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: true,
		funName: "saveCommunityPersonNo",
		form: "{userId: '"+uid+"',communityId:'"+communityId+"',joinUserId:'"+joinUserId+"'}"
	};		
		
	$$.ajax({
	url: rootUrl + "/api/execscript",
	dataType: 'json',
	data: _data,
	type: 'post',
	success: function(data) {
		
	}
});
		
//	$$.ajax({
//		url: server_address + 'index.php/community/Community_ajax/saveCommunityPersonNo',
//		dataType: 'json',
//		data: {
//			userId: uid,
//			communityId: communityId,
//			joinUserId: joinUserId
//		},
//		type: 'post',
//		success: function(data) {
//			
//		}
//	});
});


//进入动态详情页面方法
var dynamicInfo=function(communityId,dynamicId,fromPageType){
	 mainView.router.loadPage('html/community/communityInfoDetailed.html?communityId=' + communityId + '&communityDyId=' + dynamicId+ '&fromPageType='+fromPageType);
}

myApp.onPageInit('aboutgroup', function(page) {
	searchManageForList();
});

$$(document).on('click','.community_discuss',function(){
		var dynamicID=$$(this).data('ids');
		var communityId=$$(this).data('communityId');
		var pageId = myApp.getCurrentView().activePage.container.id;
		$$('#'+pageId).append('<div class="modal-overlay modal-overlay-visible"></div>');
		Auto517.UIChatbox._uichatbox_open(function(content) {
			Auto517.UIChatbox._im_transText(content);
			sendComComment(content,dynamicID,communityId);
		});
		
		
	
})


function sendComComment(content,dynamicID,communityId){
	var dynamicComment='';
	dynamicComment+='<div class="list-block" style="margin-top:0px;margin-bottom:0px;margin-left:15%;margin-right:20px;padding:0px;background-color:#F3F3F5;line-height:25px;">';
	dynamicComment+='	<ul >';
	dynamicComment+='		<li style="border-bottom:1px;">';
	dynamicComment+='	       <div class="item-title" style="font-size:14px;padding:0px;margin:0px;"><span style="color:#0EAAE3;">'+uname+':</span>&nbsp;&nbsp;'+window.Auto517.UIChatbox._im_transText(content)+'</div>';
	dynamicComment+='	     </li>' ;
	dynamicComment+='	</ul>';
	dynamicComment+='</div>';
	$$('#dy'+dynamicID).find('.comment').append(dynamicComment);
	var num = $$('#dy'+dynamicID).children('div').next('a').next('div').children('div').next('div').children('div').next('div').children('span').html();
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: true,
		funName: "saveCommunityComArea",
		form: "{communityId:'"+communityId+"',dynamicId:'"+dynamicID+"',uid:'"+uid+"',areaText:'"+Auto517.p_emotion.utf16toEntities(content)+"'}"

	};
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data:_data,
		type: 'post',
		success: function(data) {
			num=parseInt(num)+1;
			$$('#dy'+dynamicID).children('div').next('a').next('div').children('div').next('div').children('div').next('div').children('span').html(num);
			Auto517.UIChatbox._inputBar_closeBoard();
			Auto517.UIChatbox._inputBar_close();
			$$('.modal-overlay').remove();
		}
	});
}

$$(document).on('click', '.modal-overlay,.close-picker', function() {
		$$('.modal-overlay').remove();
		Auto517.UIChatbox._inputBar_closeBoard();
		Auto517.UIChatbox._inputBar_close();
});
