$.init();
var memberid;
var roomid;
apiready = function() {

var header = $api.byId('header');
	if(api.systemType=='ios')
	{	  
	    var cc=$api.dom('.content');
		$api.css(header,'margin-top:20px;');
		$api.css(cc,'margin-top:20px;');		
	}
	
memberid = api.pageParam.memberid;
roomid=api.pageParam.roomid;
	ProgressUtil.showProgress();
	AjaxUtil.exeScript({
		script : "managers.home.home",
		needTrascation : false,
		funName : "addinfo",
		form : {
			memberid : memberid,
			roomid : roomid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				var result = data.datasources[0].rows[0];
				$('#applicant').val(result.nick);
				$('#telphone').val(result.telphone);
				$('#fno').val(result.name + "  " + result.fno + "  " + result.roomno);
			} else {
			api.alert({
				msg : "请求失败"
			}, function(ret, err) {
				//coding...
			});
			}
		}
	});
	$(document).on('touchstart', '.changeC', function() {
		$(this).css({
			"background-color" : "#fff",
			"color" : "#1fb8f0"
		});
	});
	$(document).on('touchend', '.changeC', function() {
		$(this).css({
			"background-color" : "#1fb8f0",
			"color" : "#fff"
		});
	});
	$('#back').click(function() {
		api.closeWin();
	});
	$('.col').click(function() {
		var text = $('#descript').val();
		var input = /^[\s]*$/;
		if (input.test(text)) {
		api.alert({
				msg : "报修事由不能为空"
			}, function(ret, err) {
				//coding...
			});
		} else if (input.test($('#subdistrictsid').val())) {
		api.alert({
				msg : '请选择您的报修类型'
			}, function(ret, err) {
				//coding...
			});
		} else {
			ProgressUtil.showProgress();
			AjaxUtil.exeScript({
				script : "managers.home.home",
				needTrascation : false,
				funName : "addfix",
				form : {
					memberid : memberid,
					roomid : roomid,
					ftype : $('#subdistrictsid').val(),
					descript : text
				},
				success : function(data) {
					api.hideProgress();
					if (data.execStatus == 'true') {
						api.closeWin();
					} else {
					api.alert({
				msg : "请求失败"
			}, function(ret, err) {
				//coding...
			});
					}
				}
			});
		}
	});
};
/**
 *点击跳转到新闻详情
 * @param {Object} fid
 */
function jump(fid) {
	api.openWin({
		name : 'maintaininfo',
		url : 'maintainadd.html',
		//			url : 'maintaininfo.html',
		pageParam : {
			fid : fid
		},
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}

function touchstart(o) {
	o.style.backgroundColor = '#eaeaea';
	var aDiv = document.getElementsByTagName('li');
	for (var i = 0; i < aDiv.length; i++) {
		aDiv[i].id = 'li' + i;
		// var aa=aDiv.setAttribute("id",'li'+i);
		if (aDiv[i].id == o.id) {
			setTimeout(function() {
				test(o.id);
			}, 1000 * 0.2);
		}
	}
}

function test(ss) {
	var aa = document.getElementById(ss);
	aa.style.background = "#fff";
}