package com.jdy.b2b.api.model.userrole;

import com.jdy.b2b.api.common.BaseVO;

import java.util.List;

/**
 * Created by zhangfofa on 2017/11/15.
 */
public class UserForUserRolePrivilegeDTO extends BaseVO {

    private Long companyId;

    private Long departmentId;

    private List<Integer> statusList;

    //是否分配权限 0：否；1：是
    private Integer type;

    private String fastSearchStr;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public List<Integer> getStatusList() {
        return statusList;
    }

    public void setStatusList(List<Integer> statusList) {
        this.statusList = statusList;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getFastSearchStr() {
        return fastSearchStr;
    }

    public void setFastSearchStr(String fastSearchStr) {
        this.fastSearchStr = fastSearchStr;
    }
}
