package com.jdy.b2b.web.pojo.dict;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@ApiModel(description = "字典名词新增DTO")
public class DictInsertDTO extends BaseVO{

    @ApiModelProperty(value = "字典名称")
    @NotNull
    @Length(min = 1, max = 50)
    private String dName;

    @ApiModelProperty(value = "字典分组id")
    @NotNull
    private Long dGroupId;

    @ApiModelProperty(value = "排序")
    @Min(0)
    private Integer dSort;

    @ApiModelProperty(value = "状态 0:有效 1:无效")
    @Range(min = 0,max = 1)
    private Integer dStatus;

    public String getdName() {
        return dName;
    }

    public void setdName(String dName) {
        this.dName = dName;
    }

    public Long getdGroupId() {
        return dGroupId;
    }

    public void setdGroupId(Long dGroupId) {
        this.dGroupId = dGroupId;
    }

    public Integer getdSort() {
        return dSort;
    }

    public void setdSort(Integer dSort) {
        this.dSort = dSort;
    }

    public Integer getdStatus() {
        return dStatus;
    }

    public void setdStatus(Integer dStatus) {
        this.dStatus = dStatus;
    }
}