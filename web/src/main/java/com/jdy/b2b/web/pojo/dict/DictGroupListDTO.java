package com.jdy.b2b.web.pojo.dict;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/31 16:27
 */
@ApiModel(description = "字典分组列表入参")
public class DictGroupListDTO extends BaseVO {
    @ApiModelProperty(value = "分组名称")
    private String dgName;

    public String getDgName() {
        return dgName;
    }

    public void setDgName(String dgName) {
        this.dgName = dgName;
    }

}
