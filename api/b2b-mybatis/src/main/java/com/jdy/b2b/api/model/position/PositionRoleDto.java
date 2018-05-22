package com.jdy.b2b.api.model.position;

import com.jdy.b2b.api.common.BaseVO;

import java.io.Serializable;
import java.util.List;

/**
 * Created by dugq on 2018/3/24.
 */
public class PositionRoleDto extends BaseVO implements Serializable{
    private static final long serialVersionUID = 6658043297647497268L;
    Long positionId;
    String positionName;
    List<Long> roleIds;
    Byte dataLimit;

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public Byte getDataLimit() {
        return dataLimit;
    }

    public void setDataLimit(Byte dataLimit) {
        this.dataLimit = dataLimit;
    }

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }

    public List<Long> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(List<Long> roleIds) {
        this.roleIds = roleIds;
    }
}
