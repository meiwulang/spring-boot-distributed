package com.jdy.b2b.web.controll.bill;

import com.jdy.b2b.web.pojo.bill.*;
import com.jdy.b2b.web.service.CreditBillService;
import com.jdy.b2b.web.service.OnlineBillService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;

/**
 * Created by strict on 2017/9/19.
 */
@Api(value = "bill", description = "账单管理")
@RestController
@RequestMapping("bill")
public class BillController extends BaseController {

	@Autowired
	private CreditBillService creditBillService;
	@Autowired
	private OnlineBillService onlineBillService;

	@ApiOperation(value = "查询在线账单列表",httpMethod = "POST")
	@ApiResponses({
			@ApiResponse(code = 200, message = "分页查询时统计信息", response = BillTotalInfoDTO.class),
			@ApiResponse(code = 201, message = "在线账单列表", response = OnlineBillParentDTO.class) })
	@PostMapping("queryOnlinePage")
	public ResultBean queryOnlineBillList(
			@Validated @RequestBody OnlineBillVo onlineBillVo) {

		return onlineBillService.queryOnlineBillList(onlineBillVo);
	}

	@ApiOperation(value = "查询信用账单列表",httpMethod = "POST")
	@ApiResponses({
			@ApiResponse(code = 200, message = "信用账单信息", response = CreditBillDTO.class)})
	@PostMapping("queryCreditPage")
	public ResultBean quereyCreditBillList(
			@Validated @RequestBody CreditBillVo creditBillVo) {

		return creditBillService.queryCreditBillList(creditBillVo);
	}

	@ApiOperation(value = "查询在线账单详情", httpMethod = "GET")
	@RequestMapping("queryOnlineBill/{id}")
	public ResultBean queryOnlineBill(@NotNull @PathVariable Long id) {

		return onlineBillService.queryOnlineBill(id);
	}

	@ApiOperation(value = "查询分销商欠款列表",httpMethod = "POST")
	@ApiResponses({
			@ApiResponse(code = 200, message = "信用账单信息", response = CompanyOweCreditDTO.class)})
	@PostMapping("queryOweList")
	public ResultBean queryOweList(@Validated @RequestBody CreditBillVo creditBillVo){
		return creditBillService.queryOweList(creditBillVo);
	}

}
