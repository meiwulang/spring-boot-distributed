package com.jdy.b2b.api.model.product;


import com.jdy.b2b.api.common.BaseVO;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2017/8/14.
 */
public class ProductRecommendQueryVo extends BaseVO {
    private String pName;
    private String pPym;
    private Integer pType;
    private Byte pRecommend;
    private Long productCompanyId;
    private List<String> citys = new ArrayList<String>();
    private Integer pStatus;

    public Long getProductCompanyId() {
        return productCompanyId;
    }

    public void setProductCompanyId(Long productCompanyId) {
        this.productCompanyId = productCompanyId;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public String getpPym() {
        return pPym;
    }

    public void setpPym(String pPym) {
        this.pPym = pPym;
    }

    public Integer getpType() {
        return pType;
    }

    public void setpType(Integer pType) {
        this.pType = pType;
    }

    public Byte getpRecommend() {
        return pRecommend;
    }

    public void setpRecommend(Byte pRecommend) {
        this.pRecommend = pRecommend;
    }

    public List<String> getCitys() {
        return citys;
    }

    public void setCitys(List<String> citys) {
        this.citys = citys;
    }

    public Integer getpStatus() {
        return pStatus;
    }

    public void setpStatus(Integer pStatus) {
        this.pStatus = pStatus;
    }
}
