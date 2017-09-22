var InfoUtil = {

}

/**
 * 读取用户信息
 * 参数：
 * 		sucessFn，执行成功后的回调，该函数有一个参数，当前文件中保存的userInfo，json对象
 * 		errorFn，执行失败后的回调，该函数有一个参数，err对象
 */
InfoUtil.readUserInfo = function(successFn, errorFn) {

	api.readFile({
		path : 'fs://info.json'
	}, function(ret, err) {
		if (ret.status) {
			successFn.call(null, JSON.parse(ret.data), null);
		} else {
			errorFn.apply(null, err);
		}
	});
}
/**
 * 重新写入用户信息进入文件
 * 参数：
 * 		userInfo，用户信息的内容，json对象
 * 		successFn，成功保存后的回调，该函数没有回调
 * 		errorFun，保存失败后的回调，该函数有一个参数，err对象
 */
InfoUtil.writeUserInfo = function(userInfo, successFn, errorFn) {

	api.writeFile({
		path : 'fs://info.json',
		data : JSON.stringify(userInfo)
	}, function(ret, err) {
		if (ret.status) {
			
		} else {
			
		}
	});

}
