var flag = true;
var urId="";
apiready = function() {
	$("#back").click(function(){
		api.closeWin();
	});
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
	});
	$(".clickButton").click(function(){
		$(".tankuang_box").hide();
		$(".tankuang").hide();
		api.openWin({
			name : 'welfare',
			url : 'welfare.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
//				id : $(this).attr('id')
			}
		});
	});
	
}
	//点击砸金蛋
	function eggClick(obj) {
		if (flag) {
			flag = false;
			if ($(obj).attr("data-flag") == "0") {
				console.log($(obj).children("div"));
				$(obj).children("div").show();
				var hammer=$(obj).find(".hammer");
				temptop = hammer.position().top;
				templeft = hammer.position().left;
				var ctop =hammer.position().top - 20;
				var cleft = hammer.position().left + 30;
				setTimeout(function() {
					lottery()
				}, 1300)
				//1.锤子抬起的动作
				$(".hammer").animate({
					"top" : ctop + "px",
					"left" : cleft + "px"
				}, 1000, function() {
					//2.锤子抬起达到最顶点的动作
					$(".hammer").css({
						"-webkit-transform" : "rotate(80deg)",
						"-moz-transform" : "rotate(80deg)",
						"-o-transform" : "rotate(80deg)",
						"transform" : "rotate(80deg)",
						"-webkit-transition" : "all 0.8s ease",
						"-moz-transition" : "all 0.8s ease",
						"-o-transition" : "all 0.8s ease",
						"transition" : "all 0.8s ease"
					});
					//3.锤子落下的动作
					$(".hammer").animate({
						"top" : (ctop + 25) + "px",
						"left" : (cleft - 50) + "px"
					}, 300, function() {
						api.startPlay({
							path : 'widget://res/gold.mp3'
						}, function(ret, err) {
							if (ret) {
								//						alert('播放完成');
							} else {
								alert(JSON.stringify(err));
							}
						});
						//4.锤子落下到达最低点
						$(".hammer").css({
							"-webkit-transform" : "rotate(5deg)",
							"-moz-transform" : "rotate(5deg)",
							"-o-transform" : "rotate(5deg)",
							"transform" : "rotate(5deg)",
							"-webkit-transition" : "all 0.1s ease",
							"-moz-transition" : "all 0.1s ease",
							"-o-transition" : "all 0.1s ease",
							"transition" : "all 0.1s ease"
						});
						//5.金蛋破碎
						$(obj).children(".mainEgg").attr("src", "../../image/award/brokenegg.png");
						$(obj).children(".mainEgg").css({
   								"width":"5.85rem;",
								"height":"3.925rem;",
						})
//						$(obj).children("div").attr("src", "../../image/award/brokenegg.png");
//						$(".tankuang_box").show();
						$(".hammer").hide();
						//6.金花溅出
//						$(obj).children(".mainEgg").attr("src", "../../image/award/badegg.png");
						//7.中奖结果
//						$(".fanzt-message").show(200);

						//8.程序处理
						$(obj).attr("data-flag", "1");
					});
				});
			}
			$(".hammer").position().top = temptop;
			$(".hammer").position().left = templeft;
		}

	};
		//用户抽奖接口
function lottery() {
	api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myaward",
			needTrascation : true,
			funName : "lottery",
			form : {
				userNo : urId
			},
			success : function(data) {
				api.hideProgress();
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var list = data.formDataset;
					$("#prizePrice").html(list.price);
					$("#prizename").html(list.name);
					$("#prizeImg").attr("src",rootUrl + list.img_url);
					$(".tankuang_box").show();
				} else {
					alert(data.formDataset.errorMsg);
				}
			},
			error : function(xhr, type) {
              api.hideProgress();
              alert("您的网络不给力啊，检查下是否连接上网络了！");
            }
		});
	}
	

