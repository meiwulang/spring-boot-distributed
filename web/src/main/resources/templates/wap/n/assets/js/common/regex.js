// desc : 公用正则表达式
// author : zhupinglei
// 344184416@qq.com

export default {
	Default : function(reg,str){
		return reg.test(str);
	},
	Username : function(str){
		let reg = /^[_A-Za-z0-9]{6,16}$/;
		return reg.test(str);
	},
	Password : function(str){
		let reg = /^[\w~!@#$%^&*()_+{}:"<>?\-=[\];\',.\/A-Za-z0-9]{6,16}$/;
		return reg.test(str);
	},
	Email : function(str){
		let reg = /^([a-zA-Z0-9]|[._])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
		return reg.test(str);
	},
	Tel : function(str){
		let reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
		return reg.test(str);
	},
	CN : function(str){
		let reg = /^[\u4E00-\u9FA5]+$/;
		return reg.test(str);
	}
}