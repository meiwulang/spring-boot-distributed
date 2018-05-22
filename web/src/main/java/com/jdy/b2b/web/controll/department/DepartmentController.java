package com.jdy.b2b.web.controll.department;

import com.jdy.b2b.web.pojo.department.DepartmentSaleCountVO;
import com.jdy.b2b.web.pojo.department.DepartmentVo;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.service.DepartmentService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import javax.validation.groups.Default;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;

/**
 * Created by dugq on 2017/7/17.
 */
@Controller
@RequestMapping("department")
@Api(value = "/department", description = "部门模块相关操作")
@SuppressWarnings("rawtypes")
public class DepartmentController extends BaseController {
	@Autowired
	private DepartmentService departmentService;

	@ApiOperation(value = "获取单位的所有部门", notes = "获取单位的所有部门。", httpMethod = "POST")
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "pageIndex", paramType = "query", dataType = "int", value = "分页信息，需要查询的页码。从1开始", required = true),
			@ApiImplicitParam(value = "单位id", required = true, name = "companyId", paramType = "query"),
			@ApiImplicitParam(name = "fastSearchStr", value = "快速查询输入框中的值。 可根据字符串模糊匹配", paramType = "query"),
			@ApiImplicitParam(name = "departmentLevel", value = "查询单位级别", paramType = "query") })
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "数据存于body中。body{pageNum: 当前页,pageSize: 每页总数,size: 当前页数量,total: 总行数,pages: 总页数,list:DepartmentVo的数组}", response = DepartmentVo.class) })
	@RequestMapping(value = "selectAllDepartmentByCompanyId")
	@ResponseBody
	public ResultBean selectAllDepartmentByCompanyId(
			@NotNull(message = "请选择单位") Long companyId, String fastSearchStr,
			Integer departmentLevel, Integer pageIndex) {
		// if (companyId == 0) {
		// // 获取用户信息 start
		// UserResultDTO userInfo = getUser();
		// User user = JSONUtil.trans(userInfo, User.class);
		// // 获取用户信息 end
		// if (Objects.isNull(user) || user.getuCompanyId() == null
		// || user.getuCompanyId() == 0) {
		// return new ResultBean("-1", "请选择单位，或者先登陆再操作。");
		// }
		// user.setId(userInfo.getUserId());
		// companyId = user.getuCompanyId();
		// }
		return departmentService.selectAllDepartmentByCompanyId(companyId,
				fastSearchStr, departmentLevel, pageIndex);
	}

	@ApiOperation(value = "创建部门", notes = "创建部门。", httpMethod = "POST", response = ResultBean.class)
	@RequestMapping(value = "createDepartmentGroup", method = RequestMethod.POST)
	@ResponseBody
	@MyLog
	public ResultBean saveDepartmentGroup(@RequestBody @Validated({ Save.class,
			Default.class }) DepartmentVo departmentVo) {
		departmentVo.setdStatus(0);
		return departmentService.createDepartmentGroup(departmentVo);
	}

	@ApiOperation(value = "跟新部门信息", notes = "跟新部门信息,传了的都需改，不穿的属性不修改", httpMethod = "POST", response = ResultBean.class)
	@RequestMapping(value = "updateDepartment", method = RequestMethod.POST)
	@ResponseBody
	@MyLog
	public ResultBean updateDepartment(@RequestBody @Validated({ Update.class,
			Default.class }) DepartmentVo departmentVo) {
		return departmentService.updateDepartment(departmentVo);
	}

	@ApiOperation(value = "删除部门", notes = "删除部门", httpMethod = "POST", response = ResultBean.class)
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "id", paramType = "query", dataType = "long", value = "部门id", required = true) })
	@RequestMapping(value = "deleteDepartment", method = RequestMethod.POST)
	@ResponseBody
	@MyLog
	public ResultBean deleteDepartment(@NotNull(message = "请选择部门") Long id) {
		return departmentService.deleteDepartment(id);
	}

	@ApiOperation(value = "逻辑删除部门", notes = "逻辑删除部门", httpMethod = "POST", response = ResultBean.class)
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "departmentId", paramType = "query", dataType = "long", value = "部门id", required = true) })
	@RequestMapping(value = "logicallyDeleteDepartment", method = RequestMethod.POST)
	@ResponseBody
	@MyLog
	public ResultBean logicallyDeleteDepartmentByDepartmentId(
			@NotNull(message = "请选择部门") Long departmentId) {
		return departmentService.logicallyDeleteDepartment(departmentId);
	}

	@ApiOperation(value = "获取某个一级部门下所有子部门的销售成员的销售统计信息,包括总计,月统计,日统计,周统计,季统计,年统计", httpMethod = "POST")
	@RequestMapping(value = "/m/queryDepartmentSaleCount", method = RequestMethod.POST)
	@ResponseBody
	public ResultBean queryDepartmentSaleCount(
			@RequestBody DepartmentSaleCountVO departmentSaleCountVO) {
		setPermissions(departmentSaleCountVO);
		/** 当前日期 **/
		LocalDate now = LocalDate.now();
		Integer queryType = departmentSaleCountVO.getQueryType();
		String inputDate = departmentSaleCountVO.getQueryDate();
		switch (queryType) {
		// 0表示总计，1表示月统计，2表示日统计，3表示周统计，4表示季统计，5表示年统计
		case 1:
			LocalDate queryDate = LocalDate.parse(inputDate);
			/** 所给时间所在月的第一天 **/
			LocalDate firstDate = queryDate
					.with(TemporalAdjusters.firstDayOfMonth());
			/** 所给时间所在月的下一个月的第一天 **/
			LocalDate lastDate = queryDate
					.with(TemporalAdjusters.lastDayOfMonth()).plusDays(1);

			if (now.isBefore(firstDate)) {
				return new ResultBean("-1", "当前日期不在查询范围");
			}
			// 只要在查询范围内 就设置最后一天为 查询时间的下一个月的第一天
			departmentSaleCountVO.setEndDate(lastDate.toString());
			departmentSaleCountVO.setStartDate(firstDate.toString());
			break;
		case 2:
			LocalDate queryDate2 = LocalDate.parse(inputDate);
			if (queryDate2.isAfter(now)) {
				return new ResultBean("-1", "不能查询今天之后的日期");
			} else {
				String startTime = departmentSaleCountVO.getStartTime();
				if (StringUtils.isNotBlank(startTime)) {
					LocalDateTime startDateTime = LocalDateTime
							.parse(new StringBuilder().append(inputDate)
									.append("T").append(startTime));
					DateTimeFormatter timeFormat = DateTimeFormatter
							.ofPattern("YYYY-MM-dd HH:mm:ss");
					departmentSaleCountVO
							.setStartDate(startDateTime.format(timeFormat));
					departmentSaleCountVO.setEndDate(
							startDateTime.plusHours(1).format(timeFormat));
				} else {
					departmentSaleCountVO.setStartDate(queryDate2.toString());
					departmentSaleCountVO
							.setEndDate(queryDate2.plusDays(1).toString());
				}

			}

			break;
		case 3:
		case 4:
		case 5:
			LocalDate startDate = LocalDate
					.parse(departmentSaleCountVO.getStartDate());
			if (now.isBefore(startDate)) {
				return ResultBean.getSuccessResult();
			}
			LocalDate endDate = LocalDate
					.parse(departmentSaleCountVO.getEndDate());
			endDate = endDate.plusDays(1);
			departmentSaleCountVO.setEndDate(endDate.toString());
			break;
		default:

			break;
		}

		return departmentService
				.queryDepartmentSaleCount(departmentSaleCountVO);
	}

	@RequestMapping("/queryChildDepartmentByPid")
	@ResponseBody
	public ResultBean queryChildDepartmentByPid(@RequestParam Long companyId,
			@RequestParam Long departmentPid,
			@RequestParam(required = false, defaultValue = "0") Integer status,
			@RequestParam(required = false) String fastSearchStr,
			@RequestParam(required = false, defaultValue = "1") Integer pageIndex,
			@RequestParam(required = false, defaultValue = "15") Integer pageSize) {
		return departmentService.queryChildDepartmentByPid(companyId,
				departmentPid, status, fastSearchStr, pageIndex, pageSize);

	}

	@RequestMapping("/queryAllParentDepartment")
	@ResponseBody
	public ResultBean queryAllParentDepartment(@RequestParam Long companyId,
			@RequestParam Long departmentId,
			@RequestParam(required = false, defaultValue = "0") Integer status) {
		return departmentService.queryAllParentDepartment(companyId,
				departmentId, status);

	}

	@RequestMapping("queryDepartmentById/{id}")
	@ResponseBody
	public ResultBean queryDepartmentById(@PathVariable("id") Long id) {

		return departmentService.queryDepartmentById(id);
	}

	/**
	 * 同步部门信息
	 * @return
	 */
	@RequestMapping(value="syncDepartment",method = RequestMethod.POST)
	@ResponseBody
	public ResultBean syncDepartment(@RequestBody DepartmentVo departmentVo) {
		return departmentService.syncDepartment(departmentVo);
	}

	/**
	 * @Description: 设置权限
	 * @author 王斌
	 * @date 2017年12月12日 下午2:01:30
	 * @param vo
	 */
	private void setPermissions(DepartmentSaleCountVO vo) {
		// 公司
		Subject subject = SecurityUtils.getSubject();
		UserResultDTO userInfo = (UserResultDTO) subject.getPrincipal();
		Long companyId = userInfo.getuCompanyId();
		//boolean isSuperCompany = Long.valueOf(0L).equals(companyId);
		// 总公司的系统级用户 查看全部数据
		//Long voCompanyId = vo.getCompanyId();
		Integer uDataLimit = userInfo.getuDataLimit();

		if (!uDataLimit.equals(Integer.valueOf(3))) {
			vo.setCompanyId(companyId);
		}
		// 部门
		if (uDataLimit < Integer.valueOf(2)) {
			Long departId = userInfo.getuDepartmentId();
			vo.setDepartmentId(departId == null ? -1 : departId);
			vo.setuDepartmentCode(departId == null ? -1 : departId);
		}
		// 人员
		if (uDataLimit == Integer.valueOf(0)) {
			vo.setUserId(userInfo.getUserId());
		}
	}
}
