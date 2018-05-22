package com.jdy.b2b.web.pojo.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * @Description 订单列表返回对象
 * @Author yyf
 * @DateTime 2017/8/30 11:07
 */
@ApiModel(description = "订单列表返回条目")
public class OrderListDTO extends Order {
    @ApiModelProperty(value = "产品类型")
    private Integer pType;
    @ApiModelProperty(value = "产品编号")
    private String pNo;
    @ApiModelProperty(value = "产品名称")
    private String pName;
    @ApiModelProperty(value = "行程天数")
    private Integer pDays;
    @ApiModelProperty(value = "出发日期")
    private Date sCalendar;
    @ApiModelProperty(value = "团号")
    private String sGroupOrderNo;
    @ApiModelProperty(value = "出发时间")
    private Date sLeaveTime;
    @ApiModelProperty(value = "出发城市")
    private String leaveCity;
    @ApiModelProperty(value = "订单创建人名称")
    private String createrURealName;

    @ApiModelProperty(value = "卖家计调手机")
    private String salerPhone;
    @ApiModelProperty(value = "买家下单人手机")
    private String buyerPhone;
    @ApiModelProperty(value = "买家stype")
    private Integer buyerStype;
    @ApiModelProperty(value = "买家所在省")
    private String buyerProvince;
    @ApiModelProperty(value = "买家所在城市")
    private String buyerCity;
    @ApiModelProperty(value = "卖家所在省")
    private String salerProvince;
    @ApiModelProperty(value = "卖家所在城市")
    private String salerCity;

    @ApiModelProperty(value = "价格详情列表")
    private List<OrderPriceDetail> priceDetails;

    @ApiModelProperty(value = "游客信息列表")
    private List<OrderTourist> tourists;

    @ApiModelProperty(value = "买家名称")
    private String buyerName;
    @ApiModelProperty(value = "买家所在分公司部门")
    private String buyerDepartName;
    @ApiModelProperty(value = "卖家名称")
    private String salerName;
    @ApiModelProperty(value = "卖家所在分公司部门")
    private String salerDepartName;
    @ApiModelProperty(value = "首付款")
    private String firstPay;
    @ApiModelProperty(value = "尾款")
    private String unPay;
    @ApiModelProperty(value = "全额支付款金额")
    private String allPay;
    @ApiModelProperty(value = "微信交易号")
    private String wxPayNum;
    @ApiModelProperty(value = "订单类型")
    private String orderType;
    @ApiModelProperty(value = "支付时间")
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    private Date payTime;

    @ApiModelProperty(value = "买家可上传支付凭证：0-否 1-是")
    private Integer isBuyerVoucher;
    @ApiModelProperty(value = "卖家可确认支付凭证：0-否 1-是")
    private Integer isSallerVoucher;

    private Integer groupDeleteStatus;//团期是否有效 0 有效  1无效
    private Integer groupStatus;//团期状态 0：待发团 1：发团中 2：已结团 3：已回团 4：已取消
    private String touristContactInfo;//游客联系人信息：姓名,电话

    @ApiModelProperty(value = "衍生出的新订单和负订单")
    private List<OrderListDTO> subOrders;
    private BigDecimal refundAmount;
    
    public BigDecimal getRefundAmount() {
		return refundAmount;
	}

	public void setRefundAmount(BigDecimal refundAmount) {
		this.refundAmount = refundAmount;
	}

	public Integer getBuyerStype() {
        return buyerStype;
    }

    public void setBuyerStype(Integer buyerStype) {
        this.buyerStype = buyerStype;
    }

    public String getBuyerName() {
		return buyerName;
	}

	public void setBuyerName(String buyerName) {
		this.buyerName = buyerName;
	}

	public String getBuyerDepartName() {
		return buyerDepartName;
	}

	public void setBuyerDepartName(String buyerDepartName) {
		this.buyerDepartName = buyerDepartName;
	}

	public String getSalerName() {
		return salerName;
	}

	public void setSalerName(String salerName) {
		this.salerName = salerName;
	}

	public String getSalerDepartName() {
		return salerDepartName;
	}

	public void setSalerDepartName(String salerDepartName) {
		this.salerDepartName = salerDepartName;
	}

	public String getFirstPay() {
		return firstPay;
	}

	public void setFirstPay(String firstPay) {
		this.firstPay = firstPay;
	}

	public String getUnPay() {
		return unPay;
	}

	public void setUnPay(String unPay) {
		this.unPay = unPay;
	}

	public String getAllPay() {
		return allPay;
	}

