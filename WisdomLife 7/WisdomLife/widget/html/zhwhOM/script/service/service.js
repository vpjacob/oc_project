//
myApp.onPageInit('servicechat', function(page) {
	var messages = myApp.messages('.messages');
	Service.counselId 	     = page.query.counselId;
	Service.targetId 	     = page.query.targetId;
	Service.statu 		     = page.query.statu;
	Service.conversationtype = page.query.conversationtype;
	var name = page.query.name;
	$$('#c_nickName').html(name);
	//
	Service.clearBadge();
	Service.getHistoryMsg(0,20);
	Auto517.Message.getMsgToolBar($$('#servicechat'), Service.postKeyboard, Service.postImage);
	
	
	$$('.delete_button').on('click',function(){
		var chat_input = $$('.chat-input').val();
		var i = chat_input.lastIndexOf('[');
	    $$('.chat-input').val(chat_input.substr(0,i));
})
	
	//
	$$('#chat-back').on('click', function(){
		    Service.clearBadge();
			Service.listMyCounsel();
			Service.counselId 	= null;
			Service.targetId 	= null;
			Service.statu 	 	= null;
			Service.conversationtype = null;
		});
		
	var ptrContent = $$('.pull-to-refresh-content');
	var refreshFlag = true;
	// 添加'refresh'监听器
	var chu_count=0;
	ptrContent.on('refresh', function(e) {
		if(refreshFlag){
			refreshFlag =false;
				setTimeout(function(){
					chu_count ++;
					Service.getHistoryMsg(chu_count,20);
					myApp.attachInfiniteScroll($$('.pull-to-refresh-content'));
					myApp.pullToRefreshDone();
					refreshFlag =true;
				},2000);
		}
	});
	
	
});
//
myApp.onPageInit('myServiceList', function(page) {
	//
	searchManageForMessaage();
	Service.listMyCounsel();
	//

});

