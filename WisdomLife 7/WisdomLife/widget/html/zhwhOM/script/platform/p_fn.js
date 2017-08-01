var _p_fn = function() {
	        var fn = {};
			function init(){
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
			}();
			window.Auto517.fn.transEm = function(text) {
			    var regx = /\[(.*?)\]/gm;
			    var textTransed = text.replace(regx, function(match) {
			        return window.Auto517.fn.emjsonArray[match];
			    });
			    return textTransed;
			}
			window.Auto517.fn.animation = function(targetDOM, cssJSON){
			    targetDOM.animate(
			        cssJSON,
			        {
			            duration: 300,
			            easing: 'swing',
			            /* Callbacks */
			            begin: function (elements) {
			            },
			            complete: function (elements) {
			            },
			            progress: function (elements, complete, remaining, start) {
			            }
			        }
			    );
			}
	
	 return {
        "_uichatbox_open": _uichatbox_open,
        "_inputBar_move": _inputBar_move,
        "_inputBar_closeBoard": _inputBar_closeBoard,
        "_inputBar_close": _inputBar_close,
        "_inputBar_show_hide": _inputBar_show_hide,
        "_inputBar_placeholder": _inputBar_placeholder,
        "_inputBar_setvalue": _inputBar_setvalue,
        "_inputBar_popupBoard": _inputBar_popupBoard,
        "_im_transText": _im_transText
    };
}
//
Auto517.regist(_p_uichatbox, "UIChatbox");
