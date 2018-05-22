package com.jdy.b2b.api.model.diy;

/**
 * @Description
 * @Author yyf
 * @DateTime 2018/1/26 20:22
 */
public class OrderStatusNumberDTO {
    private Integer status;
    private Integer number;

    public OrderStatusNumberDTO() {
    }

    public OrderStatusNumberDTO(Integer status, Integer number) {
        this.status = status;
        this.number = number;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }
}
