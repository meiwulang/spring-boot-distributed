package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.dao.designProject.DesignMapper;
import com.jdy.b2b.api.dao.designProject.DesignProductMapper;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.model.designProject.Design;
import com.jdy.b2b.api.model.designProject.DesignProduct;
import com.jdy.b2b.api.model.designProject.SearchProduct;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.service.DesignProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2018/1/17.
 */
@Service
public class DesignProductServiceImpl implements DesignProductService {

    @Autowired
    private DesignProductMapper designProductMapper;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private DesignMapper designMapper;


    @Override
    public int deleteByPrimaryKey(Long id) {
        return designProductMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(DesignProduct record) {
        return designProductMapper.insert(record);
    }

    @Override
    public int insertSelective(DesignProduct record) {
        return designProductMapper.insertSelective(record);
    }

    @Override
    public DesignProduct selectByPrimaryKey(Long id) {
        return designProductMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(DesignProduct record) {
        return designProductMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(DesignProduct record) {
        return designProductMapper.updateByPrimaryKey(record);
    }

    @Override
    @Transactional
    public int save(DesignProduct designProduct) {
        Design design = designMapper.selectByPrimaryKey(designProduct.getDesignId());
        Product product = productMapper.selectByPrimaryKey(designProduct.getProductId());
        if(Objects.isNull(design) || Objects.isNull(product))
            throw new RuntimeException("产品或者定值已经被删除");
        if(Objects.isNull(design.getManagerId()) || design.getdStatus()!=4 ){
            throw new RuntimeException("该订制未确认");
        }
        if(!design.getManagerId().equals(designProduct.getCreateUser())){
            throw new RuntimeException("只有应单人才可以绑定产品");
        }
        DesignProduct oldDesignProduct = designProductMapper.selectByDesignId(designProduct.getDesignId());
        if(!Objects.isNull(oldDesignProduct)){
            if(Objects.equals(oldDesignProduct.getProductId(), designProduct.getProductId())){
                return 1;
            }
            oldDesignProduct.setStatus((byte) 1);
            designProductMapper.updateByPrimaryKeySelective(oldDesignProduct);
        }
        designProduct.setId(null);
        return designProductMapper.insertSelective(designProduct);
    }

    @Override
    public List<Product> selectProductsByNameAndNoInUserCompany(SearchProduct vo) {
        return designProductMapper.selectProductsByNameAndNoInUserCompany(vo);
    }
}
