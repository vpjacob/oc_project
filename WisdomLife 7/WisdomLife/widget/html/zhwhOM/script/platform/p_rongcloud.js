/*******************************************************************************
 * Copyright (c) 2016 Auto517
 * Date     :2016-10-17
 * Desc     :RongCloud
 * Author   :Tuatua
 *******************************************************************************/
/**
 *  @namespace Auto517.RongCloud
 *  Method:
 *  Auto517.RongCloud();
 */
//# token
var _p_rongcloud = function() {
//	RongIMClient.init("y745wfm8y775v");
	RongIMClient.init("y745wfm8y775v");
	//
	(function(){
		// 连接状态监听器
		RongIMClient.setConnectionStatusListener({
			onChanged: function (status) {
				switch (status) {
					//链接成功
					case RongIMLib.ConnectionStatus.CONNECTED:
//						console.log('链接成功');
						break;
					//正在链接
					case RongIMLib.ConnectionStatus.CONNECTING:
//						console.log('正在链接');
						break;
					//重新链接
					case RongIMLib.ConnectionStatus.DISCONNECTED:
//						console.log('断开连接');
						break;
					//其他设备登录
					case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
//						console.log('其他设备登录');
						break;
					//网络不可用
					case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
						toast.show('当前网络不可用，请检查配置');
//						console.log('网络不可用');
//						//
//						console.log('正在重新连接');
						//
						RongIMClient.reconnect();
						break;
				}
			}
		});
	})();
	//
	function _connect(token, callback){
		RongIMClient.setOnReceiveMessageListener({
		    // 接收到的消息
		    onReceived: function (message) {
		    	//callback(message);
		    	$$(document).trigger('msgArrive', message);
		    }.bind(callback)
		});
		//
		RongIMClient.connect(token, {
	        onSuccess: function(userId) {
	        },
	        onTokenIncorrect: function() {
//          		console.log('token无效');
	        },
	        onError:function(errorCode){
          		var info = '';
				switch (errorCode) {
					case RongIMLib.ErrorCode.TIMEOUT:
						info = '超时';
						break;
					case RongIMLib.ErrorCode.UNKNOWN_ERROR:
						info = '未知错误';
						break;
					case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
						info = '不可接受的协议版本';
						break;
					case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
						info = 'appkey不正确';
						break;
					case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
						info = '服务器不可用';
						break;
				}
//				console.log('RongCloud Conection', errorCode, info);
				RongIMClient.reconnect();
            }
    	});
	}
	//
	function _reconnect(){
		//
		RongIMClient.reconnect();
	}
	//
	function _sendPrivateTxtMsg(targetId, content, extra, userExtra, conversationtype, callback){
		//
		var msg = new RongIMLib.TextMessage({
			content: content,
			extra: extra,
			user: userExtra
		});
		
		if(conversationtype == '1'){
			conversationtype = RongIMLib.ConversationType.PRIVATE;
		}else{
			conversationtype = RongIMLib.ConversationType.GROUP;
		}
//		console.log(' [ 发送消息 ] ', msg);
		//
		window.setTimeout(RongIMClient.getInstance().sendMessage(
			conversationtype, 
			targetId, 
			msg, 
			{
                onSuccess: function (message) {
                	//
            		this.call(this, message);
//                	console.log("Send successfully");
                }.bind(callback),
                onError: function (errorCode,message) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default :
                            info = errorCode;
                            break;
                    }
                    console.log('发送失败:' + info);
                    RongIMClient.reconnect();
                }
            }
        ),100);
		//
	}
	//
	function _sendPrivateImgMsg(targetId, base64Str, imageUri, extra, conversationtype,callback){
		//
		var msg = new RongIMLib.ImageMessage({
				content:base64Str,
				imageUri:imageUri,
			    user: extra
		});
        
		console.log(' [ 发送消息 ] ', msg);
		    if(conversationtype == '1'){
				conversationtype = RongIMLib.ConversationType.PRIVATE;
			}else{
				conversationtype = RongIMLib.ConversationType.GROUP;
			}
		
		//
		window.setTimeout(RongIMClient.getInstance().sendMessage(
			conversationtype, 
			targetId, 
			msg, 
			{
                onSuccess: function (message) {
                	this.call(this, message);
                    console.log("Send successfully");
                }.bind(callback),
                onError: function (errorCode,message) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default :
                            info = errorCode;
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            }
        ) ,100);
		//
	}
	
	function _sendPrivateVoiceMsg(targetId, imageUri, extra, conversationtype,callback){
		//
		var msg = new RongIMLib.VoiceMessage({
				content:imageUri,
			    user: extra
		});
        
		console.log(' [ 发送消息 ] ', msg);
		    if(conversationtype == '1'){
				conversationtype = RongIMLib.ConversationType.PRIVATE;
			}else{
				conversationtype = RongIMLib.ConversationType.GROUP;
			}
		
		//
		window.setTimeout(RongIMClient.getInstance().sendMessage(
			conversationtype, 
			targetId, 
			msg, 
			{
                onSuccess: function (message) {
                	this.call(this, message);
                    console.log("Send successfully");
                }.bind(callback),
                onError: function (errorCode,message) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default :
                            info = errorCode;
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            }
        ) ,100);
		//
	}
	
	//
	function _sendTypingStatusMsg(targetId, callback){
		//
//		var conversationType = RongIMLib.ConversationType.PRIVATE;
		var conversationtype = RongIMLib.ConversationType.GROUP;
		var msgName = "TextMessage";
		//
		window.setTimeout(RongIMClient.getInstance().sendTypingStatusMessage(
			conversationType, 
			targetId, 
			msgName, 
			{
                onSuccess: function (message) {
                    console.log("Send successfully");
                }.bind(callback),
                onError: function (errorCode,message) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        default :
                            info = errorCode;
                            break;
                    }
                    console.log('发送失败:' + info);
                }
        	}
        ) ,100);
		//
	}
	
	function _joinGroup(groupId,groupName){
		var groupId = groupId; // 群 Id 。
		var groupName = groupName;// 群名称 。
		window.setTimeout(RongIMClient.getInstance().joinGroup(groupId, groupName, {
		    onSuccess: function() {
		        // 加入群成功。
		    },
		    onError: function(error) {
		        // error => 加入群失败错误码。
		    }
		 }) ,3000);
	}
	//
	return {
		'connect': 				_connect,
		'reconnect': 			_reconnect,
		'sendPrivateTxtMsg': 	_sendPrivateTxtMsg,
		'sendPrivateImgMsg': 	_sendPrivateImgMsg,
		'sendTypingStatusMsg': 	_sendTypingStatusMsg,
		'sendPrivateVoiceMsg':  _sendPrivateVoiceMsg,
		'joinGroup':           _joinGroup
	};
}
	//
Auto517.regist(_p_rongcloud, "RongCloud");

