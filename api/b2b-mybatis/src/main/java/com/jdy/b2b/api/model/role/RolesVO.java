package com.jdy.b2b.api.model.role;

import java.util.List;

/**
 * Created by strict on 2017/11/16.
 */
public class RolesVO extends Roles {
    private List<Long> checkedKeys;

    private String key;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public List<Long> getCheckedKeys() {
        return checkedKeys;
    }

    public void setCheckedKeys(List<Long> checkedKeys) {
        this.checkedKeys = checkedKeys;
    }
}
