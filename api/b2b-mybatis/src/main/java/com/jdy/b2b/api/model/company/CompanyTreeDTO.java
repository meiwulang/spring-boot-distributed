package com.jdy.b2b.api.model.company;

import com.jdy.b2b.api.model.Company;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/11/23 17:55
 */
public class CompanyTreeDTO extends Company {
    private List<CompanyTreeDTO> children;

    public List<CompanyTreeDTO> getChildren() {
        return children;
    }

    public void setChildren(List<CompanyTreeDTO> children) {
        this.children = children;
    }
}
