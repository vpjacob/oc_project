var iframe;
apiready = function() {
	$("#detailFrame").css("width", api.winWidth);
	$("#detailFrame").css("height", api.winHeight);
	$("#detailFrame").attr("src", api.pageParam.url);
}; 

function goback(){
	api.closeWin({
    });
}
