/*******************************************************************************
 * Copyright (c) 2016 Auto517
 * Date     :2016-10-17
 * Desc     :Apicloud扫描二维码
 * Author   :Tuatua
 *******************************************************************************/
/**
 *  @namespace Auto517.FNScanner
 *  Method:
 *  var result = Auto517.FNScanner.openScanner();
 */
var _p_FNScanner = function() {
    var FNScanner = api.require('FNScanner');
		//fun扫码完成后返回值
		function _openScanner(fun) {
			//
			var frameWidth = api.frameWidth;
			var frameHeight = api.frameHeight;
			//
			FNScanner.openView({
				autorotation: true,
				//sound: 'widget://sound/scanok.wav'
			}, function(ret, err) {
				androidBack='QRCode';
				if(ret.eventType == 'show') {
					//
					(function() {
						window.setTimeout(function() {
							api.openFrame({
								name: 'scanline',
								url: 'html/plugin/scanline.html',
							});
						}, 500);
					})();
				} else if(ret.eventType == 'success') {
					//
					api.startPlay({
						path: 'widget://sound/scanok.wav'
					}, function(ret, err) {
						if(ret) {
							//
							_exitScanner({
								value: {
									type: "success"
								}
							});
						} else {
							alert(JSON.stringify(err));
						}
					});
					//
					fun.call(window, ret);
				} else if(ret.eventType == 'fail') {
					myApp.alert('识别二维码失败');
				} else {
					_exitScanner({
						value: {
							type: "back"
						}
					});
				}
			});
			//
		}

		function _encodeImg(encodeUrl,callback) {
			FNScanner.encodeImg({
				type:"qr_image",
				content: encodeUrl,
				saveToAlbum: false,
				saveImg: {
					path: 'fs://album.png',
					w: 200,
					h: 200
				}
			}, function(ret, err) {
				if(ret.status) {
					callback(ret);
				} else {
					myApp.alert('生成二维码失败');
				}
			});
		}

		//
		(function() {
			api.addEventListener({
				name: 'closeScaner'
			}, function(ret, err) {
				_exitScanner(ret);
			});
		})();
		//
		function _exitScanner(ret) {
			var type = ret.value.type;

			function close() {
				api.closeFrame({
					name: 'scanline'
				});
				//
				FNScanner.closeView();
			}
			//
			if(type == 'back') {
				close();
			} else {
				window.setTimeout(function() {
					//
					close();
				}, 500);
			}
			//
		}
		//
		return {
			"openScanner": _openScanner,
			"encodeImg":_encodeImg,
			"_exitScanner":_exitScanner
		};
}
Auto517.regist(_p_FNScanner, "FNScanner");