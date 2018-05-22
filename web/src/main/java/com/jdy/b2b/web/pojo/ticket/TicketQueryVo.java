package com.jdy.b2b.web.pojo.ticket;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * Created by yangcheng on 2017/7/3.
 */
@ApiModel("票价查询vo")
public class TicketQueryVo extends BaseVO {
    @ApiModelProperty(value = "来源菜单 1:集结产品列表  2:产品列表")
    private Integer flag;
    @ApiModelProperty(value = "所属公司id")
    private Long tCompanyId;
    @ApiModelProperty(value = "产品id")
    private Long tProductId;
    @ApiModelProperty(value = "票类型:0:单票,1:套票")
    private Integer tTicketType;
    @Length(max=20,message = "票价名称最长20个字")
    @ApiModelProperty(value = "票价名称",allowableValues = "range[0,20]")
    private String tName;

    @ApiModelProperty(value = "状态 0:有效 1:无效 2:删除")
    @Min(value=0,message = "状态最小为0")
    @Max(value=1,message = "状态最大为1")
    private Integer tStatus;
    @ApiModelProperty(value = "所属城市")
    private String ticketCity;

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public String getTicketCity() {
        return ticketCity;
    }

    public void setTicketCity(String ticketCity) {
        this.ticketCity = ticketCity;
    }


    public Long gettCompanyId() {
        return tCompanyId;
    }

    public void settCompanyId(Long tCompanyId) {
        this.tCompanyId = tCompanyId;
    }

    public Long gettProductId() {
        return tProductId;
    }

    public void settProductId(Long tProductId) {
        this.tProductId = tProductId;
    }

    public Integer gettTicketType() {
        return tTicketType;
    }

    public void settTicketType(Integer tTicketType) {
        this.tTicketType = tTicketType;
    }

    public String gettName() {
        return tName;
    }

    public void settName(String tName) {
        this.tName = tName == null ? null : tName.trim();
    }

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
    }


}
