package com.jdy.b2b.api.model.designProject;

import com.jdy.b2b.api.common.BaseVO;

/**
 * Created by strict on 2017/12/26.
 */
public class DesignProjectVO extends BaseVO {
    private Long projectId;
    private Boolean edit;

    public Boolean getEdit() {
        return edit;
    }

    public void setEdit(Boolean edit) {
        this.edit = edit;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
