package com.jdy.b2b.web.pojo.dict;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/31 17:07
 */
@ApiModel(description = "字典分组插入DTO")
public class DictGroupInsertDTO extends BaseVO {

    @ApiModelProperty(value = "分组名称")
    @NotNull
    @Length(min = 1, max = 50)
    private String dgName;

    @ApiModelProperty(value = "级别等级0:非系统级 1:系统级")
    @NotNull
    @Range(min = 0, max = 1)
    private Integer dgLevel;

    @ApiModelProperty(value = "排序")
    @Min(0)
    private Integer dgSort;

    @ApiModelProperty(value = "状态 0:有效 1:无效")
    @Range(min = 0,max = 1)
    private Integer dgStatus;

    public String getDgName() {
        return dgName;
    }

    public void setDgName(String dgName) {
        this.dgName = dgName;
    }

    public Integer getDgLevel() {
        return dgLevel;
    }

    public void setDgLevel(Integer dgLevel) {
        this.dgLevel = dgLevel;
    }

    public Integer getDgSort() {
        return dgSort;
    }

    public void setDgSort(Integer dgSort) {
        this.dgSort = dgSort;
    }

    public Integer getDgStatus() {
        return dgStatus;
    }

    public void setDgStatus(Integer dgStatus) {
        this.dgStatus = dgStatus;
    }
}
