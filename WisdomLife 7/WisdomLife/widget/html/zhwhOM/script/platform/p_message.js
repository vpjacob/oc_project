/*******************************************************************************
 * Copyright (c) 2016 Auto517
 * Date     :2016-10-17
 * Desc     :RongCloud
 * Author   :Tuatua
 *******************************************************************************/
/**
 *  @namespace Auto517.Message
 *  Method:
 *  Auto517.Message();
 */
var _p_message = function() {
	
	var _data = {};
	_data.imgHeight = 65;
	
	_data.beginRecord = function(){
		if($$('.chat-voice-record').dataset().type != "begin"){
			$$('.chat-voice-record').attr('data-type','begin');
			var recordHTML = '';
			recordHTML += '<div style="width:' + _data.imgHeight + 'px;height:' + _data.imgHeight + 'px;margin:20px auto;"><img style="width:' + _data.imgHeight + 'px;height:' + _data.imgHeight + 'px;"src="image/em/icon/mic.svg"/></div>';
			recordHTML += '<div style="font-size: 12px;color: #fff;text-align: center;margin:2px 5px 2px 5px;">手指上滑，取消发送</div>';
			$$('.chat-voice-record').html(recordHTML);
		}
	}
	_data.cancelRecord = function(){
		if($$('.chat-voice-record').dataset().type != "cancel"){
			$$('.chat-voice-record').attr('data-type','cancel');
			var recordHTML = '';
			recordHTML += '<div style="width:' + _data.imgHeight + 'px;height:' + _data.imgHeight + 'px;margin:20px auto;"><img style="width:' + _data.imgHeight + 'px;height:' + _data.imgHeight + 'px;"src="image/em/icon/return.svg"/></div>';
			recordHTML += '<div style="font-size: 12px;color: #fff;text-align: center;margin:2px 5px 2px 5px;background-color:#923f3a;">松开手指，取消发送</div>';
			$$('.chat-voice-record').html(recordHTML);
		}
	}
	
	
	//接受、发送消息，统一加入到message DOM中
	function _addTxtMsg(targetDOM, targetId, cfg, userExtra,conversationtype){
		//
		if(cfg.type == 'sent'){
			if(targetDOM.container != null && targetDOM.container.length != 0){
				console.log("targetDOM.container="+targetDOM.container);
				var old_text = cfg.text;
				cfg.text = window.Auto517.fn.transEm(cfg.text);
				targetDOM.addMessage(cfg);
				cfg.text = old_text;
			}
			Auto517.RongCloud.sendPrivateTxtMsg(targetId, cfg.text, '', userExtra, conversationtype, _privateSendMsgCallback);
			return;
		}
		//
		if(cfg.type == 'received'){
			//
			if(targetDOM.container != null && targetDOM.container.length != 0){
				var old_text = cfg.text;
				cfg.text = window.Auto517.fn.transEm(cfg.text);
				targetDOM.addMessage(cfg);
				cfg.text = old_text;
			}else{
				
			}
			return;
		}
	}
	//
	function _addImgMsg(targetDOM, targetId, cfg, base64Str, imageUri, userExtra, conversationtype){
		if(cfg.type == 'sent'){
			if(targetDOM.container != null && targetDOM.container.length != 0){
				targetDOM.addMessage(cfg);
			}
			Auto517.RongCloud.sendPrivateImgMsg(targetId, base64Str, imageUri, userExtra, conversationtype, _privateSendMsgCallback);
			return;
		}
		//
		if(cfg.type == 'received'){
			//
			if(targetDOM.container != null && targetDOM.container.length != 0){
				cfg.text = '<img src="'+base64Str+'">';
				targetDOM.addMessage(cfg);
			}else{
				
			}
			return;
		}
		
//		
//		targetDOM.addMessage(cfg);
//		Auto517.RongCloud.sendPrivateImgMsg(targetId, cfg.text, base64Str,'', callback);
	}
	//
	function _addTypingStatuMsg(targetDOM, targetId, callback){
		Auto517.RongCloud.sendTypingStatusMsg(targetId, callback);
	}
	//
	function _getHistoryMsg(targetDOM, historyMsgList){
		var cfgArray = new Array();
		for (var i = historyMsgList.length-1;i>=0;i--) { 
			var data = historyMsgList[i];
			//
			var content 			= JSON.parse(data.c_content);
			var userinfo			= content.user.userinfo;
			var conversationType 	= data.c_conversationType;
		
			var extra 				= data.c_extra;
			var isLocalMessage 		= data.c_isLocalmessage;
			var messageDirection 	= data.c_messagedirection;
			var messageId 			= data.c_messageId;
			var messageType 		= data.c_messagetype;
			var messageUId 			= data.c_messageuid;
			var objectName 			= data.c_objectname;
			var offLineMessage 		= data.c_offLinemessage;
			var receiptResponse 	= data.c_receiptresponse;
			var receivedStatus 		= data.c_receivedstatus;
			var receivedTime 		= data.c_receivedtime;
			var senderUserId 		= data.c_senderuserId;
			var sentStatus 			= data.c_sentstatus;
			var sentTime 			= data.c_senttime;
			var targetId 			= data.c_targetid;
			var timeStmp 			= (messageDirection == 1)?parseInt(sentTime): parseInt(receivedTime);
			var date = new Date(timeStmp);
			//
			if(messageType == 'TextMessage'){
				var cfg = {
				text : window.Auto517.fn.transEm(content.content),
				avatar : rootUrl+userinfo.c_headimge,
				type : (messageDirection == 1)? 'sent': 'received',
				name : userinfo.c_nickname,
				day : (date.getMonth() + 1) + '-' + date.getDate(),
				time : date.getHours() + ':' + date.getMinutes()
//				label: '<span>abc</span>'
			};
			}else if(messageType == 'ImageMessage'){
				var cfg = {
				text : '<img src = "'+rootUrl+content.imageUri+'" class = "show-swiper" onclick = showSwiper(this) data-pho = "'+rootUrl+content.imageUri+'" style = "width:180px;height:230px;">',
				avatar : rootUrl+userinfo.c_headimge,
				type : (messageDirection == 1)? 'sent': 'received',
				name : userinfo.c_nickname,
				day : (date.getMonth() + 1) + '-' + date.getDate(),
				time : date.getHours() + ':' + date.getMinutes()
//				label: '<span>abc</span>'
			};
			}else{
				var voiceWidth = 15 + userinfo.c_duration * 2;
				var cfg = {
				text : '<div style="width:'+voiceWidth+'px;" onclick=down("'+rootUrl+content.content+'")>'+userinfo.c_duration+'\"</div>',
				avatar : rootUrl+userinfo.c_headimge,
				type : (messageDirection == 1)? 'sent': 'received',
				name : userinfo.c_nickname,
				day : (date.getMonth() + 1) + '-' + date.getDate(),
				time : date.getHours() + ':' + date.getMinutes()
//				label: '<span>abc</span>'
			};
			}
			cfgArray.push(cfg);
		}
		//
		targetDOM.addMessages(cfgArray, 'prepend', false);
	}
	//
	function _isOnline(){

	}
	//
	function _privateSendMsgCallback(data){
		var content 			= JSON.stringify(data.content);
		var conversationType 	= data.conversationType;
		var extra 				= data.extra;
		var isLocalMessage 		= data.isLocalMessage;
		var messageDirection 	= data.messageDirection;
		var messageId 			= data.messageId;
		var messageType 		= data.messageType;
		var messageUId 			= data.messageUId;
		var objectName 			= data.objectName;
		var offLineMessage 		= data.offLineMessage;
		var receiptResponse 	= data.receiptResponse;
		var receivedStatus 		= data.receivedStatus;
		var receivedTime 		= data.receivedTime;
		var senderUserId 		= data.senderUserId;
		var sentStatus 			= data.sentStatus;
		var sentTime 			= data.sentTime;
		var targetId 			= data.targetId;
		var counselId			= data.content.user.counselId;
//		var data 				= {
//      	c_consultid: counselId,
//          c_content: content,
//          c_conversationType: conversationType,
//          c_extra: extra,
//          c_isLocalMessage: isLocalMessage,
//          c_messageDirection: messageDirection,
//          c_messageId: messageId,
//          c_messageType: messageType,
//          c_messageUId: messageUId,
//          c_objectName: objectName,
//          c_offLineMessage: offLineMessage,
//          c_receiptResponse: receiptResponse,
//          c_receivedStatus: receivedStatus,
//          c_receivedTime: receivedTime,
//          c_senderUserId: senderUserId,
//          c_sentStatus: sentStatus,
//          c_sentTime: sentTime,
//          c_targetId: targetId
//      }
//		console.log(' [ 发送消息回调 ] ', data);
		//
//		return;
		var _data = {
			script: "managers.om.consult.consult",
			needTrascation: true,
			funName: "sendMessage",
			form: "{c_consultid: '"+counselId+"',"+
            "c_content: '"+content+"',"+
            "c_conversationType: '"+conversationType+"',"+
            "c_extra: '"+extra+"',"+
            "c_isLocalMessage: '"+isLocalMessage+"',"+
            "c_messageDirection: '"+messageDirection+"',"+
            "c_messageId: '"+messageId+"',"+
            "c_messageType: '"+messageType+"',"+
            "c_messageUId: '"+messageUId+"',"+
            "c_objectName: '"+objectName+"',"+
            "c_offLineMessage: '"+offLineMessage+"',"+
            "c_receiptResponse: '"+receiptResponse+"',"+
            "c_receivedStatus: '"+receivedStatus+"',"+
            "c_receivedTime: '"+receivedTime+"',"+
            "c_senderUserId: '"+senderUserId+"',"+
            "c_sentStatus: '"+sentStatus+"',"+
            "c_sentTime: '"+sentTime+"',"+
            "c_targetId: '"+targetId+"',status:0}"
		};
		
		$$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			data: _data,
			type: 'post',
			success: function(data) {
			}
		});	
