var _p_uichatbox = function() {
	var UIChatBox = api.require('UIChatBox');
	function _uichatbox_open(callback) {
		UIChatBox.open({
			name:"uichat",
			placeholder : '请在此处输入评论内容',
			maxRows : 4,
			emotionPath : 'widget://image/em',
			texts : {
				sendBtn : {
					title : '发送'
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
					titleColor : '#ffffff',
					bg : '#0eaae3',
					activeBg : '#46a91e',
					titleSize : 14
				}
			}
		}, function(ret, err) {
			
			api.sendEvent({
			    name: 'uichatOpen',
			    extra: {
			        key1: 'value1',
			        key2: 'value2'
			    }
			});
			
			if (ret) {
				if (ret.eventType == 'send') {
					if (ret.msg.length > 0 && ret.msg.trim().length > 0) {
						callback(ret.msg.substr(0, 256));
					}
				}
			} else {
				
			}
		});
	}

	function _inputBar_move(page, page_height,framename) {
		var panelHeight_s = 0;
		if (api.deviceModel == 'mx4pro') {
			panelHeight_s = 48;
		}
		
		if ( typeof (UIChatBox) != "undefined" && null != UIChatBox) {
			UIChatBox.addEventListener({
				target : 'inputBar',
				name : 'move'
			}, function(ret, err) {
				var winHeight;
				if (ret.panelHeight < 50) {
					panelHeight_s = ret.panelHeight;
					winHeight = api.winHeight - 20;
				} else {
					winHeight = api.winHeight - ret.panelHeight - ret.inputBarHeight - 20 + panelHeight_s;
				}
				console.log("page_height="+page_height);
				console.log("winHeight="+page_height);
				console.log("ret.panelHeight="+ret.panelHeight);
				
				api.setFrameAttr({
					name : framename,
					rect : {
						x : 0,
						y : 20,
						w : 'auto',
						h : winHeight
					},
					softInputMode : 'pan',
					allowEdit : true
				});
				if (ret.panelHeight >= 50) {
					window.setTimeout(function() {
						$$(page).find('.page-content').scrollTop(page_height  + 50, 500);
					}, 300);
				}
			});
		}
	}

	function _inputBar_closeBoard() {
		if ( typeof (UIChatBox) != "undefined" && null != UIChatBox) {
			UIChatBox.closeKeyboard();
			UIChatBox.closeBoard();
		}
	}

	function _inputBar_close() {
		if ( typeof (UIChatBox) != "undefined" && null != UIChatBox) {
			UIChatBox.close();
		}
	}

	function _inputBar_show_hide(temp) {
		if ( typeof (UIChatBox) != "undefined" && null != UIChatBox) {
			if(temp == "show"){
				UIChatBox.show();
			}else{
				UIChatBox.hide();
			}
		}
	}

	function _inputBar_placeholder(objtext) {
		UIChatBox.setPlaceholder({
			placeholder : objtext
		});
	}

	function _inputBar_setvalue(objtext) {
		UIChatBox.value({
			msg : objtext
		});
	}

	//键盘弹出
	function _inputBar_popupBoard() {
		if ( typeof (UIChatBox) != "undefined" && null != UIChatBox) {
			UIChatBox.popupKeyboard();
		}
	}

	function _im_transText(text, imgWidth, imgHeight) {
		var imgWidth = imgWidth || 20;
		var imgHeight = imgHeight || 20;
		var regx = /\[(.*?)\]/gm;
		var textTransed = text.replace(regx, function(match) {
			var imgSrc = '';

			if (!_im_emotionData || !_im_emotionData[match]) {
				return match;
			}

			imgSrc = _im_emotionData[match];

			if (!imgSrc) {
				return match;
			}
			var img = "<img src=" + imgSrc + " width=" + imgWidth + " height=" + imgHeight + " />";
			return img;
		});
		return textTransed;
	}
	
	im_getEmotionPaths = function(callback) {
		var _im_sourcePath = "widget://image/em"; 
		var jsonPath = _im_sourcePath + "/em.json";
		api.readFile({
			path : jsonPath
		}, function(ret, err) {
			if (ret.status) {
				var emotionArray = JSON.parse(ret.data);
				var emotion = {};
				for (var idx in emotionArray) {
					var emotionItem = emotionArray[idx];
					var emotionText = emotionItem["text"];
					var emotionUrl = "image/em/" + emotionItem["name"] + ".png";
					emotion[emotionText] = emotionUrl;
				}
				/*把emotion对象 回调出去*/
				if ("function" === typeof (callback)) {
					callback(emotion);
				}
			}
		});
	};
	
	 return {
        "_uichatbox_open": _uichatbox_open,
        "_inputBar_move": _inputBar_move,
        "_inputBar_closeBoard": _inputBar_closeBoard,
        "_inputBar_close": _inputBar_close,
        "_inputBar_show_hide": _inputBar_show_hide,
        "_inputBar_placeholder": _inputBar_placeholder,
        "_inputBar_setvalue": _inputBar_setvalue,
        "_inputBar_popupBoard": _inputBar_popupBoard,
        "_im_transText": _im_transText,
        "im_getEmotionPaths":im_getEmotionPaths
    };
}
//
Auto517.regist(_p_uichatbox, "UIChatbox");
