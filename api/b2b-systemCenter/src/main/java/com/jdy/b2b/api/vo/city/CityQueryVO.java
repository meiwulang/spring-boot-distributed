package com.jdy.b2b.api.vo.city;

import com.jdy.b2b.api.model.City;

/**
 * Created by yangcheng on 2017/12/25.
 */
public class CityQueryVO extends City{
    private String searchStr;

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}
