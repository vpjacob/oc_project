var om_wx;
var contacts;
//var bMap;
var isIOS;
var chatBox;
var imageBrowser;

apiready = function() {
    contacts = api.require('contacts');
	om_wx = api.require('wx');
//	bMap = api.require('bMap');
	// 引入多选模块
    uiMediaScanner = api.require('UIMediaScanner');
    // 引入过滤压缩模块
    imageFilter = api.require("imageFilter");
    
    isIOS = (api.systemType == "ios" ? true : false);
    
    imageBrowser = api.require('imageBrowser');
}