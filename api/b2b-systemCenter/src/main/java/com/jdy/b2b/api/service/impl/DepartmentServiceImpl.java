package com.jdy.b2b.api.service.impl;

import java.util.Date;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.service.DepartmentService;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import com.jdy.b2b.api.vo.struct.ChangeDepartmentVO;
import com.jdy.b2b.api.vo.struct.CreateDepartmentVO;

@Service
@SuppressWarnings("unchecked")
public class DepartmentServiceImpl implements DepartmentService {
	@Autowired
	private DepartmentMapper departmentMapper;
	@Autowired
	private TaskExecutor taskExecutor;
	@Autowired
	MQAssembleService mqAssembleService;
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	@Override
	public ResultBean<Object> changeDepartment(ChangeDepartmentVO vo) {
		logger.error("changeDepartment入參：\n"+vo);
		Department depart = JSONUtil.trans(vo, Department.class);
		depart.setUpdateTime(new Date());
		depart.setUpdateUser(vo.getUserId());
		depart.setdPid(vo.getpId());
		depart.setId(vo.getDepartmentId());
		if (departmentMapper.updateByPrimaryKeySelective(depart) < 1) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE, "操作失败");
		} else {
//			taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncDepartments(MQTransformationUtils.transDepartment(departmentMapper.selectByPrimaryKey(depart.getId()))));
			return ResultBean.getSuccessResult();
		}
	}

	@Override
	public ResultBean<Object> createDepartment(CreateDepartmentVO vo) {
		String departmentName = vo.getDepartmentName();
		Long companyId = vo.getCompanyId();
		Department existDepart = departmentMapper
				.selectByNameAndCompanyId(departmentName, companyId);
		if (existDepart != null) {
			return ResultBean.getErrorResult("该部门已存在");
		}
		Department depart = JSONUtil.trans(vo, Department.class);
		depart.setdName(departmentName);
		depart.setdPid(vo.getParentDepartmentId());
		depart.initForClearNull();
		departmentMapper.insert(depart);
		departmentMapper.updatePids();
//		taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncDepartments(MQTransformationUtils.transDepartment(departmentMapper.selectByPrimaryKey(depart.getId()))));
		return ResultBean.getSuccessResult();
	}

	@Override
	public int setLeader(Department vo) {
		Department department = departmentMapper.selectByPrimaryKey(vo.getId());
		if(Objects.isNull(department)){
			throw new RuntimeException("部门已经被删除");
		}
		department.setLeader(vo.getLeader());
		return departmentMapper.updateByPrimaryKeySelective(department);
	}

}