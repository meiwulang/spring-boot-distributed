package com.jdy.b2b.api.model.pexperience;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/12 20:45
 */
public class ProductListDO extends BaseVO {
    private Integer posId;

    private String str;

    private Long companyId;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Integer getPosId() {
        return posId;
    }

    public void setPosId(Integer posId) {
        this.posId = posId;
    }

    public String getStr() {
        return str;
    }

    public void setStr(String str) {
        this.str = str;
    }
}