//		window.Auto517.Ajax.ajaxBus({
//	        method : 'post',
//	        url : globalVar.serverAddress + '/message/sendMessage.jhtml?fromChannel=app&t=' + getRandom(),
//	        data : data,
//	        dataType : 'json',
//	        timeout : 15000,
//	        success : function(data) {
//	        	console.log('[保存发送消息成功]');
//	        }
//	    });
	}
	//
	function _privateReceievMsgCallback(data, statu){
		var content 			= JSON.stringify(data.content);
		var conversationType 	= data.conversationType;
		var extra 				= data.extra;
		var isLocalMessage 		= data.isLocalMessage;
		var messageDirection 	= data.messageDirection;
		var messageId 			= data.messageId;
		var messageType 		= data.messageType;
		var messageUId 			= data.messageUId;
		var objectName 			= data.objectName;
		var offLineMessage 		= data.offLineMessage;
		var receiptResponse 	= data.receiptResponse;
		var receivedStatus 		= data.receivedStatus;
		var receivedTime 		= data.receivedTime;
		var senderUserId 		= data.senderUserId;
		var sentStatus 			= data.sentStatus;
		var sentTime 			= data.sentTime;
		var targetId 			= data.targetId;
		var counselId			= data.content.user.counselId;
//		var data 				= {
//      	c_consultid: counselId,
//          c_content: content,
//          c_conversationType: conversationType,
//          c_extra: extra,
//          c_isLocalMessage: isLocalMessage,
//          c_messageDirection: messageDirection,
//          c_messageId: messageId,
//          c_messageType: messageType,
//          c_messageUId: messageUId,
//          c_objectName: objectName,
//          c_offLineMessage: offLineMessage,
//          c_receiptResponse: receiptResponse,
//          c_receivedStatus: receivedStatus,
//          c_receivedTime: receivedTime,
//          c_senderUserId: senderUserId,
//          c_sentStatus: sentStatus,
//          c_sentTime: sentTime,
//          c_targetId: targetId,
//          c_receiverid: globalVar.uuid,
//          c_status: statu
//      }
		
		var _data = {
			script: "managers.om.consult.consult",
			needTrascation: true,
			funName: "sendMessage",
			form: "{c_consultid: '"+counselId+"',"+
            "c_content: '"+content+"',"+
            "c_conversationType: '"+conversationType+"',"+
            "c_extra: '"+extra+"',"+
            "c_isLocalMessage: '"+isLocalMessage+"',"+
            "c_messageDirection: '"+messageDirection+"',"+
            "c_messageId: '"+messageId+"',"+
            "c_messageType: '"+messageType+"',"+
            "c_messageUId: '"+messageUId+"',"+
            "c_objectName: '"+objectName+"',"+
            "c_offLineMessage: '"+offLineMessage+"',"+
            "c_receiptResponse: '"+receiptResponse+"',"+
            "c_receivedStatus: '"+receivedStatus+"',"+
            "c_receivedTime: '"+receivedTime+"',"+
            "c_senderUserId: '"+senderUserId+"',"+
            "c_sentStatus: '"+sentStatus+"',"+
            "c_sentTime: '"+sentTime+"',"+
            "c_targetId: '"+targetId+
            "',status:1,"+
            "c_receiverid:'"+uid+"',statu: '"+0+"'}"
		};
		$$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			data:_data,
			type: 'post',
			success: function(data) {
				
			}
		});	
		//console.log(' [ 接受消息回调 ] ', data);
		//
