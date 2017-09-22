var ProgressUtil= {

}
ProgressUtil.showProgress=function (){
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		text : '先喝杯茶...'
	});
}
ProgressUtil.hideProgress=function (){
	api.hideProgress();
}