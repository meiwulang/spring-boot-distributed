package com.jdy.b2b.web.controll.ticket;

import java.util.List;
import java.util.Objects;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.pojo.product.ProductCostingQueryDTO;
import com.jdy.b2b.web.pojo.ticket.*;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.jdy.b2b.web.annotation.MyValidator;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.service.TicketService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Created by yangcheng on 2017/7/4.
 */
@Api(value = "ticket", description = "操作票价")
@Controller
@RequestMapping("ticket")
public class TicketController extends BaseController {
	@Autowired
	private TicketService ticketService;

	@PostMapping("copyGatherTickets")
	@ApiOperation(value = "复制票价,始发站,关联关系")
	@ResponseBody
	public ResultBean copyGatherTickets(@RequestBody  CopyGatherTicketsVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl).append("ticket/copyGatherTickets");
		ResultBean body = restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
		return body;
	}



	/**
	 * 根据id获取ticket信息
	 * 
	 * @param id
	 * @return
	 */
	@ApiOperation(value = "根据id查询和票类型查询", notes = "单票和套票关联的表不同,关联多张表")
	@ResponseBody
	@RequestMapping(value = "get/{id}/{single}", method = RequestMethod.GET)
	public ResultBean<Ticket> queryForTicketById(
			@ApiParam(value = "票价id", required = true, name = "id") @PathVariable("id") @NotNull Long id,
			@ApiParam(value = "票类型 0:单,1:套", required = true, name = "single") @PathVariable("single") @NotNull Integer single) {
		return ticketService.queryForTicketById(id, single);
	}

	/**
	 * 分页查询票列表 条件搜索列表
	 * 
	 * @param vo
	 * @return
	 */
	@ApiOperation(value = "班期下的票价列表  分页查询票列表/条件搜索列表", notes = "关联多张表")
	@ResponseBody
	@RequestMapping(value = "list", method = RequestMethod.POST)
	public ResultBean queryForTicketListForPage(
			@RequestBody @Validated TicketQueryVo vo) {
		return ticketService.queryForTicketListForPage(vo);
	}


	/**
	 *	按票价类目查询列表
	 * @param vo
	 * @return
	 */
	@ApiOperation(value = "产品下的票价列表 分页查询票列表/条件搜索列表")
	@ResponseBody
	@RequestMapping(value = "outList", method = RequestMethod.POST)
	public ResultBean queryForOutTicketList(
			@RequestBody @Validated TicketQueryVo vo) {
		return ticketService.queryForOutTicketList(vo);
	}

	/**
	 * 修改 单票/套票 (设为无效 设为默认价格 删除(逻辑删除))
	 * 
	 * @param vo
	 * @return
	 */
	@MyLog
	@ApiOperation(value = "修改 单票/套票", notes = "同时处理多张表,")
	@ResponseBody
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public ResultBean<Long> updateTicket(@RequestBody @Validated({ Save.class,
			Update.class }) TicketSaveOrUpdateVo vo) {
		return ticketService.saveOrUpdateTicket(vo);
	}

	/**
	 * 修改状态
	 * @param vo
	 * @return
	 */
	@MyLog
	@ApiOperation(value = "修改状态 状态 0:有效 1:无效 2:删除 单票/套票", notes = "同时处理多张表,")
	@ResponseBody
	@RequestMapping(value = "status", method = RequestMethod.POST)
	public ResultBean<Long> updateStatus(@RequestBody @Validated(Update.class) TicketDefaultVo vo) {
		if (getUser() != null) {
			vo.setUpdateUser(getUser().getUserId());
		}else{
			return new ResultBean("-1","未获取到用户信息");
		}
		return ticketService.updateTicketOnly(vo);
	}

	/**
	 * 设为默认价格
	 * @param vo
	 * @return
	 */
	@MyLog
	@ApiOperation(value = "设为默认价格")
	@ResponseBody
	@RequestMapping(value = "default", method = RequestMethod.POST)
	public ResultBean<Long> defaultTicket(@RequestBody @Validated(Save.class) TicketDefaultVo vo) {
		if (getUser() != null) {
			vo.setUpdateUser(getUser().getUserId());
		}else{
			return new ResultBean("-1","未获取到用户信息");
		}
		return ticketService.updateTicketOnly(vo);
	}
	/**
	 * 新增票
	 * 
	 * @param vo
	 * @return
	 */
	@MyLog
	@ApiOperation(value = "编辑 单票/套票", notes = "同时处理多张表,")
	@ResponseBody
	@RequestMapping(value = "save", method = RequestMethod.POST)
	public ResultBean<Long> saveTicket(
			@RequestBody @Validated({ Save.class }) TicketSaveOrUpdateVo vo) {
		// 获取userId,所属单位t_org_id存入vo
		return ticketService.saveOrUpdateTicket(vo);
	}

	/**
	 * 批量保存票 (只能批量添加单票 传递单票参数)
	 * @param list
	 * @return
	 */
	@MyLog(SuccessInfo = "批量保存成功")
	@ApiOperation(value = "批量保存单票", notes = "单票类型")
	@ResponseBody
	@RequestMapping(value = "saveBash", method = RequestMethod.POST)
	public ResultBean<Long> saveTicketBash(
			@RequestBody @MyValidator(Save.class)  List<TicketSaveOrUpdateVo> list) {
		// 获取userId,所属单位t_org_id存入vo
		if(list.size()>0){
			for (TicketSaveOrUpdateVo vo : list) {
				if (getUser() != null) {
					vo.setCreateUser(getUser().getUserId());
				}else{
					return new ResultBean("-1","未获取到用户信息");
				}
			}
			return ticketService.saveTicketBash(list);
		}
		return new ResultBean("-1","必须选择单票");
	}
}