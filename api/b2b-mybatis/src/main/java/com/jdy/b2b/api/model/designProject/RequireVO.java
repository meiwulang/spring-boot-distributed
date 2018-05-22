package com.jdy.b2b.api.model.designProject;

import com.jdy.b2b.api.common.BaseVO;

/**
 * Created by strict on 2017/12/19.
 */
public class RequireVO extends BaseVO {
    private Integer clientType ; //访问客户端类型 0手机 1web
    private Integer status ;// 需求状态 1待受理 2定制中 3已反馈 4已确认
    private Integer type;// 出游类型 0个人 1企业
    private String searchKey; // 检索 客户姓名或者手机号

    private Long requireId;
    private Boolean edit;

    private Long companyId;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Boolean getEdit() {
        return edit;
    }

    public void setEdit(Boolean edit) {
        this.edit = edit;
    }

    public Long getRequireId() {
        return requireId;
    }

    public void setRequireId(Long requireId) {
        this.requireId = requireId;
    }

    public Integer getClientType() {
        return clientType;
    }

    public void setClientType(Integer clientType) {
        this.clientType = clientType;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }
}
