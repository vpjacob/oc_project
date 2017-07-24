myApp.onPageInit('maillist', function(page) {
	$$('.div-yichufans').attr('style', 'display:none;');
	sortableContainer = $$('.list-block.sortable');
	//	$$('.right a').attr('id', 'tianjia');

	$$('.show-tab-1').on('click', function() {
		myApp.showTab('#tab1');
		$$('.center span').html('通讯录');
		$$('.right i').addClass('icon-user-plus');
		$$('.right a').attr('id', 'tianjia');
		$$('.right span').html('');
		if ($$('.show-tab-1').hasClass('active') == false) {
			$$('.show-tab-1').addClass('active');
		}
		if ($$('.show-tab-2').hasClass('active')) {
			$$('.show-tab-2').removeClass('active');
		}
		if ($$('.show-tab-3').hasClass('active')) {
			$$('.show-tab-3').removeClass('active');
		}
		$$('.list-index.transparent_class').attr('style', 'color:#777777;');
		$$('.div-yichufans').attr('style', 'display:none;');
	});
	$$('.show-tab-2').on('click', function() {
		myApp.showTab('#tab2');
		$$('.center span').html('关注(64)');
		$$('.icon-user-plus').removeClass('icon-user-plus');
		$$('.right span').html('排序');
		$$('.right a').attr('id', 'paixu');
		if ($$('.show-tab-2').hasClass('active') == false) {
			$$('.show-tab-2').addClass('active');
		}
		if ($$('.show-tab-1').hasClass('active')) {
			$$('.show-tab-1').removeClass('active');
		}
		if ($$('.show-tab-3').hasClass('active')) {
			$$('.show-tab-3').removeClass('active');
		}
		$$('.list-index.transparent_class').attr('style', 'display: none;');
		$$('.div-yichufans').attr('style', 'display:none;');
	});
	$$('.show-tab-3').on('click', function() {
		myApp.showTab('#tab3');
		$$('.center span').html('粉丝(83)');
		$$('.icon-user-plus').removeClass('icon-user-plus');
		$$('.right span').html('编辑');
		$$('.right a').attr('id', 'bianji');
		if ($$('.show-tab-3').hasClass('active') == false) {
			$$('.show-tab-3').addClass('active');
		}
		if ($$('.show-tab-1').hasClass('active')) {
			$$('.show-tab-1').removeClass('active');
		}
		if ($$('.show-tab-2').hasClass('active')) {
			$$('.show-tab-2').removeClass('active');
		}
		if (sortableContainer.hasClass('sortable-opened')) {
			sortableContainer.removeClass('sortable-opened');
		}
		sortableContainer.trigger('close');
		$$('.div-yichufans').attr('style', 'display:none;');
		$$('.list-index.transparent_class').attr('style', 'display: none;');
	});
	//- Two groups
	$$('.right a').on('click', function() {
		var state = '';
		state = $$(this).attr('id');
		if (state == 'paixu') {
			var buttons1 = [{
				text: '排序',
				label: true
			}, {
				text: '按距离',
				bold: true
			}, {
				text: '按最后活跃时间',
				bold: true
			}, {
				text: '按添加好友时间',
				bold: true
			}, {
				text: '按首字母',
				bold: true
			}];
			var buttons2 = [{
				text: '取消',
				bold: true
			}];
			var groups = [buttons1, buttons2];
			myApp.actions(groups);
		} else if (state == 'tianjia') {
			mainView.router.load({
				url: "addfriends.html"
			});
		} else if (state == 'bianji') {
			if (sortableContainer.length === 0) sortableContainer = $('.list-block.sortable');
			sortableContainer.toggleClass('sortable-opened');
			if (sortableContainer.hasClass('sortable-opened')) {
				sortableContainer.trigger('open');
				$$('.div-yichufans').attr('style', 'display:block;');
				$$('.right span').html('取消');
			} else {
				sortableContainer.trigger('close');
				$$('.right span').html('编辑');
				$$('.div-yichufans').attr('style', 'display:none;');
			}

			return sortableContainer;

		}

	});
});


myApp.onPageInit('personMess', function(page) {

});

myApp.onPageInit('addfriends', function(page) {

});

myApp.onPageInit('friendset', function(page) {
	$$('.quexiao').on('click', function() {
		$$('.quexiao a').attr('style', 'background-color:#F14E51;color: #fff;border-color:#F14E51;');
		$$('.yichu a').attr('style', '');
	});
	$$('.yichu').on('click', function() {
		$$('.yichu a').attr('style', 'background-color:#F14E51;color: #fff;border-color:#F14E51;');
		$$('.quexiao a').attr('style', '');
	});
});