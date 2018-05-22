package com.jdy.b2b.web.pojo.city;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/11 15:03
 */
@ApiModel(value = "CityPutListVO", description = "城市列表查询DTO")
public class CityPutListVO {
    @ApiModelProperty(value = "是否投放,0-否，1-是")
    private Boolean isopen;

    public Boolean getIsopen() {
        return isopen;
    }

    public void setIsopen(Boolean isopen) {
        this.isopen = isopen;
    }
}
