myApp.onPageInit('search_index', function(page) {
	var mySearchbar = myApp.searchbar('.searchbar', {
		searchList: '.list-block-search',
		searchIn: '.item-title'
	});
	$$('#search-person').on('keyup keydown change', function(e) {
		var keyWord = $$('#search-person').val();
		if (e.keyCode == 13) {
			$$('#search-person').blur();
			mainView.router.loadPage('html/search/personnelSearchList.html?keyWord=' + keyWord);
		}
	});
});
myApp.onPageInit('personnelSearchList', function(page) {
	var keyWord = page.query.keyWord;
	searchByKeyWordList(keyWord, 1, 20);
});

//搜索-关键字搜索
function searchByKeyWordList(keyWord, cur_page, page_num) {
	if(keyWord==''){
		$$('#search_title').html('搜索"全部"');
	}else{
		$$('#search_title').html('搜索"'+keyWord+'"');
	}
	
	$$.ajax({
		url: rootUrl + 'index.php/search/Search_ajax/searchByKeyWordList',
		dataType: 'json',
		method: 'post',
		data: {
			cur_page: 1,
			page_num: 2,
			keyWord: keyWord,
			uid:uid
		},
		success: function(data) {
			var data_list = data.searchList;
			var ul = $$('#search_keyWord');
			
			if (data_list.length > 0) {
				for (var i = 0; i < data_list.length; i++) {
					var template = '';
					var id = data_list[i].id;
					var userName = data_list[i].userName;
					var age = data_list[i].age;
					var gender = data_list[i].gender;
					var genderEn = 'male';
					var userSign = data_list[i].userSign
					var userImage = data_list[i].userImage;
					var userLevel = data_list[i].userLevel;
					var creatTime = data_list[i].creatTime;
					var keyWords = data_list[i].keyWords;
					if (parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
						creatTime = Math.round(parseInt(creatTime) / 60) + '小时前';
					} else if (parseInt(creatTime) / 60 >= 24) {
						creatTime = Math.round(parseInt(creatTime) / (60 * 24)) + '天前';
					} else {
						creatTime = (creatTime==0?1:creatTime) + '分钟前';
					}
					if (gender == '2') {
						genderEn = 'famale';
					}
					var keyWordArr = new Array();
					var keyWordHtml = '';
					if (keyWords != null && keyWords != '') {
						keyWordArr = keyWords.split(',');
						for (var j = 0; j < keyWordArr.length; j++) {
							if ((keyWordArr[j].toLowerCase()).indexOf(keyWord.toLowerCase())>=0 ) {
								keyWordHtml += '<div class="keyword-search" style="font-size: 0.8em;"><span>' + keyWordArr[j] + '</span></div>';
							} else {
								keyWordHtml += '<div class="keyword" style="font-size: 0.8em;"><span>' + keyWordArr[j] + '</span></div>';
							}

						}
					}
					var winWidth = 70*Math.floor(api.winWidth/320);
					template += '<li>' +
						'<a href="html/user/userinfo_view.html?type=1&userID='+id+'" class="item-link">' +
						'<div class="item-link item-content">' +
						'<div class="item-media"><img src="' + (rootUrl + userImage) + '" style="height: '+winWidth+'px;width:'+winWidth+'px;"></div>' +
						'<div class="item-inner">' +
						'<div class="item-title-row" style="background-image:none;float: left;">' +
						'<div class="item-title"><span>' + userName + '</span></div>' +
						'<div class="sex sex-bgc' + gender + ' l_float">' +
						'<img class="img1" src="image/nearby/ic_user_' + genderEn + '.png" /><span>' + age + '</span>' +
						'</div>' +
						'<div class="communityDetal-vip l_float">' +
						'<img src="' + userLevel + '" style="width:100%;height: 100%;">' +
						'</div>' +
						'</div>' +
						'<div class="item-after"><span>'+data_list[i].distance+'km&nbsp;|&nbsp;' + creatTime + '</span></div>' +
						'<br />' +
						'<div class="item-text">' +
						'<span>' + userSign + '</span>' +
						'</div>' +
						'<div class="item-subtitle" style="margin-top: 4px;">' +
						'<div class="row no-gutter" style="margin-top: 10px;width: 7em;display: inline;">' +
						keyWordHtml +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</a>' +
						'</li>';
					ul.append(template);
				}
			} else {
				ul.append('<span>无数据</span>');
			}
		}
	});
}