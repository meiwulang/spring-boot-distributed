package com.jdy.b2b.web.pojo.city;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/11 15:11
 */
@ApiModel(description = "省市县查询DTO")
public class CitySelectVO {
    @ApiModelProperty(value = "快速搜索字符串")
    private String searchStr;

    @ApiModelProperty(value = "国际域名缩写，默认CN")
    private String type;

    @ApiModelProperty(value = "父级省市")
    private Integer pid;

    @ApiModelProperty(value = "大区名：华东华北华南")
    private String groupId;

    @ApiModelProperty(value = "城市等级：1省，2市，3区/县")
    @Range(min = 1, max = 3)
    @NotNull
    private Integer level;

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getPid() {
        return pid;
    }

    public void setPid(Integer pid) {
        this.pid = pid;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }
}
