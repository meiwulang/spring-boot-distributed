package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.dao.CompanyMapper;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.dao.ProductStatisticsMapper;
import com.jdy.b2b.api.model.productStatistics.ListParam;
import com.jdy.b2b.api.model.productStatistics.Order4Statistics;
import com.jdy.b2b.api.model.productStatistics.ProductOrder;
import com.jdy.b2b.api.service.ProductStatisticsService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2017/11/16.
 */
@Service
public class ProductStatisticsServiceImpl implements ProductStatisticsService {
    @Autowired
    private ProductStatisticsMapper productStatisticsMapper;
    @Autowired
    private DepartmentMapper departmentMapper;
    @Autowired
    private CompanyMapper companyMapper;

    @Override
    public List<ProductOrder> selectProductList(ListParam param) {
        return productStatisticsMapper.selectProductList(param);
    }

    @Override
    public List<Order4Statistics> selectOrderList(ListParam param) {
        param.setAgentId(null);
        if(!Objects.isNull(param.getCompanyId())){
            String ids = companyMapper.selectPidsById(param.getCompanyId());
            if(StringUtils.isBlank(ids)){
                return new ArrayList<>();
            }
            param.setCompanyPids(ids);
        }

        if(!Objects.isNull(param.getDepartmentId())){
            String ids = departmentMapper.selectPidsById(param.getDepartmentId());
            if(StringUtils.isBlank(ids)){
                return new ArrayList<>();
            }
            param.setDepartmentPids(ids);
        }
        return productStatisticsMapper.selectOrderList(param);
    }

    @Override
    public List<Order4Statistics> selectOrderListByDepartment(ListParam param) {
        String ids = departmentMapper.selectPidsById(param.getDepartmentId());
        if(StringUtils.isBlank(ids)){
            return new ArrayList<>();
        }
        param.setDepartmentPids(ids);
        param.setCompanyPids(null);
        param.setAgentId(null);
        return productStatisticsMapper.selectOrderList(param);

    }

    @Override
    public List<Order4Statistics> selectOrderListByCompany(ListParam param) {
        String ids = companyMapper.selectPidsById(param.getCompanyId());
        param.setCompanyPids(ids);
        if(!Objects.isNull(param.getDepartmentId())){
            String ids1 = departmentMapper.selectPidsById(param.getDepartmentId());
            param.setDepartmentPids(ids1);
        }
        param.setDepartmentPids(null);
        param.setAgentId(null);
        return productStatisticsMapper.selectOrderList(param);
    }

    @Override
    public List<Order4Statistics> selectOrderListByAgent(ListParam param) {
        param.setDepartmentPids(null);
        param.setCompanyPids(null);
        return productStatisticsMapper.selectOrderList(param);
    }
}