//		window.Auto517.Ajax.ajaxBus({
//	        method : 'post',
//	        url : globalVar.serverAddress + '/message/sendMessage.jhtml?fromChannel=app&t=' + getRandom(),
//	        data : data,
//	        dataType : 'json',
//	        timeout : 15000,
//	        success : function(data) {
//	        	console.log('[保存接受消息成功]');
//	        }
//	    });
}
	
	//
//	function _addImgMsg(targetDOM, cfg){
//		targetDOM.addMessage(cfg);
//	}
	//
	function _addVoiceMsg(targetDOM, cfg){
		targetDOM.addMessage(cfg);
	}
	
	//
	/*
	* 接受消息会掉（可重写）
	*/
	function _receiveMsg(message){
		/*
		消息附带user字段，在这个字段中，附带
		{
			'counselId': Counsel.counselId, //咨询Id
			'userinfo': {
					'c_nickname': globalVar.userinfo.c_nickname,
					'c_headimge': globalVar.userinfo.c_headimge,
					'c_type': globalVar.userinfo.c_type
			},
			'type': 1 // 1:会话消息  2:抢单消息
		}
		*/
		//
		var statu = 0;
		// 判断消息类型
	    switch(message.messageType){
	        case RongIMClient.MessageType.TextMessage:
				var userinfo 	= message.content.user.userinfo;
				//
				$$(document).trigger('msgService', message);
//	            console.log(' [接受消息] 文字', message);
	            break;
	        case RongIMClient.MessageType.VoiceMessage:
	            // 对声音进行预加载
	            // message.content.content 格式为 AMR 格式的 base64 码
//	            RongIMLib.RongIMVoice.preLoaded(message.content.content);
                $$(document).trigger('msgService', message);
	            break;
	        case RongIMClient.MessageType.ImageMessage:
	        	$$(document).trigger('msgService', message);
//	            console.log(' [接受消息] 图片', message);
	            break;
	        case RongIMClient.MessageType.TypingStatusMessage:
//	        	console.log(' [接受消息] 正在输入', message);
	            break;
	        case RongIMClient.MessageType.UnknownMessage:
	            break;
	        default:
	            // 自定义消息
	            // do something...
	    }
	    //
	    _privateReceievMsgCallback(message, statu);
	}
	
    function _getMsgToolBar(targetDOM, sendButtonFun, cameraFun, albumFun){
		//
		function getEMSlide(){
			var perHeight 	= 45;
			var emHeight 	= 250 - 44 - 30;
			var emWidth 	= $$('.messagebar').width()-30;
			var maxRow 		= Math.floor(emHeight/perHeight);
			var maxColumn 	= Math.floor(emWidth/perHeight);
			var emSlideHTML = '';
			var page 		= 0;
			var seq = 1;
			var html = '';
			//
			$$('.chat-emotion-panel').css({'height': emHeight + 'px'});
			//
			function getE(){
				var emHTML = '';
				emHTML += '<div class="swiper-slide">';
				for(var i=0;i<maxRow;i++){
					emHTML += '<div class="row"">';
					for(var j=0;j<maxColumn;j++){
						if(seq <= 105){
							if(seq % 21 == 0){
								emHTML += '<div class="delete_button" data-text=' + emText + '>';
								emHTML += '    <img src="image/em/delete.png" class="chat-em-icon-image"/>';
								emHTML += '</div>';
							}else{
								var emText = window.Auto517.fn.emjson[seq-1].text;
								emHTML += '<div class="chat-em-icon-container" data-text=' + emText + '>';
								emHTML += '    <img src="image/em/Expression_' + seq + '.png" class="chat-em-icon-image"/>';
								emHTML += '</div>';
							}
						}else{
							emHTML += '<div class="chat-em-icon-container">';
							emHTML += '</div>';
						}
						//
						seq++;
					}
					emHTML += '</div>';
				}
				emHTML += '</div>';
				page = (page == 0)?Math.ceil(105/seq): page;
				//
				return emHTML;	
			}
			//
			html = getE();
			for(var i=0;i<page-1;i++){
				html += getE();
			}
			return html;
		}
		//
		function getExtrasSlide(){
			var perHeight 	= 55;
			var emHeight 	= 250 - 44 - 30;
			var emWidth 	= $$('.messagebar').width()-30;
			var maxRow 		= Math.floor(emHeight/perHeight);
			var maxColumn 	= Math.floor(emWidth/perHeight);
			var emSlideHTML = '';
			var page 		= 0;
			$$('.chat-extras-panel').css({'height': emHeight + 'px'});
			var seq = 1;
			var html = '';
			//
			function getE(){
				var emHTML = '';
				emHTML += '<div class="swiper-slide">';
				emHTML += '<div class="row"">';
				emHTML += '<div class="chat-extras-icon-container chat-extras-icon-camera" onclick=showPic("camera")>';
				emHTML += '    <img src="image/em/icon/chatBox_cam1.png" class="chat-extras-icon-image"/>';
				emHTML += '    <div style="text-align:center;font-size:10px;">拍照</div>';
				emHTML += '</div>';

				emHTML += '<div class="chat-extras-icon-container chat-extras-icon-album" onclick=showPic("album")>';
				emHTML += '		<img src="image/em/icon/album1.png" class="chat-extras-icon-image"/>';
				emHTML += '		<div style="text-align:center;font-size:10px;">相册</div>';
				emHTML += '</div>';

				for(var j=0;j<maxColumn-1;j++){
					emHTML += '<div style="border:0px solid red;min-height:45px;min-width:45px;max-width: 45px;max-height: 45px;">';
					emHTML += '</div>';
					//
					seq++;
				}
				//
				emHTML += '</div>';
				emHTML += '</div>';
				//
				return emHTML;	
			}
			//
			html = getE();
			return html;
		}
		
		//
		Auto517.Message._sendButtonFun = null;
		//
		if(sendButtonFun != null){
			Auto517.Message._sendButtonFun = sendButtonFun;
		}
		
		//# 1) 创建message容器
		var html = '';
		html += '<div class="toolbar messagebar" style="bottom:0px;">';
        html += '    <div class="toolbar-inner" style="height:44px;">';
        html += '        <form class="chat-form" onsubmit="return false">';
        html += '            <img class="chat-icon chat-voice" src="image/em/icon/voice.png"/>';
        html += '            <input class="chat-input" type="input" placeholder="回复信息"></input>';
        html += '            <a class="chat-input-voice button" style="display:none;" href="#">按住说话</a>';
        html += '            <img class="chat-icon chat-keyboard-emotion" src="image/em/icon/face1.png"/>';
        html += '            <img class="chat-icon chat-extras" src="image/em/icon/add1.png"/>';
        html += '        </form>';
        html += '    </div>';
        html += '    <div class="chat-emotion-panel">';
        html += '        <div class="swiper-container chat-em-swiper-container" style="height:100%;">';
        html += '            <div class="swiper-wrapper chat-em-swiper-wrapper"></div>';
        html += '            <div class="swiper-pagination chat-em-swiper-pagination"></div>';
        html += '            <div class="chat-send-emotion">';
        html += '                <a href="#" class="chat-sendmessage button button-raised button-fill color-red">发送</a>';
        html += '            </div>';
        html += '        </div>';
        html += '    </div>';
        html += '    <div class="chat-extras-panel">';
        html += '        <div class="swiper-container chat-ex-swiper-container" style="height:100%;">';
        html += '            <div class="swiper-wrapper chat-ex-swiper-wrapper"></div>';
        html += '            <div class="swiper-pagination chat-ex-swiper-pagination"></div>';
        html += '        </div>';
        html += '    </div>';
    	html += '</div>';
    	//
    	targetDOM.append(html);
    	//# 2) 绑定事件
    	$$('.chat-sendmessage').on('click', sendButtonFun);
    	//
    	$$('.chat-form').on('submit', sendButtonFun);
    	//
    	$$('.chat-input').on('focusout', function(e){

    	});
    	//
    	
    	
    	
    	$$('.chat-input-voice').on('touchstart', function(e){
    		 e.preventDefault();
    		this._data.beginRecord(); 
//            console.log('touchstart触发');
			
			$$('.chat-voice-record').show();
			
    		api.sendEvent({
	            name: 'startRecord'
	      });
	       
	    }.bind(this));
    	
//  	api.addEventListener({
//  		    name:'longRecord'
//  	},function(ret, err){
//				
//		});
    	
    	
      	api.addEventListener({
	    		name:'startRecord'
			},function(ret, err){
			var myDate = new Date();
    		var myTime = myDate.getTime();
			api.startRecord({
				path: api.cacheDir+'/rongyun/voiceMessage/'+myTime+'.amr'
			});
				
		});
    	
      	$$('.chat-input-voice').on('touchend', function(e){
      		api.sendEvent({
	            name: 'longRecord'
	       });
//           touchCancel(_privateSendMsgCallback);
        }.bind(this));
        
        api.addEventListener({
	    		name:'longRecord'
			},function(ret, err){
				touchCancel(_privateSendMsgCallback);
		});
        
        //
		$$('.chat-input-voice').on('touchmove', function(e){
			var bodyHeight 				= $$('body').height();
			var bodyWidth 				= $$('body').width();
			var chatVoiceInputHeight 	= $$('.chat-input-voice').height();
			var chatVoiceInputWidth 	= $$('.chat-input-voice').width();
			var voiceHeight 			= 0;
			var voiceWidth 				= 0;
			var voiceBtnStartX 			= 4 + 5 + 34 + 5;
			var voiceBtnStartY 			= bodyHeight - 4 - chatVoiceInputHeight;
			var touchX 					= e.targetTouches[0].clientX;
			var touchY 					= e.targetTouches[0].clientY;
			var recordHTML = '';
			var validXY = {
				a:{
					x:voiceBtnStartX, 
					y:voiceBtnStartY
				},
				b:{
					x:voiceBtnStartX + chatVoiceInputWidth, 
					y:voiceBtnStartY
				},
				c:{
					x:voiceBtnStartX + chatVoiceInputWidth, 
					y:voiceBtnStartY + chatVoiceInputHeight
				},
				d:{
					x:voiceBtnStartX , 
					y:voiceBtnStartY + chatVoiceInputHeight
				}
			}
			if((touchX >= validXY.a.x && touchY >= validXY.a.y) &&
				(touchX <= validXY.b.x && touchY >= validXY.b.y) &&
				(touchX <= validXY.c.x && touchY <= validXY.c.y) &&
				(touchX >= validXY.d.x && touchY <= validXY.d.y)
			){	
				this._data.beginRecord();
			}else{
				this._data.cancelRecord();	
			}

			//
    }.bind(this));
    	
    	//
		$$('.chat-icon').on('click', function(e){
			var target 				= $$(e.target);
			var targetDisplay 		= target.css('display');
			var emotionPanelDisplay = $$('.chat-emotion-panel').css('display');
			var extrasPanelDisplay 	= $$('.chat-extras-panel').css('display');
			var curClass 			= null;
			var marginTop 			= -207;
			var voiceSrc 			= "image/em/icon/voice.png";
			var emSrc 				= "image/em/icon/face1.png";
			var extrasSrc 			= "image/em/icon/iadd1.png";
			var keyboardSrc			= "image/em/icon/key1.png";
			//
			if(target.hasClass('chat-keyboard-emotion')){
				curClass = 'chat-keyboard-emotion';
			}
			
			if(target.hasClass('chat-extras')){
				curClass = 'chat-extras';
			}

			if(target.hasClass('chat-voice')){
				curClass = 'chat-voice';
			}

			if($$('.messagebar').height() == 44){
				if(target.hasClass('chat-keyboard-emotion')){
					$$('.chat-extrs-panel').hide();
					$$('.chat-emotion-panel').show();
					window.Auto517.fn.animation($$('.messages-content'), {'margin-top': marginTop});
					window.Auto517.fn.animation($$('.messagebar'), {'height': 250});
					$$('.chat-keyboard-emotion').attr('src', keyboardSrc);
					$$('.chat-input').show();
					$$('.chat-input-voice').hide();
					$$('.chat-voice').attr('src', voiceSrc);
				}
				//
				if(target.hasClass('chat-extras')){
					$$('.chat-extras-panel').show();
					$$('.chat-emotion-panel').hide();
					window.Auto517.fn.animation($$('.messages-content'), {'margin-top': marginTop});
					window.Auto517.fn.animation($$('.messagebar'), {'height': 250});
					$$('.chat-input').show();
					$$('.chat-input-voice').hide();
					$$('.chat-voice').attr('src', voiceSrc);
				}
				//
			}
			//
			if($$('.messagebar').height()  == 250){
				if(curClass == 'chat-keyboard-emotion'){
					if(emotionPanelDisplay == 'block'){
						window.Auto517.fn.animation($$('.messages-content'), {'margin-top': 0});
						window.Auto517.fn.animation($$('.messagebar'), {'height': 44});
						$$('.chat-extras-panel').hide();
						$$('.chat-emotion-panel').hide();
						$$('.chat-keyboard-emotion').attr('src', emSrc);
						//$$('.chat-input').focus();
					}
					//
					if(emotionPanelDisplay == 'none'){
						$$('.chat-extras-panel').hide();
						$$('.chat-emotion-panel').show();
						$$('.chat-keyboard-emotion').attr('src', emSrc);
					}
					//
					$$('.chat-input').show();
					$$('.chat-input-voice').hide();
					$$('.chat-voice').attr('src', voiceSrc);
				}
				//
				if(curClass == 'chat-extras'){
					if(extrasPanelDisplay == 'block'){
						window.Auto517.fn.animation($$('.messages-content'), {'margin-top': 0});
						window.Auto517.fn.animation($$('.messagebar'), {'height': 44});
						$$('.chat-extras-panel').hide();
						$$('.chat-emotion-panel').hide();
						$$('.chat-keyboard-emotion').attr('src', emSrc);
						
					}
					//
					if(extrasPanelDisplay == 'none'){
						$$('.chat-extras-panel').show();
						$$('.chat-emotion-panel').hide();
						$$('.chat-keyboard-emotion').attr('src', emSrc);
						//$$('.chat-input').focus();
					}
					//
					$$('.chat-input').show();
					$$('.chat-input-voice').hide();
					$$('.chat-voice').attr('src', voiceSrc);
				}
				//
			}
			//
			if(curClass == 'chat-voice'){
				if($$('.chat-voice').attr('src') == voiceSrc){
					$$('.chat-voice').attr('src', keyboardSrc);
					$$('.chat-input').hide();
					$$('.chat-input-voice').show();
				}else{
					$$('.chat-voice').attr('src', voiceSrc);
					$$('.chat-input').show();
					$$('.chat-input').focus();
					$$('.chat-input-voice').hide();
				}

				if($$('.messagebar').height()  == 250){
					window.Auto517.fn.animation($$('.messages-content'), {'margin-top': 0});
					window.Auto517.fn.animation($$('.messagebar'), {'height': 44});
				}
			}
		});
		
		
		$$('.chat-input').on('focus', function(){
			//$$('.chat-extras-panel').hide();
			//$$('.chat-emotion-panel').hide();
			//window.Auto517.fn.animation($$('.messages-content'), {'margin-top': 0});
			//window.Auto517.fn.animation($$('.messagebar'), {'height': 44});
						
			if($$('.messagebar').height()  == 250){
				window.Auto517.fn.animation($$('.messages-content'), {'margin-top': 0});
				window.Auto517.fn.animation($$('.messagebar'), {'height': 44});
			}
		});
		
		
		//表情面板
		$$('.chat-em-swiper-wrapper').html(getEMSlide());

		var mySwiper = myApp.swiper('.chat-em-swiper-container', {
			effect: 'slider',
			pagination: '.chat-em-swiper-pagination',
	  	});

	  	$$('.chat-em-icon-container').on('click', function(e){
	  		
	  		
	  		
	  		var text = $$(e.currentTarget).dataset().text;
	  		$$('.chat-input').val($$('.chat-input').val() + text);
	  	});
		//其他面板
		$$('.chat-ex-swiper-wrapper').html(getExtrasSlide());

		var mySwiper = myApp.swiper('.chat-ex-swiper-container', {
			effect: 'slider',
			pagination: '.chat-ex-swiper-pagination',
	  	});
		
		//console.log('emHeight, emWidth', emHeight, emWidth, maxRow, maxColumn);
    	//
		return ""
	}
		
	//
	(function(){
		$$(document).on('msgArrive', function(e){
			var data = e.detail;
			Auto517.Message.receiveMsg(data);
		});
		//
		var recordHeight = 130;
		var recordTop = $$('body').height()/2 - recordHeight/2;
		var recordLeft = $$('body').width()/2 - recordHeight/2;
		var recordHTML = '<div class="chat-voice-record" data-type="" style="display:none;height:' + recordHeight + 'px;width:' + recordHeight + 'px;position: absolute;top:' + recordTop + 'px;left:' + recordLeft + 'px;z-index:100000;background-color: rgba(0,0,0,0.6);border-radius: 9px;"></div>';
		$(recordHTML).appendTo($("body"));
	})();
	
	
	
	
	//
