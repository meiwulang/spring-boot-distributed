package com.jdy.b2b.api.model.userrole;

import java.util.List;

/**
 * Created by zhangfofa on 2017/11/20.
 */
public class UserRolePrivilegeDO {

    private Long userId;

    private Long companyId;

    private String realName;

    private String userNo;

    private String unitName;

    private String departmentName;

    private String dutyName;

    private Integer privilegeLevel;

    private List<UserRoleDO> rolePrivilegeList;

    private String moduleStr;

    private Integer operatorPrivilegeLevel;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getUserNo() {
        return userNo;
    }

    public void setUserNo(String userNo) {
        this.userNo = userNo;
    }

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDutyName() {
        return dutyName;
    }

    public void setDutyName(String dutyName) {
        this.dutyName = dutyName;
    }

    public Integer getPrivilegeLevel() {
        return privilegeLevel;
    }

    public void setPrivilegeLevel(Integer privilegeLevel) {
        this.privilegeLevel = privilegeLevel;
    }

    public List<UserRoleDO> getRolePrivilegeList() {
        return rolePrivilegeList;
    }

    public void setRolePrivilegeList(List<UserRoleDO> rolePrivilegeList) {
        this.rolePrivilegeList = rolePrivilegeList;
    }

    public String getModuleStr() {
        return moduleStr;
    }

    public void setModuleStr(String moduleStr) {
        this.moduleStr = moduleStr;
    }

    public Integer getOperatorPrivilegeLevel() {
        return operatorPrivilegeLevel;
    }

    public void setOperatorPrivilegeLevel(Integer operatorPrivilegeLevel) {
        this.operatorPrivilegeLevel = operatorPrivilegeLevel;
    }
}
