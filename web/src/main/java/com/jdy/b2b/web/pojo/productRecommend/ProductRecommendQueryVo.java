package com.jdy.b2b.web.pojo.productRecommend;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2017/8/14.
 */
@ApiModel
public class ProductRecommendQueryVo extends BaseVO{
    @ApiModelProperty(value="产品名称")
    private String pName;
    @ApiModelProperty(value="产品所属公司id",hidden = true)
    private Long productCompanyId;
    @ApiModelProperty(value = "拼音码")
    private String pPym;
    @ApiModelProperty(value = "产品类型id")
    private Integer pType;
    @ApiModelProperty(value = "推荐状态 0:不推荐  1:推荐普通 2:推荐精选")
    private Byte pRecommend;
    @ApiModelProperty(value = "适用城市")
    private List<String> citys = new ArrayList<String>();
    @ApiModelProperty(value = "状态 0:有效 1:无效")
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
