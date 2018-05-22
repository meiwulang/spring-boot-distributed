package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.vo.struct.ChangeDepartmentVO;
import com.jdy.b2b.api.vo.struct.CreateDepartmentVO;

public interface DepartmentService {
	ResultBean<Object> changeDepartment(ChangeDepartmentVO vo);

	ResultBean<Object> createDepartment(CreateDepartmentVO vo);

	int setLeader(Department vo);
}