//	(function(){
//		$$(document).on('msgArrive', function(e){
//			var data = e.detail;
//			Auto517.Message.receiveMsg(data);
//		});
//	})();
	//
	return {
		'_data': _data,
		'addTxtMsg': 	_addTxtMsg,
		'addImgMsg': 	_addImgMsg,
		'addTypingStatuMsg': _addTypingStatuMsg,
		'getHistoryMsg': _getHistoryMsg,
		'receiveMsg': _receiveMsg,
		'getMsgToolBar':_getMsgToolBar,
		'addVoiceMsg': 	_addVoiceMsg
	};
}
//
Auto517.regist(_p_message, "Message");


//语音消息播放
function play(sss){
	api.startPlay({
		    path: sss
		},function( ret, err ){
			if(ret){
			}
		});
}

//下载语音消息
function down(sss){
	api.download({
	    url: sss,
	    savePath: '',
	    report: true,
	    cache: true,
	    allowResume: true
	}, function(ret, err) {
	    if (ret.state == 1) {
	        play(ret.savePath);
	    } else {
	
	    }
	});
}



function touchCancel(_privateSendMsgCallback){
	$$('.chat-voice-record').hide();
	api.stopRecord(function( ret, err ){
			    if( ret ){
			    	if(ret.duration == 0){
//			    		toast.show('录音太短！');
                        alert('录音太短！');
			    		return;
			    	}
			    	if($$('.chat-voice-record').data('type') == 'cancel'){
			    		return;
			    	}
			    		 var userExtra 	= {
							'counselId': Service.counselId,
							'userinfo': {
								'c_nickname': uname,
								'c_headimge': uimage,
								'c_type': 1,
								'c_duration':ret.duration
							},
							'type': 1
						};
						
						var voiceWidth = 15 + ret.duration * 2;
						var sendHtml = '<div style="width:'+voiceWidth+'px;" onclick=play("'+ret.path+'")>'+ret.duration+'\"</div>';
						var txtCfg = {
							text : sendHtml,
							avatar : rootUrl+uimage,
							type : 'sent',
							name : uname,
							day : (new Date().getMonth() + 1) + '-' + new Date().getDate(),
							time : (new Date()).getHours() + ':' + (new Date()).getMinutes()
						};
			    		 var imageUri = '';
			    		 api.ajax({
									url : rootUrl + '/api/upload',
									method : 'post',
									data : {files : {file : ret.path}}
								}, function(ret, err) {
									if (ret.execStatus == 'true') {
										imageUri = ret.formDataset.saveName;
										Auto517.RongCloud.sendPrivateVoiceMsg(Service.targetId, imageUri ,userExtra, Service.conversationtype, _privateSendMsgCallback);
									}else{
										api.alert({
											msg : '上传录音失败,请您重新上传'
										});
									}
								});
			    		 
			    		 
			    		 var messages = myApp.messages('.messages');
			    		 Auto517.Message.addVoiceMsg(messages,txtCfg);
			    }
			});
}


