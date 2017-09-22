var PrefsUtil = {

}

/**
 * 设置偏好数据，全局可用
 * 参数：
 * 		k=key，保存对象的键
 * 		v=value，保存对象的值
 */
PrefsUtil.setPrefs = function(k,v) {
	api.setPrefs({
    key: k,
    value: v
});
}
/**
 * 读取偏好数据
 * 参数：
 * 		key，对象的键
 */
PrefsUtil.getPrefs= function(key) {

	var userName = api.getPrefs({
		sync : true,
		key : key
	});
	return userName;
}
