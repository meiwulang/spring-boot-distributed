package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/19 13:56
 */
@ApiModel(description = "新增订单价格详情dto")
public class OrderAddPriceDetailDTO extends BaseVO {

    @ApiModelProperty(value = "票id")
    private Long opTicketId;

    @ApiModelProperty(value = "价格名称")
    @NotNull
    private String opPriceName;

    @ApiModelProperty(value = "数量")
    @NotNull
    private Integer opNum;

    @ApiModelProperty(value = "房间数量")
    private Integer roomNum;

    @ApiModelProperty(value = "单价")
    @NotNull
    private BigDecimal opPrice;

    @ApiModelProperty(value = "类型 0:票价 1:房差 2:调整 3:活动 4:违约金")
    @Range(min = 0, max = 4)
    @NotNull
    private Integer opType;

    @ApiModelProperty(value = "总价")
    @NotNull
    private BigDecimal opTotalPrice;

    @ApiModelProperty(value = "备注")
    private String opRemark;

    public Long getOpTicketId() {
        return opTicketId;
    }

    public void setOpTicketId(Long opTicketId) {
        this.opTicketId = opTicketId;
    }

    public String getOpPriceName() {
        return opPriceName;
    }

    public void setOpPriceName(String opPriceName) {
        this.opPriceName = opPriceName;
    }

    public Integer getOpNum() {
        return opNum;
    }

    public void setOpNum(Integer opNum) {
        this.opNum = opNum;
    }

    public BigDecimal getOpPrice() {
        return opPrice;
    }

    public void setOpPrice(BigDecimal opPrice) {
        this.opPrice = opPrice;
    }

    public Integer getOpType() {
        return opType;
    }

    public void setOpType(Integer opType) {
        this.opType = opType;
    }

    public BigDecimal getOpTotalPrice() {
        return opTotalPrice;
    }

    public void setOpTotalPrice(BigDecimal opTotalPrice) {
        this.opTotalPrice = opTotalPrice;
    }

    public String getOpRemark() {
        return opRemark;
    }

    public void setOpRemark(String opRemark) {
        this.opRemark = opRemark;
    }

    public Integer getRoomNum() {
        return roomNum;
    }

    public void setRoomNum(Integer roomNum) {
        this.roomNum = roomNum;
    }
}
