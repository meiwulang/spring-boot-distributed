package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.department.DepartmentSaleCountVO;
import com.jdy.b2b.web.pojo.department.DepartmentVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by dugq on 2017/7/12.
 */
public interface DepartmentService {
    ResultBean selectAllDepartmentByCompanyId(Long companyId, String fastSearchStr, Integer departmentLevel, Integer pageIndex);

    ResultBean createDepartmentGroup(DepartmentVo workgroup);

    ResultBean updateDepartment(DepartmentVo workgroup);

    ResultBean deleteDepartment(Long id);

    ResultBean logicallyDeleteDepartment(Long departmentId);

    ResultBean queryDepartmentSaleCount(DepartmentSaleCountVO departmentSaleCountVO);

    ResultBean queryChildDepartmentByPid(Long companyId, Long departmentPid, Integer status, String fastSearchStr, Integer pageIndex, Integer pageSize);

    ResultBean queryAllParentDepartment(Long companyId, Long departmentId, Integer status);

    ResultBean queryDepartmentById(Long id);
    ResultBean syncDepartment(DepartmentVo departmentVo);
}
