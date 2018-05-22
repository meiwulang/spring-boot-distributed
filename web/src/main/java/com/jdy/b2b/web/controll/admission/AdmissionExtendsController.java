package com.jdy.b2b.web.controll.admission;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.admission.AdmissionContractTemplate;
import com.jdy.b2b.web.pojo.admission.AdmissionPrice;
import com.jdy.b2b.web.pojo.admission.AdmissionSalePrice;
import com.jdy.b2b.web.pojo.admission.AdmissionSalePriceListVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Save;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

/**
 * @Description 门票拓展信息控制层
 * @author 王斌
 * @date 2018年4月17日 下午1:37:37
 * @version V1.0
 */
@RestController
@Api(description = "门票拓展信息")
@RequestMapping("admission")
@SuppressWarnings("unchecked")
public class AdmissionExtendsController extends BaseController {
	private static final String BIND_CONTRACT = "bind-contract";
	private static final String SAVE_PRICE = "save-price";
	private static final String SAVE_COST = "save-cost";
	private static final String CONTRACT_INFO = "contract-info";
	private static final String PRICE_INFO = "price-info";
	private static final String PRICE_LIST = "price-list";
	private static final String DELETE_PRICE  = "delete-price";
	private static final String COST_INFO = "cost-info";
	private static final String BASE_URL = "admission/";

	@PostMapping(BIND_CONTRACT)
	@ApiOperation("添加/编辑合同")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "绑定合同成功", response = ResultBean.class) })
	public ResultBean<Object> bindContract(@RequestBody @Validated(Save.class) AdmissionContractTemplate vo) {
		return restTemplate
				.postForEntity(new StringBuffer(controllCenterUrl).append(BASE_URL).append(BIND_CONTRACT).toString(),
						vo, ResultBean.class)
				.getBody();
	}

	@PostMapping(SAVE_COST)
	@ApiOperation("添加/编辑成本信息")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "添加/编辑成本信息成功", response = ResultBean.class) })
	public ResultBean<Object> saveCost(@RequestBody @Validated(Save.class) AdmissionPrice vo) {
		if (vo.getLifeEndDate().compareTo(vo.getLifeStartDate()) < 0) {
			return ResultBean.getIndexFailResult("失效时间不能小于有效时间");
		}
		return restTemplate
				.postForEntity(new StringBuffer(controllCenterUrl).append(BASE_URL).append(SAVE_COST).toString(), vo,
						ResultBean.class)
				.getBody();
	}

	@PostMapping(SAVE_PRICE)
	@ApiOperation("添加/编辑价格信息")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "添加/编辑价格信息成功", response = ResultBean.class) })
	public ResultBean<Object> savePrice(@RequestBody @Validated(Save.class) AdmissionSalePrice vo) {
		return restTemplate
				.postForEntity(new StringBuffer(controllCenterUrl).append(BASE_URL).append(SAVE_PRICE).toString(), vo,
						ResultBean.class)
				.getBody();
	}

	@PostMapping(CONTRACT_INFO)
	@ApiOperation("查看合同信息")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "查看合同信息", response = AdmissionContractTemplate.class) })
	public ResultBean<Object> contractInfo(@RequestBody Long pid) {
		return restTemplate
				.postForEntity(new StringBuffer(controllCenterUrl).append(BASE_URL).append(CONTRACT_INFO).toString(),
						pid, ResultBean.class)
				.getBody();
	}

	@PostMapping(COST_INFO)
	@ApiOperation("查看成本信息")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "查看成本信息", response = AdmissionPrice.class) })
	public ResultBean<Object> costInfo(@RequestBody Long pid) {
		return restTemplate
				.postForEntity(new StringBuffer(controllCenterUrl).append(BASE_URL).append(COST_INFO).toString(), pid,
						ResultBean.class)
				.getBody();
	}

	@PostMapping(PRICE_INFO)
	@ApiOperation("查看价格信息")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "查看价格信息", response = AdmissionSalePrice.class) })
	public ResultBean<Object> priceInfo(@RequestBody Long id) {
		return restTemplate
				.postForEntity(new StringBuffer(controllCenterUrl).append(BASE_URL).append(PRICE_INFO).toString(), id,
						ResultBean.class)
				.getBody();
	}
	@PostMapping(PRICE_LIST)
	@ApiOperation("查看价格列表")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "查看价格列表", response = AdmissionSalePrice.class) })
	public ResultBean<Object> priceList(@RequestBody @Validated AdmissionSalePriceListVO vo) {
		vo.calc();
		return restTemplate
				.postForEntity(new StringBuffer(controllCenterUrl).append(BASE_URL).append(PRICE_LIST).toString(), vo,
						ResultBean.class)
				.getBody();
	}
	@PostMapping(DELETE_PRICE)
	@ApiOperation("删除价格 ")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "删除价格 ", response = AdmissionSalePrice.class) })
	public ResultBean<Object> deletePrice(@RequestBody Long id) {
		AdmissionSalePrice vo=new AdmissionSalePrice();
		vo.setId(id);
		vo.setAdStatus(1);
		vo.setUpdateUser(getUser().getUserId());
		return restTemplate
				.postForEntity(new StringBuffer(controllCenterUrl).append(BASE_URL).append(DELETE_PRICE).toString(), vo,
						ResultBean.class)
				.getBody();
	}
}
