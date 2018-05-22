

import Csales from '@/assets/js/develop/sales/company_index.js';
import Csales_detail_t from '@/assets/js/develop/sales/company_detail_time.js';
import Csales_detail_d from '@/assets/js/develop/sales/company_detail_department.js';

import Dsales from '@/assets/js/develop/sales/department_index.js';
import Dsales_detail_t from '@/assets/js/develop/sales/department_detail_time.js';
import Dsales_detail_p from '@/assets/js/develop/sales/department_detail_person.js';

import Usales from '@/assets/js/develop/sales/user_index.js';
import Usales_detail_t from '@/assets/js/develop/sales/user_detail_time.js';


import Ssales from '@/assets/js/develop/sales/system_index.js';
import Ssales_company from '@/assets/js/develop/sales/system_company_index.js';
import Ssales_detail_t from '@/assets/js/develop/sales/system_detail_time.js';
import Ssales_detail_d from '@/assets/js/develop/sales/system_detail_department.js';
import Ssales_detail_d_one from '@/assets/js/develop/sales/system_detail_department_one.js';
/*localStorage.uDataLimit = '0';*/

export default {

	Index : function(){
		let uDataLimit = localStorage.uDataLimit;
         console.log(uDataLimit +'  uDataLimit + s')
		switch(uDataLimit){
			case '0': //用户级
			    new Usales();
				break;
			case '1': //部门级
				new Dsales();
				break;
			case '2': //单位级
				new Csales();
				break;
			case '3': //系统级
				new Ssales();
				break;
		}
	},
	SystemIndex : function(){
		let uDataLimit = localStorage.uDataLimit;
		switch(uDataLimit){
			case '0': //用户级
				break;
			case '1': //部门级
			
				break;
			case '2': //单位级
				
				break;
			case '3': //系统级
				new Ssales_company();
				break;
		}
	},
	Time : function(){
		let uDataLimit = localStorage.uDataLimit;
	
		switch(uDataLimit){
			case '0': //用户级
			    new Usales_detail_t();
				break;
			case '1': //部门级
				new Dsales_detail_t();
				break;
			case '2': //单位级
				new Csales_detail_t();
				break;
			case '3': //系统级
				new Ssales_detail_t();
				break;

		}
	},
	Department : function(){
		let uDataLimit = localStorage.uDataLimit;
	
		switch(uDataLimit){
			case '0': //用户级
				break;
			case '1': //部门级
				break;
			case '2': //单位级
				new Csales_detail_d();
				break;
			case '3': //系统级
				new Ssales_detail_d();
				break;

		}
	},
	DepartmentOne : function(){
		let uDataLimit = localStorage.uDataLimit;
	
		switch(uDataLimit){
			case '0': //用户级
				break;
			case '1': //部门级
				break;
			case '2': //单位级
				break;
			case '3': //系统级
				new Ssales_detail_d_one();
				break;

		}
	},
	Agent : function(){
		let uDataLimit = localStorage.uDataLimit;
	
		switch(uDataLimit){
			case '0': //用户级
			   // new Dsales_detail_p();
				break;
			case '1': //部门级
				new Dsales_detail_p();
				break;
			case '2': //单位级
				break;
			case '3': //系统级
				break;

		}
	}




};