export default function(){
	let host = window.location.host;
	let api = '';
	switch(host){
		// 测试地址
		case 'h5.b2b.test.fingercrm.cn':
			api = 'http://b2b.test.fingercrm.cn';
			break;
		// 本地开发
		case 'local.b2b-web.jdytrip.cn':
			// api = 'http://192.168.1.216:8200';
			api = 'http://b2b.test.fingercrm.cn';
			// api = "http://192.168.1.116:8200";
			break;
		case 'b2b.test.fingercrm.cn':
		    api = 'http://b2b.test.fingercrm.cn';
			break;
		case 'b2b.cstest.fingercrm.cn':
			api = 'http://b2b.cstest.fingercrm.cn';
			break;
		case 'b2b.test2.fingercrm.cn':
		    api = 'http://b2b.test2.fingercrm.cn';
			break;
		case 'b2b.dev.fingercrm.cn':
		    api = 'https://b2b.dev.fingercrm.cn';
			break;
		// case 'b2b.pro.fingercrm.cn':
		// 	api = 'http://b2b.pro.fingercrm.cn';
		// 	break;
		// 线上生产
		default:
			api = 'https://b2b.fingercrm.cn';
			break;
	}
	return api;
}