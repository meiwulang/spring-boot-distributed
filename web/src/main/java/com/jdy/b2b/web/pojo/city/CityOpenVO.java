package com.jdy.b2b.web.pojo.city;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/11 15:08
 */
@ApiModel(description = "投放城市状态修改DTO")
public class CityOpenVO {
    @ApiModelProperty(value = "城市id")
    @NotNull
    private Integer id;

    @ApiModelProperty(value = "是否开放")
    @NotNull
    private Boolean isopen;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getIsopen() {
        return isopen;
    }

    public void setIsopen(Boolean isopen) {
        this.isopen = isopen;
    }
}
