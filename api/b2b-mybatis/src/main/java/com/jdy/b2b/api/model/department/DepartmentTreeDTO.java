package com.jdy.b2b.api.model.department;

import com.jdy.b2b.api.model.Department;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/11/24 9:50
 */
public class DepartmentTreeDTO extends Department {
    private List<DepartmentTreeDTO> children;

    public List<DepartmentTreeDTO> getChildren() {
        return children;
    }

    public void setChildren(List<DepartmentTreeDTO> children) {
        this.children = children;
    }
}
