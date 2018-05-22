package com.jdy.b2b.api.model.module;

import java.util.ArrayList;
import java.util.List;

public class ModuleTreeDO {
    private Integer id;
    private String label;
    private Boolean isMenu;
    private Integer pId;

    private List<ModuleTreeDO> children= new ArrayList<>();

    public Integer getpId() {
        return pId;
    }

    public void setpId(Integer pId) {
        this.pId = pId;
    }

    public Boolean getMenu() {
        return isMenu;
    }

    public void setMenu(Boolean menu) {
        isMenu = menu;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<ModuleTreeDO> getChildren() {
        return children;
    }

    public void setChildren(List<ModuleTreeDO> children) {
        this.children = children;
    }
}
