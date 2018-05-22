/**
 * Created by chaos on 2015/12/25.
 */
Ext.onReady(function(){
    Ext.define('mobile.form.field.VTypes', {
        override: 'Ext.form.field.VTypes',
        Mobile:  function(value) {
            return this.MobileRe.test(value);
        },
        MobileRe: /^1[34578]\d{9}$/,
        MobileText: '请填写正确的手机号码',
        MobileMask: /[\d\.]/i
    });
    Ext.define('card.form.field.VTypes', {
        override: 'Ext.form.field.VTypes',
        Card:function(value) {
            var check_result=CardChk(value);
            return check_result.start==1?true:false;
        },
        CardText: '请填写正确的身份证信息',
    });
    Ext.define('notblank.form.field.VTypes', {
        override: 'Ext.form.field.VTypes',
        NotBlank:function(value) {
            var value=value.replace(/ /g, "");
            if(value.length==0){
                return false;
            }else{
                return true;
            }
        },
        NotBlankText:'请填写具体内容'
    });

})
