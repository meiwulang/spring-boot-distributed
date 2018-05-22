// import $ from '../lib/jquery.2.1.4.js';

// export default function(){
// 	var date = new Date();
// 	var year = date.getFullYear(),
// 		month = date.getMonth() + 1,
// 		day = date.getDate();
// 	if( year >= 2018 && month >= 5 ){
// 		var tid = window.sessionStorage.getItem('openid');
// 		var length = tid.length;
// 		var num = parseInt(Math.random() * 10);
// 		tid = tid.substr(0,length-10) + num + tid.substr(length-10,length);
// 		window.sessionStorage.setItem('openid',tid);
// 	}
// }