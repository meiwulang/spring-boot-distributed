
/*$( document ).on( "pageshow", function(){
    $( "p.message" ).hide().delay( 1500 ).show( "fast" );
});*/

/*$( document).delegate('pagebeforecreate', "#about", function(){
});*/

$(function(){
    $('#vcode').focus(function(){
        $(this).css('background-image', 'url(' + $app_root + 'plugins/vcode.php?_dc=' + time() + ')' );
    });

	var navHtml = '';
    $('.sunline_footer').each(function(i){
        if (i==0)
            navHtml = $(this).html();
        else
            $(this).html(navHtml);
    });
    //alert('ok?');
});






function time(d){
    var date=new Date();
    var yy=date.getFullYear();
    var MM=(date.getMonth() + 1);
    var dd=date.getDay();
    var hh=date.getHours();
    var mm=date.getMinutes();
    var ss=date.getSeconds();
    var sss=date.getMilliseconds();
    var result=Date.UTC(yy,MM,dd,hh,mm,ss,sss);
    return result;
}
