package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.model.department.DepartmentSaleCountVO;
import com.jdy.b2b.api.service.DepartmentSaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by strict on 2017/11/9.
 */
@RestController
@RequestMapping("departmentSale/m")
public class DepartmentSaleController {

    @Autowired
    private DepartmentSaleService departmentSaleService;

    @PostMapping("/querySaleCount")
    public ResultBean querySaleCount(@RequestBody DepartmentSaleCountVO departmentSaleCountVO){

        return departmentSaleService.querySaleCount(departmentSaleCountVO);
    }
}
