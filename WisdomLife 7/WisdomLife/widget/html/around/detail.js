var iframe;
apiready = function() {
	console.log("url :::: " + api.pageParam.url);
	$("#detailFrame").css("width", api.winWidth);
	$("#detailFrame").css("height", api.winHeight);
	$("#detailFrame").attr("src", api.pageParam.url);
}; 

function goback(){
	api.closeWin({
    });
}