	public void setAllPay(String allPay) {
		this.allPay = allPay;
	}

    public String getWxPayNum() {
        if(isNotBlank(wxPayNum) && wxPayNum.contains(",")) {
            wxPayNum = wxPayNum.replaceAll(",",",\n");
        }
        return wxPayNum;
    }

	public void setWxPayNum(String wxPayNum) {
		this.wxPayNum = wxPayNum;
	}

	public String getOrderType() {
		return orderType;
	}

	public void setOrderType(String orderType) {
		this.orderType = orderType;
	}

	public Integer getpType() {
        return pType;
    }

    public void setpType(Integer pType) {
        this.pType = pType;
    }

    public List<OrderPriceDetail> getPriceDetails() {
        return priceDetails;
    }

    public void setPriceDetails(List<OrderPriceDetail> priceDetails) {
        this.priceDetails = priceDetails;
    }

    public List<OrderTourist> getTourists() {
        return tourists;
    }

    public void setTourists(List<OrderTourist> tourists) {
        this.tourists = tourists;
    }

    public String getBuyerProvince() {
        return buyerProvince;
    }

    public void setBuyerProvince(String buyerProvince) {
        this.buyerProvince = buyerProvince;
    }

    public String getBuyerCity() {
        return buyerCity;
    }

    public void setBuyerCity(String buyerCity) {
        this.buyerCity = buyerCity;
    }

    public String getSalerProvince() {
        return salerProvince;
    }

    public void setSalerProvince(String salerProvince) {
        this.salerProvince = salerProvince;
    }

    public String getSalerCity() {
        return salerCity;
    }

    public void setSalerCity(String salerCity) {
        this.salerCity = salerCity;
    }

    public String getCreaterURealName() {
        return createrURealName;
    }

    public void setCreaterURealName(String createrURealName) {
        this.createrURealName = createrURealName;
    }

    public String getpNo() {
        return pNo;
    }

    public void setpNo(String pNo) {
        this.pNo = pNo;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public Integer getpDays() {
        return pDays;
    }

    public void setpDays(Integer pDays) {
        this.pDays = pDays;
    }

    public Date getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(Date sCalendar) {
        this.sCalendar = sCalendar;
    }

    public String getLeaveCity() {
        return leaveCity;
    }

    public void setLeaveCity(String leaveCity) {
        this.leaveCity = leaveCity;
    }

    public String getSalerPhone() {
        return salerPhone;
    }

    public void setSalerPhone(String salerPhone) {
        this.salerPhone = salerPhone;
    }

    public String getBuyerPhone() {
        return buyerPhone;
    }

    public void setBuyerPhone(String buyerPhone) {
        this.buyerPhone = buyerPhone;
    }

    public Date getsLeaveTime() {
        return sLeaveTime;
    }

    public void setsLeaveTime(Date sLeaveTime) {
        this.sLeaveTime = sLeaveTime;
    }

    public String getsGroupOrderNo() {
        return sGroupOrderNo;
    }

    public void setsGroupOrderNo(String sGroupOrderNo) {
        this.sGroupOrderNo = sGroupOrderNo;
    }

    public Date getPayTime() {
        return payTime;
    }

    public void setPayTime(Date payTime) {
        this.payTime = payTime;
    }

    public Integer getIsBuyerVoucher() {
        return isBuyerVoucher;
    }

    public void setIsBuyerVoucher(Integer isBuyerVoucher) {
        this.isBuyerVoucher = isBuyerVoucher;
    }

    public Integer getIsSallerVoucher() {
        return isSallerVoucher;
    }

    public void setIsSallerVoucher(Integer isSallerVoucher) {
        this.isSallerVoucher = isSallerVoucher;
    }

    public Integer getGroupDeleteStatus() {
        return groupDeleteStatus;
    }

    public void setGroupDeleteStatus(Integer groupDeleteStatus) {
        this.groupDeleteStatus = groupDeleteStatus;
    }

    public Integer getGroupStatus() {
        return groupStatus;
    }

    public void setGroupStatus(Integer groupStatus) {
        this.groupStatus = groupStatus;
    }

    public List<OrderListDTO> getSubOrders() {
        return subOrders;
    }

    public void setSubOrders(List<OrderListDTO> subOrders) {
        this.subOrders = subOrders;
    }

    public String getTouristContactInfo() {
        return touristContactInfo;
    }

    public void setTouristContactInfo(String touristContactInfo) {
        this.touristContactInfo = touristContactInfo;
    }
}
