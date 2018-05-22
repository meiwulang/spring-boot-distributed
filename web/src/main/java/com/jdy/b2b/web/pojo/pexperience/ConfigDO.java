package com.jdy.b2b.web.pojo.pexperience;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/12 21:03
 */
@ApiModel
public class ConfigDO extends BaseVO {
    @NotNull
    @Range(min = 1, max = 5)
    @ApiModelProperty(value = "岗位：1-销售总，2-销售总监，3-销售经理，4签约代理人，5非销售岗")
    private Integer posId;

    private Long companyId;

    @ApiModelProperty(value = "产品id列表")
    private List<ConfigOneDO> prods;

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
