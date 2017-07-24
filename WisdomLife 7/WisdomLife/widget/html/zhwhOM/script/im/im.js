myApp.onPageInit('im-contacts-page', function(page) {
	var innerHtml = '';
	$$.ajax({
		url : rootUrl + '/index.php/mobile/im/Im_ajax/getMyFriends',
		dataType : 'json',
		data : {
			userid : _im_userid
		},
		type : 'post',
		success : function(result) {
			$$.each(result, function(index, obj) {
				innerHtml += '<li style="padding-left:0">';
				innerHtml += '	<a href="views/im/chat.html?id=' + obj.id + '&imtype=PRIVATE" class="item-link item-content">';
				innerHtml += '		<div class="card ks-facebook-card item-inner" style="border-radius:0px;box-shadow: 0 1px 1px rgba(0, 0, 0, 0), 0px 1px 0px rgba(0, 0, 0, 0.24);">';
				innerHtml += '			<div class="card-header no-border">';
				innerHtml += '				<div class="ks-facebook-avatar"><img src="' + rootUrl + '/user_img/' + obj.portrait + '" width="34" height="34" /></div>';
				innerHtml += '				<div class="ks-facebook-name" style="margin-top: 5px;">' + obj.username + '</div>';
				innerHtml += '			</div>';
				innerHtml += '		</div>';
				innerHtml += '	</a>';
				innerHtml += '</li>';
			});
			$$('#im-contacts-list').html(innerHtml);
		}
	});

});

myApp.onPageInit('im-groups-page', function(page) {
	var innerHtml = '';
	$$.ajax({
		url : rootUrl + '/index.php/mobile/im/Im_ajax/getGroupByUserId',
		dataType : 'json',
		data : {
			userid : _im_userid
		},
		type : 'post',
		success : function(result) {
			$$.each(result, function(index, obj) {
				innerHtml += '<li style="padding-left:0">';
				innerHtml += '	<a href="views/im/chat.html?id=' + obj.groupid + '&imtype=GROUP" class="item-link item-content">';
				innerHtml += '		<div class="card ks-facebook-card item-inner" style="border-radius:0px;box-shadow: 0 1px 1px rgba(0, 0, 0, 0), 0px 1px 0px rgba(0, 0, 0, 0.24);">';
				innerHtml += '			<div class="card-header no-border">';
				innerHtml += '				<div class="ks-facebook-avatar"><img src="' + rootUrl + '/group_img/' + obj.groupportrait + '" width="34" height="34" /></div>';
				innerHtml += '				<div class="ks-facebook-name" style="margin-top: 5px;">' + obj.groupname + '</div>';
				innerHtml += '			</div>';
				innerHtml += '		</div>';
				innerHtml += '	</a>';
				innerHtml += '</li>';
			});
			$$('#im-groups-list').html(innerHtml);
		}
	});
});

myApp.onPageInit('aboutgroup', function(page) {
	searchManageForList();
});

myApp.onPageInit('aboutmessage', function(page) {
	_im_conversationtype = $$.parseUrlQuery(page.url).mtype;
	//# 0)
	im_groupNotificationExist();


	//# 1)
	_im_rong.getConversationList(function(ret, err) {
		//alert(JSON.stringify(ret.result));
		if (ret.result != '') {
			$$.each(ret.result, function(index, obj) {
				var uniqueid = '';
				var conversationType = '';
				var targetid = '';
				var targetname = '';
				var portrait = '';
				var unreadMessageCount = 0;
				var lastmessage = '';
				var sendtime = 0;
				var messageid = 0;
				//
				targetid = obj.targetId;
				if (obj.conversationType == 'PRIVATE') {
					conversationType = 'PRIVATE';

					$$.ajax({
						url : rootUrl + 'index.php/user/user_info/getUserBaseInfo',
						data : {
							userID : targetid,
							userLat : 1,
							userLon : 1
						},
						dataType : 'json',
						type : 'get',
						timeout : 5000,
						async : false,
						success : function(data) {
							portrait = rootUrl + data.user_info.c_user_image;
							targetname = data.user_info.c_user_name;
							var obj = $$('#' + 'PRIVATE-' + targetid + '-portrait');
							var objtargetname = $$('#' + 'PRIVATE-' + targetid + '-targetname');
							obj[0].innerHTML = '<img src="' + portrait + '" style="height:50px;width:50px;-webkit-border-radius: 6px;" />';
							objtargetname[0].innerHTML = targetname;
						}
					});

				} else {
					return true;
				}

				unreadMessageCount = obj.unreadMessageCount;
				lastmessage = obj.latestMessage.text;
				sendtime = (new Date(obj.sentTime).getMonth() + 1) + '-' + new Date(obj.sentTime).getDate();
				uniqueid = conversationType + '-' + targetid;
				latestMessageId = obj.latestMessageId;

				var conversationHtml = addConversation(uniqueid, conversationType, targetid, targetname, portrait, unreadMessageCount, lastmessage, sendtime, latestMessageId);
				$$('#im-messagelist-list').append(conversationHtml);

			});
		}
	})
});

