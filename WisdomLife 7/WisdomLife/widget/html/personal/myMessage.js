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
	var changeShow= $api.dom(".changeShow")
	if (api.systemType == 'ios') {
        if (api.screenHeight == 2436){
            $api.css(header, 'margin-top:2.2rem;');
            $api.css(changeShow, 'margin-top:4.4rem;');
        }else{
            $api.css(header, 'margin-top:1rem;');
            $api.css(changeShow, 'margin-top:3.2rem;');
        }
	};
	
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    getDetail(urId,99,page);
    changeIsReadStatus();
    api.setRefreshHeaderInfo({
		loadingImg : '../../image/mainbus.jpg',
		bgColor : '#ccc',
		textColor : '#fff',
		textDown : '下拉刷新...',
		textUp : '松开刷新...',
		showTime : false
	}, function(ret, err) {
		if(ret){
			location.reload();
			api.refreshHeaderLoadDone();
		}else{
			api.toast({
	            msg:err
            });
		}
		
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
	//更新所有消息为已读状态
	function changeIsReadStatus() {
//		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.center.message.message",
			needTrascation : true,
			funName : "changeIsReadStatus",
			form : {
				userNo : urId
			},
			success : function(data) {
				console.log('更新所有消息为已读状态'+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.msg;
//					alert(account);
				} else {
					api.toast({
	                    msg:data.formDataset.errorMsg
                    });
				}
			}
		});
	};
}
	var divs=$('.changeShow div');
	var spans=$('.changeShow div span');
	for(var i=0;i<divs.length;i++){
		$(divs[i]).click(function(){
			for(var j=0;j<divs.length;j++){
				$(spans[j]).removeClass();
			}
			$(this).find("span").addClass("special");
			if(this._zid=='1'){
				$('#showListAll').empty();
				$(".noMessage").hide();
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
			if(this._zid=='2'){
				$('#showListAll').empty();
				$(".noMessage").hide();
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
			if(this._zid=='3'){
				$('#showListAll').empty();
				$(".noMessage").hide();
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
			if(this._zid=='4'){
				$('#showListAll').empty();
				$(".noMessage").hide();
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
	api.execScript({//刷新我的界面金币总数的数据
				name : 'root',
				frameName : 'room',
				script : 'refresh();'
			});
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
			console.log($api.jsonToStr(data));
			if (data.execStatus == 'true') {
				var datas= data.datasources[0].rows;
				var newsResult='';
				if(datas==undefined || datas=="" || datas.length==0 || datas.length==null || datas.length==undefined || datas==null){
                  	if (pages == 1) {
							api.toast({
								msg : '暂无相关消息'
							});
							$(".noMessage").show();
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
					newsResult +='<div class="same">'
							+'<div class="sameTop">'+datas[i].sendtime+'</div>'
							+'<div class="sameBot">'
							+'<span class="sameTitle">'+type+'</span>'
							+'<div class="textContent">'+datas[i].message+'</div>'
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

