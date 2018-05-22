package com.jdy.b2b.web.pojo.order;


import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/12 14:28
 */
public class OrderPayRecordsDTO extends Order {

    private List<OrderPayDTO> pays;

    public List<OrderPayDTO> getPays() {
        return pays;
    }

    public void setPays(List<OrderPayDTO> pays) {
        this.pays = pays;
    }

}