//myApp.onPageBack('im-chat-page', function(page) {
//	im_back();
//});

var chatUIOpenFlag = false;

myApp.onPageInit('im-chat-page', function(page) {
	var tarid  =  $$.parseUrlQuery(page.url).id;
	var pageName=page.query.pageName;
	var personId = page.query.personId;
	_im_rong.clearMessagesUnreadStatus({
        conversationType: 'PRIVATE',
        targetId: tarid
    }, function (ret, err) {
})

	$$('#im-chat').on('click', function() {
		_im_uichatbox.closeKeyboard();
	});

	$$('.messages').html('');

	_im_targetid = $$.parseUrlQuery(page.url).id;
	_im_conversationtype = $$.parseUrlQuery(page.url).imtype;
	var tName = $$.parseUrlQuery(page.url).tName;
	var communityName = $$.parseUrlQuery(page.url).communityName;
	if(_im_conversationtype == 'GROUP'){
		$$('#im-page .tName').html(communityName);
	}else{
		$$('#im-page .tName').html(tName);
	}

	//alert(_im_targetid + ' - ' + _im_conversationtype);

	var lastestMessageId = $$.parseUrlQuery(page.url).latestMessageId;
	lastestMessageId = (lastestMessageId == undefined) ? -1 : lastestMessageId;

	_im_myMessages = myApp.messages('.messages');
	_im_uichatbox = api.require('UIChatBox');

	if (chatUIOpenFlag == false) {
		//alert(JSON.stringify(_im_uichatbox));
		//return;
		_im_uichatbox.open({
			placeholder : '',
			maxRows : 4,
			emotionPath : 'widget://image/em',
			texts : {
				recordBtn : {
					normalTitle : '按住 说话',
					activeTitle : '松开 结束'
				},
				sendBtn : {
					title : "发送`"
				}
			},
			styles : {
				inputBar : {
					borderColor : '#d9d9d9',
					bgColor : '#f2f2f2'
				},
				inputBox : {
					borderColor : '#B3B3B3',
					bgColor : '#FFFFFF'
				},
				emotionBtn : {
					normalImg : 'widget://image/em/Expression_1.png'
				},
				extrasBtn : {
					normalImg : 'widget://image/em/extras.png'
				},
				keyboardBtn : {
					normalImg : 'widget://image/em/keyboard.png'
				},
				speechBtn : {
				 	normalImg : 'widget://image/em/chatbox_voice.png'
				},

				recordBtn : {
					 normalBg : '#c4c4c4',
					 activeBg : '#999999',
					 color : '#000',
					 size : 14
				},

				 indicator : {
				 target : 'both',
				 color : '#c4c4c4',
				 activeColor : '#9e9e9e'
				 },
				sendBtn : {
					titleColor : '#4cc518',
					bg : '#999999',
					activeBg : '#46a91e',
					titleSize : 14
				}
			},
			extras : {
				titleSize : 10,
				titleColor : '#a3a3a3',
				btns : [{
					title : '图片',
					normalImg : 'widget://image/em/photo_normal.png',
					activeImg : 'widget://image/em/photo_active.png'
				}
				 , {
				 title : '拍照',
				 normalImg : 'widget://image/em/chatBox_cam2.png',
				 activeImg : 'widget://image/em/chatBox_cam1.png'
				 }
				]
			}
		}, function(ret) {
			//点击附加功能面板
			if (ret.eventType == 'clickExtras') {
				//alert("用户点击了第" + ret.index + "个按钮");

				if (ret.index == 0) {
					api.getPicture({
						sourceType : 'library',
						encodingType : 'jpg',
						mediaValue : 'pic',
						destinationType : 'url',
						quality : 50,
						saveToPhotoAlbum : false
					}, function(ret, err) {
						//alert(JSON.stringify(ret))
						if(ret){
							if (ret.data != '') {
								_im_send_message(_im_userid, 'image', ret.data);
								sendRongyunImageMessage(_im_targetid, ret.data);
							}
						}else {
							//alert(err.msg);
						}
					});
				} else if (ret.index == 1) {
					api.getPicture({
						sourceType : 'camera',
						encodingType : 'jpg',
						mediaValue : 'pic',
						destinationType : 'url',
						quality : 50,
						saveToPhotoAlbum : false
					}, function(ret, err) {
						if (ret) {
							_im_send_message(_im_userid, 'image', ret.data);
							sendRongyunImageMessage(_im_targetid, ret.data);
						} else {
							
						}
					});
				}
			}
			//点击发送按钮
			if (ret.eventType == 'send') {
				_im_send_message(_im_userid, 'text', im_transText(ret.msg));
				sendRongyunTextMessage(_im_targetid, ret.msg);
				//saveChat();
			}
		});

		_im_uichatbox.addEventListener({
		    target: 'inputBar',
		    name: 'move'
		}, function(ret,err){
			api.setFrameAttr({
			    name: 'ohmy',
			    rect: {
			        x: 0,
			        y: 20,
			        w: 'auto',
			        h: api.winHeight - ret.panelHeight - ret.inputBarHeight - 20
			    }
			});

			window.setTimeout(function(){
				_im_myMessages.scrollMessages();
			},300);

		});
		
		_im_uichatbox.addEventListener({
		    target: 'recordBtn',
		    name: 'press'
		}, function( ret, err ){
			var myDate = new Date();
		    	var myTime = myDate.getTime(); 
		    api.startRecord({
				path: api.cacheDir+'/rongyun/voiceMessage/'+myTime+'.amr'
			});
			
			api.showProgress({
			    style: 'default',
			    animationType: 'zoom',
			    title: '正在录入语音...',
			    text: '最长可录入60秒...',
			    modal: false
			});
			
			//发送个事件
	        api.sendEvent({
	            name: 'getRecordVoiceTime',
	            extra:{timeup:myTime}
	        });
		});
		
		api.addEventListener({
	    		name:'getRecordVoiceTime'
			},function(ret, err){
				setTimeout('stopRecordVoiceFun()', 60000 );
		});
		
		stopRecordVoiceFun = function(){
			api.stopRecord(function( ret, err ){
			    if( ret ){
			    		 api.hideProgress();
			    		 _im_send_message(_im_userid, 'voice', ret.duration,ret.path);
			    		 sendRongyunVoiceMessage(_im_targetid,ret.path,ret.duration);
			    }
			});
		}
		
		_im_uichatbox.addEventListener({
		    target: 'recordBtn',
		    name: 'press_cancel'
		}, function( ret, err ){
		    api.stopRecord(function( ret, err ){
				    if( ret ){
				    		 api.hideProgress();
				    		 _im_send_message(_im_userid, 'voice', ret.duration,ret.path);
				    		 sendRongyunVoiceMessage(_im_targetid,ret.path,ret.duration);
				    }
				});
		});
		
		_im_uichatbox.addEventListener({
		    target: 'recordBtn',
		    name: 'move_out'
		}, function( ret, err ){
		    
		});
		
		_im_uichatbox.addEventListener({
		    target: 'recordBtn',
		    name: 'move_out_cancel'
		}, function( ret, err ){
		    api.stopRecord(function( ret, err ){
			    if( ret ){
			    		api.hideProgress();
			    		var fs = api.require('fs');
					fs.remove({
					    path: ret.path
					},function(ret,err){
					    
					});
			    }
			});
		});
		
		_im_uichatbox.addEventListener({
		    target: 'recordBtn',
		    name: 'move_in'
		}, function( ret, err ){
		    
		});

		chatUIOpenFlag = true;
	} else {
		_im_uichatbox.show();
	}

	//getRongyunLastestMessages(_im_conversationtype, _im_userid,  _im_targetid);
	
	_im_history_message_new(_im_userid, _im_targetid, getImStore(_im_targetid + '  - ' + _im_conversationtype));
	//给返回做点击事件
	$$("#im_back").on('click',function(){
		chatUIOpenFlag = false;
		_im_uichatbox.close();
		api.stopPlay();
		api.setFrameAttr({
		    name: 'ohmy',
		    rect: {
		        x: 0,
		        y: 20,
		        w: 'auto',
		        h: 'auto'
		    }
		});
		if(pageName=='user_info_view'){
			mainView.router.reloadPreviousPage('html/user/userinfo_view.html?type=1&userID='+personId);
		}else{
			mainView.router.reloadPreviousPage('html/maillist/aboutmessage.html');
		}
	});
});
