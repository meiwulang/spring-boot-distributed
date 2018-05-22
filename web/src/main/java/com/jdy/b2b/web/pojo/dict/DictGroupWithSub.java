package com.jdy.b2b.web.pojo.dict;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/31 16:45
 */
@ApiModel(description = "字典分组(带子分类名词)")
public class DictGroupWithSub extends DictGroup {

    @ApiModelProperty(value = "子分类（逗号分隔）")
    private String subName;

    public String getSubName() {
        return subName;
    }

    public void setSubName(String subName) {
        this.subName = subName;
    }
}
