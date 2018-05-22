package com.jdy.b2b.api.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.CompanyMapper;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.model.company.CompanyVo;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.service.CompanyService;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import com.jdy.b2b.api.vo.struct.ChangeCompanyVO;
import com.jdy.b2b.api.vo.struct.ChangeOrgNameVO;
import com.jdy.b2b.api.vo.struct.CreateCompanyVO;
import com.jdy.b2b.api.vo.struct.SetManagerVO;

@Service
public class CompanyServiceImpl implements CompanyService {
	@Autowired
	private CompanyMapper companyMapper;
	@Autowired
	private DepartmentMapper departmentMapper;
	@Autowired
	private UserMapper userMapper;
	@Autowired
	private TaskExecutor taskExecutor;
	@Autowired
	private MQAssembleService mqAssembleService;

	@SuppressWarnings("unchecked")
	@Override
	public ResultBean<Object> changeCompany(ChangeCompanyVO vo) {
		Company company = new Company();
		company.setcPid(vo.getpId());
		company.setId(vo.getCompanyId());
		company.setUpdateTime(new Date());
		company.setUpdateUser(vo.getUserId());
		if (companyMapper.updateByPrimaryKeySelective(company) < 1) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE, "操作失败");
		} else {
//			taskExecutor.execute(() ->mqAssembleService.getMQClinet().syncCompanys(MQTransformationUtils.transComapny(companyMapper.selectByPrimaryKey(company.getId()))));
			return ResultBean.getSuccessResult();
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public ResultBean<Object> createCompany(CreateCompanyVO vo) {
		String companName = vo.getCompanyName();
		Long parentCompanyId = vo.getParentCompanyId();
		// CompanyVo existCompany = companyMapper.selectByNameAndPid(companName,
		// parentCompanyId);
		CompanyVo existCompany = companyMapper.selectByName(companName);
		if (existCompany != null) {
			return ResultBean.getErrorResult("该公司已存在");
		}
		Company company = new Company();
		company.setcName(companName);
		company.setcPid(parentCompanyId);
		company.setCreateTime(new Date());
		company.setCreateUser(vo.getUserId());
		company.initForClearNull();
		company.setcStatus(1);
		companyMapper.insert(company);
		companyMapper.updatePids();
//		taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncCompanys(MQTransformationUtils.transComapny(companyMapper.selectByPrimaryKey(company.getId()))));
		return ResultBean.getSuccessResult();
	}

	@Override
	public ResultBean<Object> changeOrgName(ChangeOrgNameVO vo) {
		if (Integer.valueOf(0).equals(vo.getType())) {

			return changeCompanyName(vo);
		} else {
			return changeDepartName(vo);
		}
	}

	@SuppressWarnings("unchecked")
	private ResultBean<Object> changeCompanyName(ChangeOrgNameVO vo) {
		CompanyVo existCompany = companyMapper.selectByName(vo.getName());
		if (existCompany != null && vo.getName().equals(existCompany.getcName())
				&& !vo.getId().equals(existCompany.getId())) {
			return ResultBean.getErrorResult("该公司已存在");
		}
		Company company = new Company();
		company.setId(vo.getId());
		company.setcName(vo.getName());
		company.setUpdateTime(new Date());
		company.setUpdateUser(vo.getUserId());
		if (companyMapper.updateByPrimaryKeySelective(company) < 1) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE, "操作失败");
		} else {
//			taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncCompanys(MQTransformationUtils.transComapny(companyMapper.selectByPrimaryKey(company.getId()))));
			return ResultBean.getSuccessResult();
		}
	};

	@SuppressWarnings("unchecked")
	private ResultBean<Object> changeDepartName(ChangeOrgNameVO vo) {
		String name = vo.getName();
		Department existDepart = departmentMapper.selectByNameAndCompanyId(name,
				vo.getCompanyId());
		if (existDepart != null && name.equals(existDepart.getdName())
				&& !vo.getId().equals(existDepart.getId())) {
			return ResultBean.getErrorResult("该部门已存在");
		}
		Department department = new Department();
		department.setdType(vo.getdType());
		department.setId(vo.getId());
		department.setdName(name);
		department.setUpdateTime(new Date());
		department.setUpdateUser(vo.getUserId());
		if (departmentMapper.updateByPrimaryKeySelective(department) < 1) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE, "操作失败");
		} else {
//			taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncDepartments(MQTransformationUtils.transDepartment(departmentMapper.selectByPrimaryKey(department.getId()))));
			return ResultBean.getSuccessResult();
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public ResultBean<Object> delete(Long orgId, Integer type,
			Long operatorId) {
		if (Integer.valueOf(1).equals(type)) {
			if (getUserCountByDepartmentId(orgId) > 0) {
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
						"该部门/子公司下有用户，不可撤销！");
			}
			Department record = new Department();
			record.setId(orgId);
			record.setdStatus(1);
			record.setUpdateUser(operatorId);
			record.setUpdateTime(new Date());
			departmentMapper.updateByPrimaryKeySelective(record);
//			taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncDepartments(MQTransformationUtils.transDepartment(departmentMapper.selectByPrimaryKey(record.getId()))));
		} else {
			if (getUserCountByCompanyId(orgId) > 0) {
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
						"该部门/子公司下有用户，不可撤销！");
			}
			Company record = new Company();
			record.setId(orgId);
			record.setcStatus(0);
			record.setUpdateUser(operatorId);
			record.setUpdateTime(new Date());
			companyMapper.updateByPrimaryKeySelective(record);
//			taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncCompanys(MQTransformationUtils.transComapny(companyMapper.selectByPrimaryKey(record.getId()))));
		}
		return ResultBean.getSuccessResult();
	}

	private int getUserCountByDepartmentId(Long departmentId) {
		List<Long> departmentIds = new ArrayList<>();
		List<Long> allIds = new ArrayList<>();
		departmentIds.add(departmentId);
		allIds.add(departmentId);
		while (true) {
			List<Long> childDepartmentIds = departmentMapper
					.queryChildDepartmentIdsByDepartmentIds(departmentIds);
			if (childDepartmentIds != null && childDepartmentIds.size() > 0) {
				departmentIds = childDepartmentIds;
				allIds.addAll(childDepartmentIds);
				continue;
			}
			return userMapper.getUserCountByDepartmentIds(allIds);
		}

	}

	private int getUserCountByCompanyId(Long companyId) {
		return userMapper.getUserCountByCompanyId(companyId);
	}

	@Override
	public ResultBean<Object> list() {
		return null;
	}

	@SuppressWarnings("unchecked")
	@Override
	public ResultBean<Object> setManagerForCompany(SetManagerVO vo) {
		// 查询用户信息
		// TODO
		User user = userMapper.queryForUserByIdSingle(vo.getManagerId());
		if (user == null || !Integer.valueOf(0).equals(user.getuStatus())
				|| (!Integer.valueOf(3).equals(user.getuDtype())
						&& !Integer.valueOf(1).equals(user.getuDtype())
						&& !Integer.valueOf(5).equals(user.getuDtype())
						&& !Integer.valueOf(4).equals(user.getuDtype()))) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE, "无效用户");
		}
		Company company = new Company();
		company.setId(vo.getOrgId());
		company.setcChargeName(user.getuRealName());
		company.setcTel(user.getuTel());
		company.setUpdateTime(new Date());
		company.setUpdateUser(vo.getUpdateUser());
		if (companyMapper.updateByPrimaryKeySelective(company) < 1) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE, "操作失败");
		} else {
//			taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncCompanys(MQTransformationUtils.transComapny(companyMapper.selectByPrimaryKey(company.getId()))));
			return ResultBean.getSuccessResult();
		}
	};
}
