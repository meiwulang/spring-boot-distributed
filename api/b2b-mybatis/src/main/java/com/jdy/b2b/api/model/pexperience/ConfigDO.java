package com.jdy.b2b.api.model.pexperience;

import com.jdy.b2b.api.common.BaseVO;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/12 21:03
 */
public class ConfigDO extends BaseVO {
    private Integer posId;

    private List<ConfigOneDO> prods;

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

    public List<ConfigOneDO> getProds() {
        return prods;
    }

    public void setProds(List<ConfigOneDO> prods) {
        this.prods = prods;
    }
}
