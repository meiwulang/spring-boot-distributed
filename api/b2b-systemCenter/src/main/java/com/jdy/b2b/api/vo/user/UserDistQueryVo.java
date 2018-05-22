package com.jdy.b2b.api.vo.user;

import com.jdy.b2b.api.common.BaseVO;

public class UserDistQueryVo extends BaseVO {
    private String searchStr;

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}
