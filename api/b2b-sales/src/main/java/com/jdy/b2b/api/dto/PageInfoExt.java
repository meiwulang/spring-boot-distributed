package com.jdy.b2b.api.dto;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.model.diy.OrderListDTO;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/13 18:06
 */
public class PageInfoExt<T> extends PageInfo {

    private Object extObj;

    public PageInfoExt() {
    }

    public PageInfoExt(List<OrderListDTO> orderListDTOS) {
        super(orderListDTOS);
    }

    public Object getExtObj() {
        return extObj;
    }

    public void setExtObj(Object extObj) {
        this.extObj = extObj;
    }
}
