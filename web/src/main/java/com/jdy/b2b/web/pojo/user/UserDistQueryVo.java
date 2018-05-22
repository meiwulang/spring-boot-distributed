package com.jdy.b2b.web.pojo.user;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by yangcheng on 2017/11/9.
 */
@ApiModel
public class UserDistQueryVo extends BaseVO {
    @ApiModelProperty(value = "模糊查询真实姓名和手机号")
    private String searchStr;

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}
