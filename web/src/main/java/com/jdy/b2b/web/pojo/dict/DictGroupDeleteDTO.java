package com.jdy.b2b.web.pojo.dict;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/31 17:07
 */
@ApiModel(description = "字典分组删除DTO")
public class DictGroupDeleteDTO extends BaseVO{

    @ApiModelProperty(value = "主键ID")
    @NotNull
    private Long id;

    @ApiModelProperty(value = "状态 0:有效 1:无效")
    private Integer dgStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDgStatus() {
        return dgStatus;
    }

    public void setDgStatus(Integer dgStatus) {
        this.dgStatus = dgStatus;
    }
}
