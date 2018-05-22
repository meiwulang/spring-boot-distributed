import $ from 'jquery';

import Person from '@/assets/js/develop/person/person.js';



import SPerson from '@/assets/js/develop/person/system_person.js';
import SPersonDetail from '@/assets/js/develop/person/system_person_detail.js';


export default {
	Index : function(){
		let uDataLimit = localStorage.uDataLimit;
		//let uDataLimit = 1;
		console.log(uDataLimit +'uDataLimit + p')

		switch(uDataLimit){
			case '0': //用户级
			    new Person();
				break;
			case '1': //部门级
				new Person();
				break;
			case '2': //单位级
				new Person();
				break;
			case '3': //系统级
				new SPerson();
				break;

		}
	},
	System : function(){
		let uDataLimit = localStorage.uDataLimit;
	
		switch(uDataLimit){
			case '0': //用户级
				break;
			case '1': //部门级				
				break;
			case '2': //单位级
				break;
			case '3': //系统级
				new SPersonDetail();
				break;

		}
	}




};