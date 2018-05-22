package com.jdy.b2b.api.model.company;

import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.company.*;

import java.io.Serializable;
import java.util.List;

/**
 * Created by dugq on 2017/7/5.
 */
public class CompanyDto extends Company implements Serializable {
    private static final long serialVersionUID = 1459886887772656227L;

    List<Company> children;

    public List<Company> getChildren() {
        return children;
    }

    public void setChildren(List<Company> children) {
        this.children = children;
    }

    public static void main(String[] args) {
        System.out.print(com.jdy.b2b.api.model.company.AuditEnum.valueOf("通过").getValue());
    }
}
