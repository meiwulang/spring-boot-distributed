package com.jdy.b2b.web.pojo.user;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/6 14:50
 */
@ApiModel
public class UserSuperPositionVO extends BaseVO {
    @ApiModelProperty(value = "上级岗位id")
    @NotNull
    private Long positionId;

    @ApiModelProperty(value = "上级岗位名称")
    @NotNull
    private String positionName;

    @ApiModelProperty(value = "公司id")
    @NotNull
    private Long companyId;

    @ApiModelProperty(value = "部门id")
    private Long departId;

    @ApiModelProperty(value = "当前用户id")
    private Long userId;

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public Long getDepartId() {
        return departId;
    }

    public void setDepartId(Long departId) {
        this.departId = departId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
