package com.jdy.b2b.api.model.module;

import java.io.Serializable;
import java.util.List;

/**
 * Created by dugq on 2018/1/26.
 */
public class Authorization implements Serializable {
    private static final long serialVersionUID = 5703362169485434369L;

    List<ModuleDto> menus;
    List<String> buttonClassNames;

    public List<ModuleDto> getMenus() {
        return menus;
    }

    public void setMenus(List<ModuleDto> menus) {
        this.menus = menus;
    }

    public List<String> getButtonClassNames() {
        return buttonClassNames;
    }

    public void setButtonClassNames(List<String> buttonClassNames) {
        this.buttonClassNames = buttonClassNames;
    }
}
