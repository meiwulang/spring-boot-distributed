import $ from 'jquery';
import _ from '@/assets/js/common/global.js';

export default {
	ChartAjax : function(pram){
		let _this = this;
		return new Promise((resolve,reject)=>{
			_.Ajax({
				url : '/agentDistChart/chartData',
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
	
	tabbleOfAgent : function(pram){
		let _this = this;
		return new Promise((resolve,reject)=>{
			_.Ajax({
				url : '/agentStatistics/agentStatistics',
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

	},
	

}