//
var Service = {
	//
	'counselId': null,
	//
	'targetId': null,
	//
	'statu': null,
	//
	'conversationtype':null,
	//
	'getHistoryMsg': function(pageNum,count){
//		return;
        var _data = {
			script: "managers.om.consult.consult",
			needTrascation: false,
			funName: "listMessage",
			form: "{c_consultid: '"+Service.counselId+"',c_senderUserId: '"+uid+"',c_receiverid: '"+uid+"',pageNum:"+pageNum+",count:"+count+"}"
			};
        
        $$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			data:_data,
			type: 'post',
			success: function(data) {
//					        	//
                var result = data.datasources[0].rows;
	        	console.clear();
//	        	console.log(' [ 获取消息历史 ] ', data);
	        	//未处理
//	        	if(result.status == 0){
//	        		//
//	        		if(result.msgList.length == 0){
	        			//var txtMsg = '您好！我是客服:' + globalVar.userinfo.c_nickname + '，编号:' + globalVar.uuid + '，如果您有任何问题，可以进行咨询！';
	        			//Service.sendTextMsg(Service.counselId, Service.targetId, txtMsg);	
//	        			Service.sendWelcomeMsg();
//	        		}
	        		//
//	        		if(result.msgList.length > 0){
	        			//
	        			var messages = myApp.messages('.messages');
	        			Auto517.Message.getHistoryMsg(messages, result);
//	        		}
//	        	}
	      }
		});
        

	},
	//
	'sendTextMsg': function(counselId, targetId, msg ,conversationtype){
		//
		var messages 	= myApp.messages('.messages');
		var userExtra 	= {
			'counselId': counselId,
			'userinfo': {
				'c_nickname': uname,
				'c_headimge': uimage,
				'c_type': 1
			},
			'type': 1
		};
		//
		///*
		// TxtMsg
		var txtCfg = {
			text : msg,
			avatar : rootUrl+uimage,
			type : 'sent',
			name : uname,
			day : (new Date().getMonth() + 1) + '-' + new Date().getDate(),
			time : (new Date()).getHours() + ':' + (new Date()).getMinutes()
		};
//		console.log("txtCfg="+JSON.stringify(txtCfg));
//		console.log("messages="+JSON.stringify(messages));
//		console.log("targetId="+JSON.stringify(targetId));
//		console.log("userExtra="+JSON.stringify(userExtra));
		//
		 Auto517.Message.addTxtMsg(messages, targetId, txtCfg, userExtra, conversationtype);
	},
	
	'sendImageMsg': function(counselId, targetId, imageUri, base64Str, conversationtype){
		var messages 	= myApp.messages('.messages');
		var userExtra 	= {
			'counselId': counselId,
			'userinfo': {
				'c_nickname': uname,
				'c_headimge': uimage,
				'c_type': ''
			},
			'type': 1
		};
		// ImageMsg
		var imgCfg = {
			text : '<img src = "'+base64Str+'" class = "show-swiper" onclick = showSwiper(this) data-pho = "'+rootUrl+imageUri+'" style="width:180px;height:230px;">',
			avatar : rootUrl+uimage,
			type : 'sent',
			name : uname,
			day : (new Date().getMonth() + 1) + '-' + new Date().getDate(),
			time : (new Date()).getHours() + ':' + (new Date()).getMinutes()
		};
		///*
		Auto517.Message.addImgMsg(messages, targetId, imgCfg, "", imageUri, userExtra, conversationtype);
	},
	
	//
	'receiveMsg': function(message){
		var content 	= message.content;
		var counselId 	= message.content.user.counselId;
		var userinfo 	= message.content.user.userinfo;
		var messages 	= myApp.messages('.messages');
		var txtMsg 		= content.content;
		var userExtra 	= {
			'counselId': Service.counselId,
			'userinfo': {
				'c_nickname':userinfo.c_nickname,
				'c_headimge':userinfo.c_headimge,
				'c_type': 1
			},
			'type': 1
		};
		///*
		// TxtMsg
		if(message.messageType == "TextMessage"){
			var txtCfg = {
			text : txtMsg,
			avatar : rootUrl+userinfo.c_headimge,
			type : 'received',
			name : userinfo.c_nickname,
			day : (new Date().getMonth() + 1) + '-' + new Date().getDate(),
			time : (new Date()).getHours() + ':' + (new Date()).getMinutes()
		};
		}else if(message.messageType == "ImageMessage"){
			var txtCfg = {
			text : '<img src = "'+rootUrl+content.imageUri+'" class = "show-swiper" onclick = showSwiper(this) data-pho = "'+rootUrl+content.imageUri+'" style = "width:180px;height:230px;">',
			avatar : rootUrl+userinfo.c_headimge,
			type : 'received',
			name : userinfo.c_nickname,
			day : (new Date().getMonth() + 1) + '-' + new Date().getDate(),
			time : (new Date()).getHours() + ':' + (new Date()).getMinutes()
		};
		}else{
			var voiceWidth = 15 + message.content.user.userinfo.c_duration * 2;
			var txtCfg = {
			text : '<div style="width:'+voiceWidth+'px;" onclick=down("'+rootUrl+txtMsg+'")>'+message.content.user.userinfo.c_duration+'\"</div>',
			avatar:rootUrl+userinfo.c_headimge,
			type : 'received',
			name :userinfo.c_nickname,
			day : (new Date().getMonth() + 1) + '-' + new Date().getDate(),
			time : (new Date()).getHours() + ':' + (new Date()).getMinutes()
		};
		}
		
		
		///*
		// 过滤非当前咨询消息
		setTimeout(function(){
			if(Service.counselId == counselId){
				if(message.messageType != "imageMessage"){
					Auto517.Message.addTxtMsg(messages, Service.targetId, txtCfg, userExtra,Service.conversationtype);
				}else{
					Auto517.Message.addImgMsg(messages, Service.targetId, txtCfg, base64Str, userExtra,Service.conversationtype);
				}	    
			}else{
			//
			if(typeof(api) != 'undefined'){
				api.notification({
					notify: {
    					content: '您有新的咨询消息！'
					},
					vibrate: [500,500]
				}, function(ret, err) {
					Service.listMyCounsel();
					
				    var id = ret.id;
				    
//				    if(mainView.activePage.name != 'servicechat'){
//				    	var tz = $$('#'+counselId).children().html();
//				    	var zh;
//				    	if(tz != "" && typeof(tz) != "undefined"){
//				    	   zh = parseInt(tz);
//				    	}else{
//				    	   zh =0;	
//				    	}
//				    	zh ++;
//				    	$$('#'+counselId).html('<span class="badge" style = "background:red;">'+zh+'</span>');
//				    }
				});
			}
		}},3000);
		//
		Service.setBadge(counselId);
	},
	//
	'setBadge': function(counselId){
		//
		if($$('#serviceBadge' + counselId).length != 0){
			//
			if($$('.messages').length == 0){
				var badge = parseInt($$('#serviceBadge' + counselId + ' > span').html());
				$$('#serviceBadge' + counselId + ' > span').html(badge + 1);
				$$('#serviceBadge' + counselId).css('display','inline-block');	
			}
		}
	},
	//
	'clearBadge': function(){
		
		var _data = {
				script: "managers.om.consult.consult",
				needTrascation: true,
				funName: "updateReadMsg",
				form: "{c_consultid: '"+Service.counselId+"',uid:'"+uid+"'}"
			};
		
		$$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			data:_data,
			type: 'post',
			timeout:15000,
			success: function(data) {
				$$('#serviceBadge' + Service.counselId + ' > span').html(0);
				$$('#serviceBadge' + Service.counselId).hide();
			}
//			,
//			error : window.Auto517.Ajax.errorFun,
//	        complete: window.Auto517.Ajax.completeFun,
		});
		
		
		
