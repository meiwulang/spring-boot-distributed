package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.DictionariesGroup;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/14 18:08
 */
public class DictionariesGroupDTO extends DictionariesGroup {
    private String subName;

    public String getSubName() {
        return subName;
    }

    public void setSubName(String subName) {
        this.subName = subName;
    }
}
