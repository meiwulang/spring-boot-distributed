package com.jdy.b2b.web.pojo.pexperience;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/12 20:04
 */
@ApiModel
public class PosAndNumDTO extends BaseVO{

    @ApiModelProperty(value = "岗位：1-销售总，2-销售总监，3-销售经理，4签约代理人，5非销售岗")
    private Integer posId;

    @ApiModelProperty(value = "岗位名称")
    private String posName;

    @ApiModelProperty(value = "数量")
    private Integer num;

    public Integer getPosId() {
        return posId;
    }

    public void setPosId(Integer posId) {
        this.posId = posId;
    }

    public String getPosName() {
        return posName;
    }

    public void setPosName(String posName) {
        this.posName = posName;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }
}
