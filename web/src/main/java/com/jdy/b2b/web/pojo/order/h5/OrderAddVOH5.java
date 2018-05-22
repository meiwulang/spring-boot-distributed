package com.jdy.b2b.web.pojo.order.h5;

import com.jdy.b2b.web.pojo.order.CardDO;
import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/26 19:44
 */
@ApiModel(description = "H5下单接口")
public class OrderAddVOH5 extends BaseVO {

    @ApiModelProperty(value = "班期id")
    private Long bl_id;
    @ApiModelProperty(value = "备注")
    private String o_remark;
    @ApiModelProperty(value = "外部订单编号")
    private String o_out_num;
    @ApiModelProperty(value = "合同编号")
    private String o_deal_num;
    @ApiModelProperty(value = "优惠金额")
    private BigDecimal sell_favourable;
    @ApiModelProperty(value = "合同补充约定")
    private String oContractAgreement;

    @ApiModelProperty(value = "签名时间戳(非必传)")
    private Date time_stamp;
    @ApiModelProperty(value = "城市编码")
    private Integer city_code;
    @ApiModelProperty(value = "车座信息")
    private List<BusSeatH5> seat_spread;
    @ApiModelProperty(value = "购票信息")
    private List<TicketH5> ticket;
    @ApiModelProperty(value = "礼品卡信息")
    private List<CardDO> cardDOS;
    @ApiModelProperty(value = "小程序openid")
    private String appletId;

    @ApiModelProperty(value = "1-首付款方式下单")
    private Integer bookType;
    @ApiModelProperty(value = "订单类型：1-个人，2-企业")
    @Range(min = 1,max=2)
    private Integer oType;

    public Integer getoType() {
        return oType;
    }

    public void setoType(Integer oType) {
        this.oType = oType;
    }

    public Integer getBookType() {
        return bookType;
    }

    public void setBookType(Integer bookType) {
        this.bookType = bookType;
    }

    public Long getBl_id() {
        return bl_id;
    }

    public void setBl_id(Long bl_id) {
        this.bl_id = bl_id;
    }

    public String getO_remark() {
        return o_remark;
    }

    public void setO_remark(String o_remark) {
        this.o_remark = o_remark;
    }

    public String getO_out_num() {
        return o_out_num;
    }

    public void setO_out_num(String o_out_num) {
        this.o_out_num = o_out_num;
    }

    public String getO_deal_num() {
        return o_deal_num;
    }

    public void setO_deal_num(String o_deal_num) {
        this.o_deal_num = o_deal_num;
    }

    public BigDecimal getSell_favourable() {
        return sell_favourable;
    }

    public void setSell_favourable(BigDecimal sell_favourable) {
        this.sell_favourable = sell_favourable;
    }

    public Date getTime_stamp() {
        return time_stamp;
    }

    public void setTime_stamp(Date time_stamp) {
        this.time_stamp = time_stamp;
    }

    public Integer getCity_code() {
        return city_code;
    }

    public void setCity_code(Integer city_code) {
        this.city_code = city_code;
    }

    public List<BusSeatH5> getSeat_spread() {
        return seat_spread;
    }

    public void setSeat_spread(List<BusSeatH5> seat_spread) {
        this.seat_spread = seat_spread;
    }

    public List<TicketH5> getTicket() {
        return ticket;
    }

    public void setTicket(List<TicketH5> ticket) {
        this.ticket = ticket;
    }

    public String getoContractAgreement() {
        return oContractAgreement;
    }

    public void setoContractAgreement(String oContractAgreement) {
        this.oContractAgreement = oContractAgreement;
    }

    public List<CardDO> getCardDOS() {
        return cardDOS;
    }

    public void setCardDOS(List<CardDO> cardDOS) {
        this.cardDOS = cardDOS;
    }

    public String getAppletId() {
        return appletId;
    }

    public void setAppletId(String appletId) {
        this.appletId = appletId;
    }
}
