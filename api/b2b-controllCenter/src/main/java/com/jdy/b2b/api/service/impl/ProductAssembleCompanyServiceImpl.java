package com.jdy.b2b.api.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.product.ProductAssembleCompanyMapper;
import com.jdy.b2b.api.model.product.ProductAssembleCompany;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2018/2/7.
 */
@Service
public class ProductAssembleCompanyServiceImpl implements com.jdy.b2b.api.service.ProductAssembleCompanyService {
    @Autowired
    private ProductAssembleCompanyMapper productAssembleCompanyMapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return productAssembleCompanyMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(ProductAssembleCompany record) {
        return productAssembleCompanyMapper.insert(record);
    }

    @Override
    public int insertSelective(ProductAssembleCompany record) {
        return productAssembleCompanyMapper.insertSelective(record);
    }

    @Override
    public ProductAssembleCompany selectByPrimaryKey(Long id) {
        return productAssembleCompanyMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(ProductAssembleCompany record) {
        return productAssembleCompanyMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(ProductAssembleCompany record) {
        return productAssembleCompanyMapper.updateByPrimaryKey(record);
    }

    @Override
    public int batchInsert(Long productId, List<Long> companyIds) {
        List<Long> oldIds = selectCompanyIdsByProductId(productId);
        companyIds.stream().filter(id -> !oldIds.contains(id)).forEach(companyId-> insertSelective(new ProductAssembleCompany(productId,companyId)));
        return companyIds.size();
    }

    @Override
    public List<Long> selectCompanyIdsByProductId(Long productId) {
        return productAssembleCompanyMapper.selectCompanyIdsByProductId(productId);
    }

    @Override
    public int deleteByProductId(Long id, List<Long> assembleCompanyIds) {
        return productAssembleCompanyMapper.deleteByProductId(id,assembleCompanyIds);
    }

    @Override
    public ResultBean updateLinkByProductAndCompany(ProductAssembleCompany vo) {
        int r = productAssembleCompanyMapper.updateLinkByProductAndCompany(vo);
        if (r > 0){
            return ResultBean.getSuccessResult();
        }
        return ResultBean.getErrorResult("更新集结产品联系人失败。参数-->"+ JSONObject.toJSONString(vo));
    }
}
