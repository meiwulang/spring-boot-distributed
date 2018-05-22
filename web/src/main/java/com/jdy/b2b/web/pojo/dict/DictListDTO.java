package com.jdy.b2b.web.pojo.dict;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/31 16:27
 */
@ApiModel(description = "字典列表入参")
public class DictListDTO extends BaseVO{
    @ApiModelProperty(value = "分组id")
    private Long dGroupId;

    @ApiModelProperty(value = "分组名称")
    private String groupName;

    public Long getdGroupId() {
        return dGroupId;
    }

    public void setdGroupId(Long dGroupId) {
        this.dGroupId = dGroupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }
}
