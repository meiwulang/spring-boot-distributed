package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.service.AdmissionBaseService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.admission.AdmissionContractTemplate;
import com.jdy.b2b.api.model.admission.AdmissionPrice;
import com.jdy.b2b.api.model.admission.AdmissionSalePrice;
import com.jdy.b2b.api.service.AdmissionExtendsService;

/**
 * @Description 门票拓展信息控制层
 * @author 王斌
 * @date 2018年4月17日 下午1:37:37
 * @version V1.0
 */
@RestController
@RequestMapping("admission")
public class AdmissionExtendsController extends BaseController {
	private static final String BIND_CONTRACT = "bind-contract";
	private static final String SAVE_PRICE = "save-price";
	private static final String SAVE_COST = "save-cost";
	private static final String CONTRACT_INFO = "contract-info";
	private static final String PRICE_INFO = "price-info";
	private static final String PRICE_LIST = "price-list";
	private static final String DELETE_PRICE  = "delete-price";
	private static final String COST_INFO = "cost-info";
	@Autowired
	private AdmissionExtendsService aeService;
	@Autowired
	private AdmissionBaseService admissionBaseService;

	@PostMapping(BIND_CONTRACT)
	// ("添加/编辑合同")
	public ResultBean<Object> bindContract(@RequestBody AdmissionContractTemplate vo) {
		ResultBean<Object> objectResultBean = aeService.bindContract(vo);
		return objectResultBean;
	}

	@PostMapping(SAVE_COST)
	// ("添加/编辑成本信息")
	public ResultBean<Object> saveCost(@RequestBody AdmissionPrice vo) {
		ResultBean<Object> objectResultBean = aeService.saveCost(vo);
		return objectResultBean;
	}

	@PostMapping(SAVE_PRICE)
	// ("添加/编辑价格信息")
	public ResultBean<Object> savePrice(@RequestBody AdmissionSalePrice vo) {
		return aeService.savePrice(vo);
	}

	@PostMapping(CONTRACT_INFO)
	// ("查看合同信息")
	public ResultBean<Object> contractInfo(@RequestBody Long pid) {
		return aeService.contractInfo(pid);
	}

	@PostMapping(COST_INFO)
	// ("查看成本信息")
	public ResultBean<Object> costInfo(@RequestBody Long pid) {
		return aeService.costInfo(pid);
	}

	@PostMapping(PRICE_INFO)
	// ("查看价格信息")
	public ResultBean<Object> priceInfo(@RequestBody Long id) {
		return aeService.priceInfo(id);
	}
	@PostMapping(PRICE_LIST)
	// ("查看价格列表")
	public ResultBean<Object> priceList(@RequestBody Map<String, Object> map) {
		return aeService.priceList(map);
	}
	@PostMapping(DELETE_PRICE)
	// ("删除价格 ")
	public ResultBean<Object> deletePrice (@RequestBody AdmissionSalePrice asp) {
		return aeService.deletePrice(asp);
	}
}
