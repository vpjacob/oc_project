apiready = function() {
var header = $api.byId('header');
		  var aboutus = $api.byId('aboutus');
		  var icon = $api.dom('.bar .icon');
		  var title = $api.dom('h1');
	      if (api.systemType == 'ios') {
		    var cc = $api.dom('.content');
		    $api.css(header, 'height:3.2rem');
		    $api.css(aboutus, 'margin-top:58px;');
		    $api.css(icon, 'line-height: 3.2rem;');
		    $api.css(title,'line-height: 4.2rem;');
	      }
	$("#back").on('click', function() {
		api.closeWin();
	});
}