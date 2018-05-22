package com.jdy.b2b.web.pojo.require;

import com.jdy.b2b.web.util.BaseVO;

/**
 * Created by dugq on 2018/1/18.
 */
public class SearchProduct extends BaseVO {
    private String searchParam;

    public String getSearchParam() {
        return searchParam;
    }

    public void setSearchParam(String searchParam) {
        this.searchParam = searchParam;
    }
}
