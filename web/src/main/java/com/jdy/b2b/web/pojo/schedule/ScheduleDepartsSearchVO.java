package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/30 14:08
 */
@ApiModel(description = "班期接送站点查询vo")
public class ScheduleDepartsSearchVO extends BaseVO{

    @NotNull
    @ApiModelProperty(value = "班期id")
    private Long id;
    @ApiModelProperty(value = "站点名字")
    private String name;
    @ApiModelProperty(value = "类型 0:始发站 1:顺路站 2:班车站")
    @Range(min = 0, max = 2)
    private Integer dType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getdType() {
        return dType;
    }

    public void setdType(Integer dType) {
        this.dType = dType;
    }
}
