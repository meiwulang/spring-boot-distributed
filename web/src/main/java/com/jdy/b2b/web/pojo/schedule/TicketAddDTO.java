package com.jdy.b2b.web.pojo.schedule;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/2 15:24
 */
@ApiModel(description = "票DTO")
public class TicketAddDTO {

    @ApiModelProperty("主键id")
    @Min(1)
    @NotNull(message="票id不能为空")
    private Long id;

    @ApiModelProperty("市场价")
    @Min(0)
    private BigDecimal tMarketPrice;

    @ApiModelProperty("同行价")
    @Min(0)
    private BigDecimal tPeerPrice;

    @ApiModelProperty("库存")
    private Integer tStock;
    private BigDecimal factoryPrice;

    public BigDecimal getFactoryPrice() {
		return factoryPrice;
	}

	public void setFactoryPrice(BigDecimal factoryPrice) {
		this.factoryPrice = factoryPrice;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal gettMarketPrice() {
        return tMarketPrice;
    }

    public void settMarketPrice(BigDecimal tMarketPrice) {
        this.tMarketPrice = tMarketPrice;
    }

    public BigDecimal gettPeerPrice() {
        return tPeerPrice;
    }

    public void settPeerPrice(BigDecimal tPeerPrice) {
        this.tPeerPrice = tPeerPrice;
    }

    public Integer gettStock() {
        return tStock;
    }

    public void settStock(Integer tStock) {
        this.tStock = tStock;
    }
}
