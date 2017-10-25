var id = "";
var page = 1;
var pageCount = 1;
var cityName="";
apiready = function() {
//	alert(cityName);
	var header = $api.byId('title');
	var miancss = $api.dom('.businessList');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:1.1rem;');
		$api.css(miancss, 'margin-top:3.3rem;');
	};
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	//调用金蛋龙虎榜
	function queryCollectionList() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : true,
			funName : "goldEggEveryValue",
			form : {},
			success : function(data) {
				api.hideProgress();
				console.log("金蛋龙虎榜"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var list = $api.strToJson(data.formDataset.goldEggBoard);
					var nowli = "";
					for (var i = 0; i < list.length; i++) {
						if(i==0){
							if(String(list[i].head_image) !='null'){
								$("#onehead").attr("src",rootUrl + list[i].head_image);
							}
							if(list[i].username==null || list[i].username== undefined ||list[i].username==""){
								$("#oneName").html("暂无");
							}else{
								$("#oneName").html(list[i].username);
							}
							$("#oneJb").html((list[i].money).toFixed(3));
						}else if(i==1){
							if(String(list[i].head_image) !='null'){
								$("#twohead").attr("src",rootUrl + list[i].head_image);
							}
							if(list[i].username==null || list[i].username== undefined ||list[i].username==""){
								$("#twoName").html("暂无");
							}else{
								$("#twoName").html(list[i].username);
							}
							$("#twoJb").html((list[i].money).toFixed(3));
						}else if(i==2){
							if(String(list[i].head_image) !='null'){
								$("#thirdhead").attr("src",rootUrl + list[i].head_image);
							}
							if(list[i].username==null || list[i].username== undefined ||list[i].username==""){
								$("#thirdName").html("暂无");
							}else{
								$("#thirdName").html(list[i].username);
							}
							$("#thirdJb").html((list[i].money).toFixed(3));
						}else{
							 var k=i+1;
							 var imgUrl="";
							 var listName="";
							if (String(list[i].head_image) != 'null') {
								imgUrl = rootUrl + list[i].head_image;
							} else {
								imgUrl = '../../image/eggList/icon_c.png'
							}
							if(list[i].username==null || list[i].username== undefined ||list[i].username==""){
								listName="暂无";
							}else{
								listName=list[i].username;
							}
							nowli+='<div class="same">'
								+'<div class="sameBox">'
								+'<span class="botRanking">NO.'+k+'</span>'
								+'<div class="botDiv">'
								+' <img src="'+imgUrl+'" alt="" class="botImg"/> '
								+'</div>'
								+'<span class="botName">'
								+''+listName+''
								+'</span>'
								+'<span class="sameLast">枚</span>'
								+'<span class="sameCount">'+(list[i].money).toFixed(3)+'</span>'
								+'<img src="../../image/eggList/icon_a.png" alt="" class="botGold"/>'
								+'</div>'
								+'</div>'
						}		
						$('#otherList').html(nowli);
					}
					
				} else {
					console.log(data.formDataset.errorMsg);
				}
			},
			error : function(xhr, type) {
				api.hideProgress();
				api.toast({
	                msg:'您的网络不给力啊，检查下是否连接上网络了！'
                });
			}
		});
	};
	queryCollectionList();

}	
function goBack() {
	api.closeWin({
	});
}
