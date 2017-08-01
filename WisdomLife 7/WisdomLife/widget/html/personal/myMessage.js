var relateid;
var msgnum;
var page = 1;
var pageCount = 1;
apiready = function() {
	//同步返回结果：
//	relateid = api.pageParam.relateid;
	relateid="";
//	alert(relateid);
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	};
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		getDetail(urId,99,page);
	});
	//Android返回键的监听
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		goback();
	});
	api.addEventListener({
		name : 'scrolltobottom'
		}, function(ret, err) {
			if (parseInt(page) <= parseInt(pageCount)) {
				page++;
				getDetail(urId,99,page);
			} else {
				page = parseInt(pageCount) + 1;
			}
	});
}
var divs=$('.changeTog div');
	for(var i=0;i<divs.length;i++){
		$(divs[i]).click(function(){
			for(var j=0;j<divs.length;j++){
				$(divs[j]).removeClass();
			}
			$(this).addClass("special");
			if(this._zid=='3'){
				$('#showListAll').empty();
				page=1;
				getDetail(urId,$(this).attr('data'),1);
				api.addEventListener({
					name : 'scrolltobottom'
				}, function(ret, err) {
					if (parseInt(page) <= parseInt(pageCount)) {
						page++;
						getDetail(urId, 99, page);
					} else {
						page = parseInt(pageCount) + 1;
					}
				}); 
				
			};
			if(this._zid=='4'){
				$('#showListAll').empty();
				page=1;
				getDetail(urId,$(this).attr('data'),1);
				
				api.addEventListener({
					name : 'scrolltobottom'
				}, function(ret, err) {
					if (parseInt(page) <= parseInt(pageCount)) {
						page++;
						getDetail(urId, 1, page);
					} else {
						page = parseInt(pageCount) + 1;
					}
				}); 

				
			};
			if(this._zid=='5'){
				$('#showListAll').empty();
				page=1;
				getDetail(urId,$(this).attr('data'),1);
				api.addEventListener({
					name : 'scrolltobottom'
				}, function(ret, err) {
					if (parseInt(page) <= parseInt(pageCount)) {
						page++;
						getDetail(urId, 2, page);
					} else {
						page = parseInt(pageCount) + 1;
					}
				}); 
			};
			if(this._zid=='6'){
				$('#showListAll').empty();
				page=1;
				getDetail(urId,$(this).attr('data'),1);
				api.addEventListener({
					name : 'scrolltobottom'
				}, function(ret, err) {
					if (parseInt(page) <= parseInt(pageCount)) {
						page++;
						getDetail(urId, 3, page);
					} else {
						page = parseInt(pageCount) + 1;
					}
				}); 
			};
		})
	}
function goback() {
	api.closeWin();
}

function getDetail(urId,type,pages) {
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.message.message",
		needTrascation : false,
		funName : "messageinfo",
		form : {
			relateid : relateid,
			userNo:urId,
			msgtype:type,
			p:pages
		},
		success : function(data) {
			ProgressUtil.hideProgress();
			if (data.execStatus == 'true') {
				var datas= data.datasources[0].rows;
				var newsResult='';
				if(datas==undefined || datas=="" || datas.length==0 || datas.length==null || datas.length==undefined || datas==null){
                  	if (pages == 1) {
							api.toast({
								msg : '暂无相关消息'
							});
						} else {
							api.toast({
								msg : '无更多消息'
							});
						}
                  }else{
					for(var i=0;i<datas.length;i++){
					var type='';
					if(datas[i].msgtype==1){
						type='消费消息';
					}
					if(datas[i].msgtype==2){
						type='回购消息';
					}
					if(datas[i].msgtype==3){
						type='通知消息';
					}
					newsResult += '<div class="same">'
									+'<div class="sameBox">'
									+'<div class="top">'+datas[i].message+'</div>'
									+'<div class="bottom">'
									+'<span>'+datas[i].sendtime+'</span>'
									+'<span>'+type+'</span>'
									+'</div>'
									+'</div>'
									+'</div>'
				}
				$('#showListAll').append(newsResult);
				
				}
				
				pageCount = data.formDataset.queryCnt > 10 ? Math.ceil(data.formDataset.queryCnt / 10) : 1;
			} else {
//				api.alert({
//					msg : '没有查到您的信息或者您的网络出问题了!'
//				}, function(ret, err) {
//					//coding...
//				});
			}
		}
	});
}