function ku(){
	$$('.chat-input-voice').touchend();
}

//拍照
		function showPic(camera){
			api.getPicture({
			    sourceType: camera,
			    encodingType: 'jpg',
			    mediaValue: 'pic',
			    destinationType: 'base64',
			    //allowEdit: true,
			    quality: 100,
//			    targetWidth: 600,
//			    targetHeight: 600,
                saveToPhotoAlbum: false
			}, function(ret, err) {
				if (ret != undefined) {
					if(ret.base64Data != ""){
						var base64Str = ret.base64Data;
//						var base64Str = 'data:image/jpg;base64,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';
						var imageUri = '';
                        api.ajax({
									url : rootUrl + '/api/upload',
									method : 'post',
									data : {files : {file : ret.data}}
								}, function(ret, err) {
									if (ret.execStatus == 'true') {
										imageUri = ret.formDataset.saveName;
										Service.sendImageMsg(Service.counselId, Service.targetId, imageUri,base64Str,Service.conversationtype);
									}else{
										api.alert({
											msg : '上传图片失败,请您从新上传'
										});
									}
								});
//                      cameraFun(imageUri, base64Str);
					}
				} else {
					myApp.alert("取消或相机打开失败");
				}
			});
//			var base64Str = 'data:image/jpg;base64,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';
//			var imageUri = globalVar.serverAddress + '/image/dog1.jpg';
//			cameraFun(imageUri, base64Str);
		}

