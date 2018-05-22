package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.department.DepartmentSaleCountVO;

/**
 * Created by strict on 2017/11/9.
 */
public interface DepartmentSaleService {
    ResultBean querySaleCount(DepartmentSaleCountVO departmentSaleCountVO);
}
