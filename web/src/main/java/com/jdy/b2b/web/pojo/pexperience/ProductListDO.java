package com.jdy.b2b.web.pojo.pexperience;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/12 20:45
 */
@ApiModel
public class ProductListDO extends BaseVO {
    @ApiModelProperty(value = "岗位：1-销售总，2-销售总监，3-销售经理，4签约代理人，5非销售岗")
    @NotNull
    @Range(min = 1, max = 5)
    private Integer posId;

    @ApiModelProperty(value = "输入线路编号、线路名称、产品经理搜索")
    private String str;

    @ApiModelProperty(value = "系统级用户可以筛选分公司")
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
