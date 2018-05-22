package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.CompanySetting;
import com.jdy.b2b.api.service.CompanyService;
import com.jdy.b2b.api.service.CompanySettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Objects;

/**
 * Created by dugq on 2017/7/14.
 */
@Controller
@RequestMapping("companySetting")
public class CompanySettingController {
    @Autowired
    private CompanySettingService companySettingService;
    @Autowired
    private CompanyService companyService;

    @RequestMapping("selectCompanySetting")
    @ResponseBody
    public ResultBean selectCompanySetting(Long companyId){
        Company company = companyService.selectByPrimaryKey(companyId);
        if(Objects.isNull(company)){
            return new ResultBean("-1","单位不存在");
        }
        CompanySetting companySetting = companySettingService.selectByCompanyId(companyId);
        if(Objects.isNull(companySetting)){
            return new ResultBean("-2","没有创建单位设置");
        }
        return ResultBean.getSuccessResult(companySetting);
    }

    @ResponseBody
    @RequestMapping("saveByCompanyId")
    public ResultBean updateByCompanyId(@RequestBody CompanySetting companySetting){
        return companySettingService.saveByCompanyId(companySetting);
    }
}
