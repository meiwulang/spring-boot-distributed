package com.jdy.b2b.api.controller.synchronizeDistributionSystemMessage;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.jdy.b2b.api.dao.PositionMapper;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.position.PositionVO;
import com.jdy.b2b.api.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.service.DepartmentService;
import com.jdy.b2b.api.service.synchronizeDistributionSystemMessage.SynchronizeCompanyService;
import com.jdy.b2b.api.service.synchronizeDistributionSystemMessage.SynchronizeDepartmentService;
import com.jdy.b2b.api.service.synchronizeDistributionSystemMessage.SynchronizePositionService;

/**
 * Created by dugq on 2018/3/24.
 */
@RequestMapping("synchronizeDept")
@RestController
public class SynchronizeDeptController extends BaseController {
	@Autowired
	private SynchronizeCompanyService synchronizeCompanyService;
	@Autowired
	private SynchronizeDepartmentService synchronizeDepartmentService;
	@Autowired
	private SynchronizePositionService synchronizePositionService;
	@Autowired
	private DepartmentService departmentService;
	@Autowired
	private PositionMapper positionMapper;
	@Autowired
	private CompanyService companyService;


	@RequestMapping("synchronizeCompanyList")
	public ResultBean synchronizeCompanyList() {
		int i = synchronizeCompanyService.synchronizeCompanyList();
		return ResultBean.getSuccessResult(i);
	}

	@RequestMapping("synchronizeDepartmentList/{companyId}")
	public ResultBean synchronizeDepartmentList(
			@PathVariable("companyId") Long companyId) {
		int departments = synchronizeDepartmentService
				.synchronizeDepartmentList(companyId);
		return ResultBean.getSuccessResult(departments);
	}

	@RequestMapping("synchronizeDeptById/{deptId}")
	public ResultBean synchronizeDeptById(@PathVariable("deptId") Long deptId) {
		int dept = synchronizeCompanyService.synchronizeCompanyById(deptId);
		return ResultBean.getSuccessResult(dept);
	}

	@Scheduled(initialDelay = 1000 * 8, fixedDelay = 1000 * 60 * 30)
	public void synchronizeAll() {
		logger.error("============开始同步==============");
		synchronizeCompanyService.synchronizeCompanyList();
		synchronizeDepartmentService.synchronizeDepartmentList(null);
		List<Department> departments = departmentService
				.selectDepartmentAll(new Department());
		List<PositionVO> positionVOS = positionMapper.selectByCompanyId(null, null);
		Map<String, List<PositionVO>> collect = positionVOS.stream().collect(Collectors.groupingBy(positionVO -> positionVO.getPositionName()));
		if (!CollectionUtils.isEmpty(departments)) {
			departments.forEach(department -> synchronizePositionService
					.synchronizePositionList(department.getId(),collect));
		}
		List<Company> companies = companyService.selectCompanyAll(new Company());
		if (!CollectionUtils.isEmpty(companies)) {
			companies.forEach(company -> synchronizePositionService
					.synchronizePositionList(company.getId(),collect));
		}
	}

}
