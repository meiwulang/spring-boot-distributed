package com.jdy.b2b.web.pojo.userrole;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by yangcheng on 2017/7/4.
 */
@ApiModel
public class UserRoleQueryVo extends BaseVO{

    @ApiModelProperty(value = "公司id")
    private Long urCompanyId;
    @ApiModelProperty(value = "角色名称")
    private String urRoleName;
    @ApiModelProperty(value = "角色编号")
    private String urRoleNo;
    @ApiModelProperty(value = "状态 0:有效 1:无效")
    private Integer urStatus;

    public Long getUrCompanyId() {
        return urCompanyId;
    }

    public void setUrCompanyId(Long urCompanyId) {
        this.urCompanyId = urCompanyId;
    }

    public String getUrRoleName() {
        return urRoleName;
    }

    public void setUrRoleName(String urRoleName) {
        this.urRoleName = urRoleName;
    }

    public String getUrRoleNo() {
        return urRoleNo;
    }

    public void setUrRoleNo(String urRoleNo) {
        this.urRoleNo = urRoleNo;
    }

    public Integer getUrStatus() {
        return urStatus;
    }

    public void setUrStatus(Integer urStatus) {
        this.urStatus = urStatus;
    }
}
