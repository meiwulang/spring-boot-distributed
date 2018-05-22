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
	},
	Passport :function(str){
		let reg = /^1[45][0-9]{7}|([P|S]\d{7})|([S|G]\d{8})|([G|T|S|L|Q|D|A|F|E]\d{8})|([G|T|S|L|Q|D|A|F|E][\w]\d{7})|([H|M]\d{8,10})$/;
		return reg.test(str);		
	},
	CardChk : function(idcard){
		var Errors = new Array("ok","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","验证失败，请注意数字或字母大小写的准确性，填写正确的验证信息!","身份证地区非法!");
		var area = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外"
		}
		var idcard, Y, JYM;
		var S, M;
		var idcard_array = new Array();
		idcard_array = idcard.split("");
		//地区检验
		var Area = area[parseInt(idcard.substr(0, 2))];
		if (Area == null)
			return {
				start: 0,
				info: Errors[4]
			};
		//身份号码位数及格式检验
		var Birthday = ''
		  , sexCode = '';
		switch (idcard.length) {
			case 15:
				Birthday = '19' + idcard.substr(6, 2) + '-' + idcard.substr(8, 2) + '-' + idcard.substr(10, 2);
				sexCode = idcard.substring(14, 15);
				break;
			case 18:
				//18位身份号码检测
				//出生日期的合法性检查
				Birthday = idcard.substr(6, 4) + '-' + idcard.substr(10, 2) + '-' + idcard.substr(12, 2);
				sexCode = idcard.substring(16, 17);
				//计算校验位
				S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
				Y = S % 11;
				M = "F";
				JYM = "10X98765432";
				M = JYM.substr(Y, 1);
				//判断校验位
				if (M == idcard_array[17]) {//return Errors[0]; //检测ID的校验位
				} else {
					return {
						start: 0,
						info: Errors[3]
					};
				}
				break;
			default:
				return {
					start: 0,
					info: Errors[1]
				};
				break;
		}
		var cSex = '';
		if (sexCode % 2 == 0) {
			cSex = '女';
		} else {
			cSex = '男';
		}
		return {
			start: 1,
			data: {
				area: Area,
				birthday: Birthday,
				sex: cSex
			}
		};
	}

}