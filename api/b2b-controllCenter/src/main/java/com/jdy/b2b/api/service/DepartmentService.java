package com.jdy.b2b.api.service;

import java.util.List;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Department;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Created by dugq on 2017/7/17.
 */
public interface DepartmentService {
    int deleteByPrimaryKey(Long id);

    int insert(Department record);

    ResultBean insertSelective(Department record);

    Department selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Department record);

    int updateByPrimaryKey(Department record);

    List<Department> selectByCompanyId(Long companyId, String fastSearchStr,Integer departmentLevel, Integer pageIndex);

    Department selectByIdAndName(String name, Long id,Long companyId, Long departmentPid);

    Department selectByIdAndNo(String no, Long id,Long companyId, Long departmentPid);

    ResultBean logicallyDeleteDepartmentById(Long departmentId);

    List<Department> queryChildDepartmentByPid(Long companyId, Long departmentPid, Integer status, String fastSearchStr, Integer pageIndex, Integer pageSize);

    List<Department> queryAllParentDepartment(Long companyId, Long departmentId, Integer status);
    List<Department> selectDepartmentAll(Department department);
}
