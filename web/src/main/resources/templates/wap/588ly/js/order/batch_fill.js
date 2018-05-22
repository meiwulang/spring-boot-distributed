 $('#batch_textarea').on({
    keyup : function(event){
        var kc = event.keyCode;
        if ( kc == 13 || kc == 8 || kc == 46 || (event.ctrlKey && kc==86) ){
            //console.log(event);
            batch_parse($(this));
        }
    }
});
	
$('#batch_textarea').scroll(function(t){
    var _t = $(this), st = _t.scrollTop();
    var row = $('#batch_row_number');
    row.css({ top : 0-st + 'px' });
});