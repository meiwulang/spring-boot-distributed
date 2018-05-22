

import CompanyIndex from '@/assets/js/develop/agent1/company_index.js';
import CompanyIndex_t from '@/assets/js/develop/agent1/company_detail_time.js';
import CompanyIndex_d from '@/assets/js/develop/agent1/company_detail_department.js';

import DepartmentIndex from '@/assets/js/develop/agent1/department_index.js';
import DepartmentIndex_t from '@/assets/js/develop/agent1/department_detail_time.js';

import UserIndex from '@/assets/js/develop/agent1/user_index.js';


import SytemIndex from '@/assets/js/develop/agent1/system_index.js';
import SystemIndex_company from '@/assets/js/develop/agent1/system_index_company.js';
import SystemIndex_t from '@/assets/js/develop/agent1/system_detail_time.js';
import SystemIndex_d from '@/assets/js/develop/agent1/system_detail_department.js';
import SystemIndex_d_one from '@/assets/js/develop/agent1/system_detail_department_one.js';

/*localStorage.uDataLimit = '0';*/

export default {

	Index : function(){
		let uDataLimit = localStorage.uDataLimit;
         console.log(uDataLimit +'  uDataLimit + s')
		switch(uDataLimit){
			case '0': //用户级
			    new UserIndex();
				break;
			case '1': //部门级
				new DepartmentIndex();
				break;
			case '2': //单位级
				new CompanyIndex();
				break;
			case '3': //系统级
				new SytemIndex();
				break;
		}
	},
	Time : function(){
		let uDataLimit = localStorage.uDataLimit;
	
		switch(uDataLimit){
			case '0': //用户级			   
				break;
			case '1': //部门级
				new DepartmentIndex_t();
				break;
			case '2': //单位级
				new CompanyIndex_t();
				break;
			case '3': //系统级
				new SystemIndex_t();
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
				new CompanyIndex_d();
				break;
			case '3': //系统级
				new SystemIndex_d();
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
				new SystemIndex_company();
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
				new SystemIndex_d_one();
				break;

		}
	},
	

};