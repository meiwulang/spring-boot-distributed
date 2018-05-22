package com.jdy.b2b.web.pojo.dict;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@ApiModel(description = "字典名词更新DTO")
public class DictUpdateDTO extends BaseVO{

    @ApiModelProperty(value = "主键ID")
    @NotNull
    private Long id;

    @ApiModelProperty(value = "字典名称")
    private String dName;

    @ApiModelProperty(value = "排序")
    @Min(0)
    private Integer dSort;

    @ApiModelProperty(value = "状态 0:有效 1:无效")
    @Range(min = 0, max = 1)
    private Integer dStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getdName() {
        return dName;
    }

    public void setdName(String dName) {
        this.dName = dName;
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