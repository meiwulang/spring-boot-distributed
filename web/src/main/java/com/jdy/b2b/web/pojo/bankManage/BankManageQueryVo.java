package com.jdy.b2b.web.pojo.bankManage;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by yangcheng on 2017/8/31.
 */
@ApiModel
public class BankManageQueryVo extends BaseVO {
    @ApiModelProperty(value="模糊查询字符串")
    private String searchStr;

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}
