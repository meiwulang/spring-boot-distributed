package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.News;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/14 11:54
 */
public class NewsDTO extends News {
    /**
     * 搜索词
     */
    private String searchKey;

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }
}
