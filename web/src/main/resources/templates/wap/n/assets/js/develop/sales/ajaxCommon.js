import $ from 'jquery';
import _ from '@/assets/js/common/global.js';

export default {
	ChartCompany : function(pram){
		let _this = this;
		return new Promise((resolve,reject)=>{
			_.Ajax({
				url : '/salesPerformance/querySalesPerformanceByCompanyIdAndDateType',
				type : 'post',
				data :pram,
				success : function(res){
					if( res.code == 200 ){	
						let resData = res.data;	
						//challback(resData);
						resolve(resData);
					}
				}
			});
		})
	},
	ChartDepartment : function(pram){
		let _this = this;
		return new Promise((resolve,reject)=>{
			_.Ajax({
					url : '/salesPerformance/querySalesPerformanceByDepartmentIdAndDateType',
				type : 'post',
				data : pram,
				success : function(res){
					if( res.code == 200 ){	
						let resData = res.data;	
						resolve(resData);
					}
				}
			});
		})
	},
	ChartUser : function(pram){
		let _this = this;
		return new Promise((resolve,reject)=>{
			_.Ajax({
					url : '/salesPerformance/querySalesPerformanceByUserIdAndDateType',
				type : 'post',
				data :pram,
				success : function(res){
					if( res.code == 200 ){	
						let resData = res.data;	
						resolve(resData);
					}
				}
			});
		})
	},
	ChartSystem : function(pram){
		let _this = this;
		return new Promise((resolve,reject)=>{
			_.Ajax({
					url : '/salesPerformance/querySalesPerformanceBySystemAndDateType',
				type : 'post',
				data :pram,
				success : function(res){
					if( res.code == 200 ){	
						let resData = res.data;	
						resolve(resData);
					}
				}
			});
		})
	},
	tabbleOfDepartment : function(pram){
		let _this = this;
		return new Promise((resolve,reject)=>{
			_.Ajax({
				url : '/department/sale/report',
				type : 'post',
				data :pram,
				success : function(res){
					if( res.code == 200 ){	
						let resData = res.data;	
						//challback(resData);
						resolve(resData);
					}
				}
			});
		});

	},
	queryDepartmentSaleCount : function(pram){
		let _this = this;
		return new Promise((resolve,reject)=>{
			_.Ajax({
				url : '/department/m/queryDepartmentSaleCount',
				type : 'post',
				data :pram,
				success : function(res){
					if( res.code == 200 ){	
						let resData = res.body;	
						resolve(resData);
					}
				}
			});
		});

	}
	

}