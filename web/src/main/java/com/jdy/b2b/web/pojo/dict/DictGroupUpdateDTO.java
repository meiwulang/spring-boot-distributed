package com.jdy.b2b.web.pojo.dict;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/31 17:07
 */
@ApiModel(description = "字典分组更新DTO")
public class DictGroupUpdateDTO extends DictGroupInsertDTO {

    @ApiModelProperty(value = "主键ID")
    @NotNull
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
