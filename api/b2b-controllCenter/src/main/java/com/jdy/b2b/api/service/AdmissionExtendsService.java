package com.jdy.b2b.api.service;

import java.util.Map;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.admission.AdmissionContractTemplate;
import com.jdy.b2b.api.model.admission.AdmissionPrice;
import com.jdy.b2b.api.model.admission.AdmissionSalePrice;

/**
 * @Description 门票拓展业务接口层
 * @author 王斌
 * @date 2018年4月17日 下午2:33:53
 * @version V1.0
 */
public interface AdmissionExtendsService {

	/**
	 * @Description: 绑定合同
	 * @author 王斌
	 * @date 2018年4月17日 下午2:35:31
	 * @param vo
	 * @return
	 */
	ResultBean<Object> bindContract(AdmissionContractTemplate vo);

	/**
	 * @Description: 保存成本
	 * @author 王斌
	 * @date 2018年4月17日 下午2:36:22
	 * @param vo
	 * @return
	 */
	ResultBean<Object> saveCost(AdmissionPrice vo);

	/**
	 * @Description: 保存销售价格
	 * @author 王斌
	 * @date 2018年4月17日 下午2:37:25
	 * @param vo
	 * @return
	 */
	ResultBean<Object> savePrice(AdmissionSalePrice vo);

	/**
	 * @Description: 查看合同信息
	 * @author 王斌
	 * @date 2018年4月17日 下午2:57:18
	 * @param pid
	 * @return
	 */
	ResultBean<Object> contractInfo(Long pid);

	/**
	 * @Description: 查看成本信息
	 * @author 王斌
	 * @date 2018年4月17日 下午2:57:32
	 * @param pid
	 * @return
	 */
	ResultBean<Object> costInfo(Long pid);

	/**
	 * @Description: 查看价格信息
	 * @author 王斌
	 * @date 2018年4月17日 下午2:57:42
	 * @param pid
	 * @return
	 */
	ResultBean<Object> priceInfo(Long pid);

	/** 
	 * @Description: 票价列表
	 * @author 王斌
	 * @date 2018年4月24日 上午10:31:50
	 * @param pid
	 * @return
	 */
	ResultBean<Object> priceList(Map<String, Object> map);
	/** 
	 * @Description: 删除票价
	 * @author 王斌
	 * @date 2018年4月24日 上午10:31:50
	 * @param pid
	 * @return
	 */
	ResultBean<Object> deletePrice(AdmissionSalePrice asp);

}
