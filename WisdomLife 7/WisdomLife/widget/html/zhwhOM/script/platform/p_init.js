/*******************************************************************************
 * Copyright (c) 2016 Auto517
 * Date     :2016-10-17
 * Desc     :公共组件初始化
 * Author   :Tuatua
 *******************************************************************************/
window.Auto517 = {
	"unique": null,
	//
	"plugin": {},
	//
	"regist": function(fun, registName) {
		//if(this.init == "already"){
		if(registName != null) {
			//
		} else {
			registName = fun.name;
		}
		//this.plugin.regisName = fun;
		eval("this.plugin." + registName + "" + "=  fun");
		//
		//console.info('Auto517 Plugin Regist [ ' + registName + ' ] ');
		//}
	},
	//
	"init": function(content) {
		if(Auto517.unique == null) {
			Dom7.each(Auto517.plugin, function(registName, fun) {
				try {
					eval("Auto517." + registName + "" + "=  new fun()");
					console.info('Auto517 Plugin initialize [ ' + registName + ' ] ');
				} catch(e) {
					console.error('Auto517 Plugin initialize error [ ' + registName + ' ] >>>>>' + e);
				}
			});
			Auto517.unique = 'init already';
		}
	}
};

window.Auto517.fn = {};
window.Auto517.fn.init = (function(){
    window.Auto517.fn.emjsonArray = new Array();
    $$.getJSON('image/em/em.json', function (data) {
        window.Auto517.fn.emjson = data;
        $$.each(window.Auto517.fn.emjson, function(index, value){
            var name = value.name;
            var text = value.text;
            //
            window.Auto517.fn.emjsonArray[text] = '<img src="image/em/' + name + '.png" style="height:20px;width:20px;" data-type="em"/>';
        });
    });
    return 'OK';
})();
window.Auto517.fn.transEm = function(text) {
    var regx = /\[(.*?)\]/gm;
    var textTransed = text.replace(regx, function(match) {
        return window.Auto517.fn.emjsonArray[match];
    });
    return textTransed;
}
window.Auto517.fn.animation = function(targetDOM, cssJSON){
	console.log(targetDOM.html())
    targetDOM.animate(
        cssJSON,
        {
            duration: 300,
            easing: 'swing',
            /* Callbacks */
            begin: function (elements) {
                console.log('animation began');
            },
            complete: function (elements) {
                console.log('animation completed');
            },
            progress: function (elements, complete, remaining, start) {
                console.log('animation in progress');
            }
        }
    );
}

