package com.jdy.b2b.web.pojo.orderOffline;

import java.math.BigDecimal;

import javax.validation.constraints.Min;

import org.hibernate.validator.constraints.Length;

import com.jdy.b2b.web.util.BaseVO;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by yangcheng on 2018/1/23.
 */
@ApiModel(value = "保存凭证")
public class OrderOfflineSaveVO extends BaseVO {
	@ApiModelProperty(hidden = true, value = "订单id")
	private Long orderId;
	@ApiModelProperty(value = "订单编号")
	private String orderNo;

	@ApiModelProperty(value = "凭证url")
	private String url;
	@ApiModelProperty(value = "金额")
	@Min(value = 0, message = "输入的金额不能为负!")
	private BigDecimal money;

	@ApiModelProperty(value = "0-全款 1-首款 2-尾款")
	private Integer type;

	@ApiModelProperty(value = "上传说明")
	@Length(max = 100, message = "上传说明最多100个字!")
	private String uploadDesc;
	// @ApiModelProperty(value = "凭证编号")
	// @Length(max = 50, message = "最长支持50位")
	// private String transNo;
	@ApiModelProperty(value = "用户编号")
	private Long userId;// 用户编号

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	// public String getTransNo() {
	// return transNo;
	// }
	//
	// public void setTransNo(String transNo) {
	// this.transNo = transNo;
	// }

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public String getUploadDesc() {
		return uploadDesc;
	}

	public void setUploadDesc(String uploadDesc) {
		this.uploadDesc = uploadDesc;
	}

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public BigDecimal getMoney() {
		return money;
	}

	public void setMoney(BigDecimal money) {
		this.money = money;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}
}
