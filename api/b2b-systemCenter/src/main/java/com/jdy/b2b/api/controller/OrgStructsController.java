package com.jdy.b2b.api.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.service.CompanyService;
import com.jdy.b2b.api.service.DepartmentService;
import com.jdy.b2b.api.service.UserService;
import com.jdy.b2b.api.vo.struct.ChangeCompanyVO;
import com.jdy.b2b.api.vo.struct.ChangeDepartmentVO;
import com.jdy.b2b.api.vo.struct.ChangeOrgNameVO;
import com.jdy.b2b.api.vo.struct.CreateCompanyVO;
import com.jdy.b2b.api.vo.struct.CreateDepartmentVO;
import com.jdy.b2b.api.vo.struct.QueryManagerVO;
import com.jdy.b2b.api.vo.struct.SetManagerVO;

/**
 * @Description 组织架构
 * @author 王斌
 * @date 2017年11月15日 下午1:55:30
 * @version V1.0
 */
@RestController
public class OrgStructsController {
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	@Autowired
	private UserService userservice;
	@Autowired
	private DepartmentService departmentService;
	@Autowired
	private CompanyService companyService;

	@PostMapping("struct/setmanager")
	public ResultBean<Object> setManagerForDepartment(
			@RequestBody SetManagerVO vo) {
		if (Integer.valueOf(0).equals(vo.getType())) {
			return companyService.setManagerForCompany(vo);
		} else {
			return userservice.setManagerForDepartment(vo);
		}
	}
	@PostMapping("struct/setLeader")
	public ResultBean setLeader(
			@RequestBody Department vo) {
		departmentService.setLeader(vo);
		return ResultBean.getSuccessResult();
	}

	@GetMapping("struct/leader/{id}")
	public ResultBean leader(@PathVariable Long id){
		List<User> users = userservice.leader(id);
		return ResultBean.getSuccessResult(users);
	}

	@PostMapping("struct/managers")
	public ResultBean<Object> managers(@RequestBody QueryManagerVO vo) {

		return userservice.managers(vo);
	}

	@PostMapping("struct/changedepartment")
	public ResultBean<Object> changeDepartment(
			@Validated @RequestBody ChangeDepartmentVO vo) {
		logger.error("changeDepartment入參：\n"+vo);
		return departmentService.changeDepartment(vo);
	}

	@PostMapping("struct/changeCompany")
	public ResultBean<Object> changeCompany(
			@RequestBody @Validated ChangeCompanyVO vo) {
		return companyService.changeCompany(vo);

	}

	@PostMapping("struct/changeorgname")
	public ResultBean<Object> changeOrgName(
			@RequestBody @Validated ChangeOrgNameVO vo) {
		return companyService.changeOrgName(vo);
	}

	@PostMapping("struct/createcompany")
	@Async
	public ResultBean<Object> createCompany(@RequestBody CreateCompanyVO vo) {
		return companyService.createCompany(vo);
	}

	@PostMapping("struct/createdepartment")
	public ResultBean<Object> createDepartment(
			@RequestBody @Validated CreateDepartmentVO vo) {
		return departmentService.createDepartment(vo);

	}

	// @PostMapping("struct/list")
	// public ResultBean<Object> list() {
	// return companyService.list();
	// }

	@GetMapping("struct/delete/{orgId}/{type}/{operatorId}")
	public ResultBean<Object> delete(@PathVariable("orgId") Long orgId,
			@PathVariable("type") Integer type,
			@PathVariable("operatorId") Long operatorId) {
		return companyService.delete(orgId, type, operatorId);

	}
}