//		window.Auto517.Ajax.ajaxBus({
//	        method : 'post',
//	        url : globalVar.serverAddress + '/message/updateReadMsg.jhtml?fromChannel=app&t=' + getRandom(),
//	        data : {
//	        	c_consultid: Service.counselId
//	        },
//	        dataType : 'json',
//	        timeout : 15000,
//	        success : function(data) {
//	        	//
//				$$('#serviceBadge' + Service.counselId + ' > span').html(0);
//				$$('#serviceBadge' + Service.counselId).hide();
//				//
//
//	        },
//	        error : window.Auto517.Ajax.errorFun,
//	        complete: window.Auto517.Ajax.completeFun,
//	    });
		//
	},
	//
	'sendWelcomeMsg': function(){
		var txtMsg = '您好！我是客服:' + globalVar.userinfo.c_nickname + '，编号:' + globalVar.uuid + '，如果您有任何问题，可以进行咨询！';
		Service.sendTextMsg(Service.counselId, Service.targetId, txtMsg);	
	},
	
	'postKeyboard': function(){
		var txtMsg 		=  $$('.chat-input').val();
		if(txtMsg == ''){
			toast.show('输入内容为空！');
			return;
		}
		//
		Service.sendTextMsg(Service.counselId, Service.targetId, txtMsg , Service.conversationtype);
		$$('.chat-input').val('');
		return false;
	},
	
	'postImage': function(imageUri, base64Str){
		console.clear();
		//
		Service.sendImageMsg(Service.counselId, Service.targetId, imageUri, base64Str,Service.conversationtype);
	},
	
	'getLocalTime':function getLocalTime(nS) {     
        var date = new Date(nS);
		Y = date.getFullYear() + '-';
		M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		D = date.getDate() + ' ';
		h = date.getHours() + ':';
		m = date.getMinutes() + ':';
		s = date.getSeconds();   
		return Y+M+D+h+m+s;
    },
	
	
	//消息列表
	'listMyCounsel': function(){
		var _data = {
				script: "managers.om.consult.consult",
				needTrascation: false,
				funName: "listMyConsult",
				form: "{c_userid: '"+uid+"'}"
			};
		
		$$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			data:_data,
			type: 'post',
			timeout:15000,
			success: function(data) {
				var html = '';
				
//				html += '<li id="im-group-notification" class="swipeout">';
//			    html += '<a href="html/maillist/aboutgroup.html" class="item-content item-link" style="padding-left: 8px;">';
//				html += '<div class="item-media"><img src="image/aboutmessage/quantongzhi.jpg" width="50" height="50" style="-webkit-border-radius: 6px;"></div>';
//				html += '<div class="item-inner">';
//				html += '<div class="item-title-row" style="background: none;padding-right: 0px;">';
//				html += '<div class="item-title"><span style="font-weight: 300; padding-top:30px;color: #555555;">圈通知</span></div>';
//				html += '</div>';
//				html += '</div>';
//				html += '</a>';
//			    html += '</li>';
				var result = data.datasources[0].rows;
				if(result.length != 0){
					for (var i = 0;i<result.length;i++) {
						if(result[i].status == 3 || result[i].status1 == 3){
							continue;
						}
					var fT_id;
					if(result[i].c_conversationtype == '3'){
						fT_id = result[i].c_targetid;
					}else{
						if(result[i].c_senderuserid == uid){
							if(result[i].c_messagedirection == "1"){
								fT_id = result[i].c_targetid;
							}else{
								fT_id = result[i].c_receiverid
							}
						}else{
							fT_id = result[i].c_senderuserid;
						}
					}
					var newJson = JSON.parse(result[i].c_content);
					html += '<li>';
					html += '<a href="html/service/servicechat.html?counselId='+result[i].c_consultid+'&targetId='+fT_id+'&conversationtype='+result[i].c_conversationtype+'&statu=0&name='+result[i].username+'" class="item-content item-link" style="padding-left: 8px;">';
					html += '<div class="item-media"><img src="'+rootUrl+result[i].userimage+'" width="50" height="50" style="-webkit-border-radius: 6px;"></div>';
					if(result[i].num == 0 || result[i].num == null){
//						html += '<div class="item-after"  data-dsk="6" id = "'+result[i].c_consultid+'"><span></span></div>';
					}else{
						if(result[i].num >=99){
							html += '<div style = "background: red;color: white;border-radius: 20px;width:25px;height:20px;margin-bottom:35px;margin-left: -10px;text-align:center;font-size:10px;line-height:20px;">99+</div>';
						}else{
							html += '<div style = "background: red;color: white;border-radius: 20px;width:25px;height:20px;margin-bottom:35px;margin-left: -10px;text-align:center;font-size:10px;line-height:20px;">'+result[i].num+'</div>';
						}
					}
//					html += '<div style = "background: red;color: white;border-radius: 20px;width:25px;height:20px;margin-bottom:25px;margin-left: -10px;text-align:center;font-size:10px;line-height:20px;">99+</div>';
					html += '<div class="item-inner" style="margin-left:10px;">';
					html += '<div class="item-title-row" style="background: none;padding-right: 0px;">';
					html += '<div class="item-title"><span style="font-weight: 300; color: #000;">'+result[i].username+'</span></div>';
					html += '<div class="item-after" style="font-size:10px;">'+Service.getLocalTime(result[i].c_createtime)+'</div>';
				    html += '</div>';
				    html += '<div class="item-title-row" style="background: none;padding-right: 0px;">';
				    if(result[i].c_messagetype == "ImageMessage"){
				    	html += '<div class="item-text" style="height: auto;font-size:14px">[图片]</div>';
				    }else if(result[i].c_messagetype == "VoiceMessage"){
				    	html += '<div class="item-text" style="height: auto;font-size:14px">[语音]</div>';
				    }else{
				    	html += '<div class="item-text" style="height: auto;font-size:14px">'+window.Auto517.fn.transEm(newJson.content)+'</div>';
				    }
//				    if(result[i].num == 0 || result[i].num == null){
//						html += '<div class="item-after"  data-dsk="6" id = "'+result[i].c_consultid+'"><span></span></div>';
//					}else{
//						if(result[i].num >=99){
//							html += '<div class="item-after"  data-dsk="6" id = "'+result[i].c_consultid+'"><div class="new_count"><span>99+</span></div></div>';
//						}else{
//							html += '<div class="item-after"  data-dsk="6" id = "'+result[i].c_consultid+'"><div class="new_count"><span>'+result[i].num+'</span></div></div>';
//						}
//					}
					html += '</div>';
					html += '</div>';
					html += '</a>';
				    html += '</li>';
				}
				}
//				alert(html);
				$$('.im-messagelist-list').html(html);
//				alert($$('#im-messagelist-list').html());
			}
		});

	},
	//客服列表
	"listAllCounsel" : function() {
		return;
		window.Auto517.Ajax.ajaxBus({
			method : 'post',
			url : globalVar.serverAddress + '/problem/listUserProblem.jhtml?fromChannel=app',
			data : {
				c_userid : 0
			},
			dataType : 'json',
			timeout : 150000,
			success : function(data) {
				var html = '';
				for (var i = 0; i < data._rows.length; i++) {
					var now = new Date();
					var time1 = now.Format("yyyy-MM-dd hh:mm:ss");
					var time2 = data._rows[i].c_createtime;
					var time = Auto517.Date.getDiffLabel(time2, time1);
					var status = data._rows[i].c_status;
					//		
					if(status == undefined || status == 9 || status == '9'){
						status = '未有人抢单'
					}							
					if(status == 0 || status == '0' || status == 1 || status == '1'){
						status =  '已有人抢单'
					}										
					html += '<a href="#" class="item-link">';
					html += '		<div class="call-card">';
					html += '			<div class="call-card-header counsel-detail-problem">';
					html += '				<div class="call-avatar"><img class="img" src="' + globalVar.serverAddress + '/upload/' + data._rows[i].c_headimge + '" /></div>';
					html += '				<div class="call-name">' + data._rows[i].c_nickname + '</div>';
					html += '			</div>';
					html += '			<div class="call-card-content counsel-detail-problem">';
					html += '				<div class="des-text">' + data._rows[i].c_content + '</div>';
					if ( typeof (data._rows[i].picture) != 'undefined') {					
						var row = Math.floor(data._rows[i].picture.length / 3);
						var remainder = data._rows[i].picture.length % 3;
						html += '				<div class="des-picture">';
						if (row > 0) {
							for (var j = 0; j < row; j++) {
								html += '					<div class="row">';
								html += '						<div class="col-33 des-img"><img src="' + globalVar.serverAddress + '/upload/' + data._rows[i].picture[j * 3].c_picture + '" /></div>';
								html += '						<div class="col-33 des-img"><img src="' + globalVar.serverAddress + '/upload/' + data._rows[i].picture[j * 3 + 1].c_picture + '" /></div>';
								html += '						<div class="col-33 des-img"><img src="' + globalVar.serverAddress + '/upload/' + data._rows[i].picture[j * 3 + 2].c_picture + '" /></div>';
								html += '					</div>';
							}
							if (remainder == 1) {
								html += '					<div class="row">';
								html += '						<div class="col-33 des-img"><img src="' + globalVar.serverAddress + '/upload/' + data._rows[i].picture[row * 3].c_picture + '" /></div>';
								html += '						<div class="col-33 des-img"></div>';
								html += '						<div class="col-33 des-img"></div>';
								html += '					</div>';
							}
							if (remainder == 2) {
								html += '					<div class="row">';
								html += '						<div class="col-33 des-img"><img src="' + globalVar.serverAddress + '/upload/' + data._rows[i].picture[row * 3].c_picture + '" /></div>';
								html += '						<div class="col-33 des-img"><img src="' + globalVar.serverAddress + '/upload/' + data._rows[i].picture[row * 3 + 1].c_picture + '" /></div>';
								html += '						<div class="col-33 des-img"></div>';
								html += '					</div>';
							}
						} else {
							if (remainder == 1) {
								html += '					<div class="row">';
								html += '						<div class="col-33 des-img"><img src="' + globalVar.serverAddress + '/upload/' + data._rows[i].picture[0].c_picture + '" /></div>';
								html += '						<div class="col-33 des-img"></div>';
								html += '						<div class="col-33 des-img"></div>';
								html += '					</div>';
							}
							if (remainder == 2) {
								html += '					<div class="row">';
								html += '						<div class="col-33 des-img"><img src="' + globalVar.serverAddress + '/upload/' + data._rows[i].picture[0].c_picture + '" /></div>';
								html += '						<div class="col-33 des-img"><img src="' + globalVar.serverAddress + '/upload/' + data._rows[i].picture[1].c_picture + '" /></div>';
								html += '						<div class="col-33 des-img"></div>';
								html += '					</div>';
							}
						}
						html += '				</div>';
					}
					html += '			</div>';
					html += '			<div class="call-card-footer">';
					html += '				<div class="footer-left callCustomer">';
					html += '					<img src="image/toolbar/mine_grey.png" style="width: 18px;height: 16px;float: left;">';
					html += '					<span class="call-new-footer-data">客服</span>';
					html += '				</div>';
					html += '				<input class="counsel-id" name="counsel-id" type="hidden" value="' + data._rows[i].c_id + '">';
					html += '				<input class="counsel-userid" name="counsel-userid" type="hidden" value="' + data._rows[i].c_userid + '">';
					html += '				<input class="counsel-status" name="counsel-status" type="hidden" value="' + data._rows[i].c_status + '">';
//					html += '				<div class="footer-left">';
//					html += '					<i class="iconfont call-message-icon">&#xe624;</i>';
					html += '					<span class="pet-footer-data chat-status" >'+status+'</span>';
//					html += '				</div>';
					html += '				<div class="footer-right">';
					html += '					<i class="iconfont call-time-icon">&#xe60b;</i>';
					html += '					<span class="pet-footer-data">' + time + '</span>';
					html += '				</div>';
					html += '			</div>';
					html += '		</div>';
					html += '</a>	 ';
//					html += '				<input class="counsel-id" name="counsel-id" type="hidden" value="' + data._rows[i].c_id + '">';
//					html += '				<input class="counsel-userid" name="counsel-userid" type="hidden" value="' + data._rows[i].c_userid + '">';

				}
				$$('#callListData').append(html);
				//跳转事件
				//	        	$$('.counsel-detail-problem').on('click',function(){
				//					mainView.router.loadPage('html/user/counsel/call_detail.html');
				//				});

			},
			beforeSend : window.Auto517.Ajax.beforeSendFun,
			error : window.Auto517.Ajax.errorFun,
			complete : window.Auto517.Ajax.completeFun,
		});
	},
	'init':(function(){
		$$(document).on('msgService', function(e){
			var data = e.detail;
			Service.receiveMsg(data);
		});
	})()
};


function ss(){
	Auto517.RongCloud.joinGroup();
}

function showSwiper(obj) {
	var this_obj = $$(obj);
	var _thatImgs = $$(obj).parents('.messages').find('.show-swiper');
	var arr = new Array();
	var key;
	$$.each(_thatImgs, function (index, value) {
		if($$(value)[0]  == this_obj[0]){
		    key = index;
		}
		arr[index] = $$(value).data("pho");
	}); 
		Auto517.photoBrowser._photoBrowser_open(arr,key);
}

