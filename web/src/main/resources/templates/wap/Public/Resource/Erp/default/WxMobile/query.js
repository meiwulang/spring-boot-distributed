$(function(){
        $('.fa').click(function(){
            var obj=$(this).parents('.header').siblings('.content');
            if(obj.is(":hidden")){
                obj.slideDown();
            }else{
                obj.slideUp();
            }
        })
})