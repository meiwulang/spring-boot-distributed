package com.jdy.b2b.web.pojo.electroniccontract;

import com.jdy.b2b.web.util.BaseVO;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/14 19:53
 */
public class ContractTemplateListDO extends BaseVO{
    private String str;

    private Long companyId;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getStr() {
        return str;
    }

    public void setStr(String str) {
        this.str = str;
    }
}
