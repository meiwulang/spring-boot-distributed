package com.jdy.b2b.api.vo.module;

import com.jdy.b2b.api.model.module.Module;

import java.util.List;

/**
 * Created by yangcheng on 2017/11/17.
 */
public class ModuleInfoDO {
    private Module module;
    private List<Module> list;

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public List<Module> getList() {
        return list;
    }

    public void setList(List<Module> list) {
        this.list = list;
    }
}
