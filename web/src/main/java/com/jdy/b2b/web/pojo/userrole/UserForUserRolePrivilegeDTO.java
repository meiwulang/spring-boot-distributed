package com.jdy.b2b.web.pojo.userrole;

import com.jdy.b2b.web.util.BaseVO;

/**
 * Created by zhangfofa on 2017/11/15.
 */
public class UserForUserRolePrivilegeDTO extends BaseVO {

    private Long companyId;

    private Long departmentId;

    private Integer[] statusList;

    //是否分配权限 0：否；1：是
    private Integer type;

    private String fastSearchStr;

    private Integer uDataLimit;//数据级别0:用户级 1:部门级2:单位级3:系统级

    public Integer getuDataLimit() {
        return uDataLimit;
    }

    public void setuDataLimit(Integer uDataLimit) {
        this.uDataLimit = uDataLimit;
    }

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

    public Integer[] getStatusList() {
        return statusList;
    }

    public void setStatusList(Integer[] statusList) {
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
