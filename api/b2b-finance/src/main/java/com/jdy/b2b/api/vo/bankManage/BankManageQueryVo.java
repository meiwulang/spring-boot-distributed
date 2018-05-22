package com.jdy.b2b.api.vo.bankManage;

import com.jdy.b2b.api.common.BaseVO;

/**
 * Created by yangcheng on 2017/8/31.
 */
public class BankManageQueryVo extends BaseVO{

    private String searchStr;

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}
