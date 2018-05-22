package com.jdy.b2b.api.vo.ticket;

import com.jdy.b2b.api.common.BaseVO;

/**
 * Created by yangcheng on 2018/2/28.
 */
public class CopyGatherTicketsVO extends BaseVO{
    private Long productId;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
