package com.jdy.b2b.api.model.designProject;


import com.jdy.b2b.api.common.BaseVO;

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
