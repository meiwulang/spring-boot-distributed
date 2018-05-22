package com.jdy.b2b.api.model.role;

import com.jdy.b2b.api.model.module.Authorization;
import com.jdy.b2b.api.model.module.ModuleDto;

import java.util.List;

/**
 * Created by strict on 2017/11/17.
 */
public class RolesDTO extends Roles{
    private String companyName;

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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
