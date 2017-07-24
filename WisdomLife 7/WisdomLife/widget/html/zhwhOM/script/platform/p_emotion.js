var _p_emotion = function(){
	im_getEmotionCommunityPaths = function(sourcePathOfChatBox, callback) {
		var jsonPath = sourcePathOfChatBox + "/em.json";
		api.readFile({
			path : jsonPath
		}, function(ret, err) {
			if (ret.status) {
				var emotionArray = JSON.parse(ret.data);
				/*把emotion对象 回调出去*/
				if ("function" === typeof (callback)) {
					callback(emotionArray);
				}
			}
		});
	};
	
	/**
	 * 用于把用utf16编码的字符转换成实体字符，以供后台存储
	 * @param  {string} str 将要转换的字符串，其中含有utf16字符将被自动检出
	 * @return {string}     转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符
	 */
 	utf16toEntities=function (str) {
	    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
	    str = str.replace(patt, function(char){
	            var H, L, code;
	            if (char.length===2) {
	                H = char.charCodeAt(0); // 取出高位
	                L = char.charCodeAt(1); // 取出低位
	                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
	                return "&#" + code + ";";
	            } else {
	                return char;
	            }
	        });
	    return str;
	}
	return{
		"im_getEmotionCommunityPaths":im_getEmotionCommunityPaths,
		"utf16toEntities":utf16toEntities
	}
}
Auto517.regist(_p_emotion,"p_emotion");
