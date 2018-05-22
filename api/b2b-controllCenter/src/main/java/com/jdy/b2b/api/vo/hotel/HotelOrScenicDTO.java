package com.jdy.b2b.api.vo.hotel;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2017/9/5.
 */
public class HotelOrScenicDTO {
    private String parent;
    private String name;
    private List children = new ArrayList();

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

    public List getChildren() {
        return children;
    }

    public void setChildren(List children) {
        this.children = children;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
