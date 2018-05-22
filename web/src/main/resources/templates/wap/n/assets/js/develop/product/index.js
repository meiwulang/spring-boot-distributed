import $ from 'jquery';

import Product from '@/assets/js/develop/product/product.js';
import ProductDetail from '@/assets/js/develop/product/product_detail.js';
import ProductDetailDepartment from '@/assets/js/develop/product/product_detail_department.js';

import ProductUser from '@/assets/js/develop/product/product_user.js';

import System from '@/assets/js/develop/product/system.js';
import SystemCompany from '@/assets/js/develop/product/system_company.js';
import SystemCompanyDetail from '@/assets/js/develop/product/system_company_detail.js';
import SystemDepartmentDetail from '@/assets/js/develop/product/system_department_detail.js';

export default {
	Index : function(){
		let uDataLimit = localStorage.uDataLimit;
		//let uDataLimit = 1;
		console.log(uDataLimit +'uDataLimit + p')

		switch(uDataLimit){
			case '0': //用户级
			    new ProductUser();
				break;
			case '1': //部门级
				new Product();
				break;
			case '2': //单位级
				new Product();
				break;
			case '3': //系统级
				new System();
				break;

		}
	},
	Detail : function(){
		let uDataLimit = localStorage.uDataLimit;
	
		switch(uDataLimit){
			case '0': //用户级
			    //new ProductUser();
				break;
			case '1': //部门级
				new ProductDetailDepartment();
				break;
			case '2': //单位级
				new ProductDetail();
				break;
			case '3': //系统级
				new SystemCompanyDetail();
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
				new SystemCompany();
				break;
		}
	},
	SystemDepartment : function(){
		let uDataLimit = localStorage.uDataLimit;
	
		switch(uDataLimit){
			case '0': //用户级
				break;
			case '1': //部门级
				
				break;
			case '2': //单位级
				break;
			case '3': //系统级
				new SystemDepartmentDetail();
				break;
		}
	}




};