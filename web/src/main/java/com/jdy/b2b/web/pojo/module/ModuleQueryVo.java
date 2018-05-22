package com.jdy.b2b.web.pojo.module;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

@ApiModel
public class ModuleQueryVo extends BaseVO {

    @ApiModelProperty(value = "一级菜单id")
    private Integer id;
    @ApiModelProperty(value = "新增模块的类型  0:一级菜单 1:二级菜单 2:三级菜单 3:选项卡 4:按钮 5:链接")
    @Range(min = 0,max = 5,message = "模块类型最小为0,最大为5")
    private Integer mType;

    public Integer getmType() {
        return mType;
    }

    public void setmType(Integer mType) {
        this.mType = mType;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
}