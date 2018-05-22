package com.jdy.b2b.api.vo.userrole;


import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

/**
 * Created by yangcheng on 2017/7/4.
 */
public class UserRoleQueryVo extends BaseVO {

    private Long urCompanyId;

    private String urRoleName;

    private String urRoleNo;

    private String urRemark;

    private Integer urStatus;

    private Integer urSort;

    private String urRoleContent;

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

    public String getUrRemark() {
        return urRemark;
    }

    public void setUrRemark(String urRemark) {
        this.urRemark = urRemark;
    }

    public Integer getUrStatus() {
        return urStatus;
    }

    public void setUrStatus(Integer urStatus) {
        this.urStatus = urStatus;
    }

    public Integer getUrSort() {
        return urSort;
    }

    public void setUrSort(Integer urSort) {
        this.urSort = urSort;
    }

    public String getUrRoleContent() {
        return urRoleContent;
    }

    public void setUrRoleContent(String urRoleContent) {
        this.urRoleContent = urRoleContent;
    }
}
