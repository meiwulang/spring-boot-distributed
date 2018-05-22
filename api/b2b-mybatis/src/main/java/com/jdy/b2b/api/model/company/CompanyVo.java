package com.jdy.b2b.api.model.company;

import com.jdy.b2b.api.model.Company;

import java.util.List;

/**
 * Created by dugq on 2017/8/10.
 */
public class CompanyVo extends Company {
    private String pName;
    private List<String> setList;

    public List<String> getSetList() {
        return setList;
    }

    public void setSetList(List<String> setList) {
        this.setList = setList;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }
}
