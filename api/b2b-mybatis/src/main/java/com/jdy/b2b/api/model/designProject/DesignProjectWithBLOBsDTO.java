package com.jdy.b2b.api.model.designProject;

/**
 * Created by strict on 2017/12/26.
 */
public class DesignProjectWithBLOBsDTO extends DesignProjectWithBLOBs {
    private String manageName;
    private String managePhone;

    public String getManageName() {
        return manageName;
    }

    public void setManageName(String manageName) {
        this.manageName = manageName;
    }

    public String getManagePhone() {
        return managePhone;
    }

    public void setManagePhone(String managePhone) {
        this.managePhone = managePhone;
    }
}
