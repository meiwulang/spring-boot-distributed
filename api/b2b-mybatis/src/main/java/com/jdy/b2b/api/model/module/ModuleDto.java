package com.jdy.b2b.api.model.module;

import java.util.List;

/**
 * Created by dugq on 2017/11/20.
 */
public class ModuleDto extends Module{
    private List<Module> children;

    public List<Module> getChildren() {
        return children;
    }

    public void setChildren(List<Module> children) {
        this.children = children;
    }
}
