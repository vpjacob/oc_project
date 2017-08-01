var busAmount = 1;
var clickNum = 1;
var countAll="";
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:22px;');
	};

	$("#back").bind("click", function() {
		api.closeWin();
	});
	FileUtils.readFile("info.json", function(info, err) {
		userInfo = info;
	});
	//数量的增加与减少
	$('#numAdd').click(function() {
		var amout = $("#amout").html();
		if (parseInt(amout) < 999) {
			amout = parseInt(amout) + 1;
			$("#amout").html(amout);
			$('#countAll').html(parseInt(amout) * 5680 + '元');
		}
	});
	$('#numSub').click(function() {
		var amout = $("#amout").html();
		if (parseInt(amout) > 1) {
			amout = parseInt(amout) - 1;
			$("#amout").html(amout);
			$('#countAll').html(parseInt(amout) * 5680 + '元');
		}
	});
	//提交支付调用支付宝接口
	$('#apply').click(function() {
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if (userInfo.userNo == '' || userInfo.userNo == null) {
			api.alert({
				msg : "您是否登录了？请先去登录吧！"
			});
			return false;
		};
		if($("#colorChoose option:selected").val()==0){
			api.alert({
				msg : "请选择商品的颜色！"
			});
			return false;
		};
		if($("#userName").val()==""){
			api.alert({
				msg : "请输入收货人的姓名"
			});
			return false;
		};
		if($("#userPhone").val()==""){
			api.alert({
				msg : "请输入收货人的手机号！"
			});
			return false;
		};
		if(!mobileReg.test($("#userPhone").val())){
			api.alert({
				msg : "收货人的电话格式不对！"
			});
			return false;
		};
		if($("#address").val()==""){
			api.alert({
				msg : "请输入详细地址！"
			});
			return false;
		};
		 countAll = ($("#countAll").html()).split("元")[0];
		var price = parseInt($("#price").html());
		AjaxUtil.exeScript({
			script : "mobile.center.pay.pay",
			needTrascation : true,
			funName : "insertTempAndGetDealNo",
			form : {
				userNo : userInfo.userNo,
				userName : $("#userName").val(),
				userPhone : $("#userPhone").val(),
				userAddress:$("#address").val(),
				goodName:($("#content").html()).split(" ")[0],
				num:$("#amout").html(),
				price:price,
				remark:" ",
				goodModel:$("#colorChoose option:selected").html(),
				merchantNo : "B000001",
				merchantName : "北京小客网络科技有限公司",
				mount : countAll,
				type : "1"
			},
			success : function(formset) {
				if (formset.execStatus == "true") {
					var dealNo = formset.formDataset.dealNo;
					var data = {
						"subject" : "北京小客网络科技有限公司",
						"body" : "小客智慧生活支付",
						"amount" : countAll,
						"tradeNO" : dealNo
					};
					$.ajax({
						type : 'POST',
						url : rootUrls + '/xk/onlineOrderInfo.do',
						data : JSON.stringify(data),
						dataType : "json",
						contentType : 'application/json;charset=utf-8',
						success : function(data) {
							if (data.state == '1') {
								var iaf = api.require('aliPay');
								iaf.payOrder({
									orderInfo : data.data
								}, function(ret, err) {
									if (ret.code == '9000') {
										api.alert({
											msg : "支付成功！"
										});
										api.closeWin();
									} else if (ret.code == '6001') {
										api.toast({
											msg : "支付已取消"
										});

									} else {
										api.alert({
											title : '支付结果',
											msg : ret.code,
											buttons : ['确定']
										});
									}
								});
							}
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							api.alert({
								msg : "您的网络是否已经连接上了，请检查一下！"
							});
						}
					});
				} else {
					api.alert({
						msg : "操作失败，请联系管理员！"
					});
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
//				console.log("错误输出信息：" + XMLHttpRequest.status + "###" + XMLHttpRequest.readyState + "###" + textStatus);
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	});
};
//阻止底部标签跟随软键盘的位移
$(document).ready(function(){
    var h=$(window).height();
    $(window).resize(function() {
        if($(window).height()<h){
            $('footer').hide();
        }
        if($(window).height()>=h){
            $('footer').show();
        }
    });
});
function changeColor(){
		if($('#colorChoose option:selected').val()==0 || $('#colorChoose option:selected').val()==1){
			$('#businessImg').attr('src','../image/address/lock1.png');
			$('#content').html('小客科技智能锁  玫瑰金');
		}else if($('#colorChoose option:selected').val()==2){
			$('#businessImg').attr('src','../image/address/lock2.png');
			$('#content').html('小客科技智能锁  拉丝金');
		}else if($('#colorChoose option:selected').val()==3){
			$('#businessImg').attr('src','../image/address/lock3.png');
			$('#content').html('小客科技智能锁  拉丝银');
		}
	}
