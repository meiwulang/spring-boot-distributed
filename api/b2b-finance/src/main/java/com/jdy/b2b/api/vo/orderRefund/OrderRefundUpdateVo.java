package com.jdy.b2b.api.vo.orderRefund;



import com.jdy.b2b.api.common.BaseVO;


/**
 * Created by yangcheng on 2017/8/29.
 */
public class OrderRefundUpdateVo extends BaseVO {
    private Long id;
    private String orRemark;
    private Boolean orStauts;
    private Long orLabelId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrRemark() {
        return orRemark;
    }

    public void setOrRemark(String orRemark) {
        this.orRemark = orRemark;
    }

    public Boolean getOrStauts() {
        return orStauts;
    }

    public void setOrStauts(Boolean orStauts) {
        this.orStauts = orStauts;
    }

    public Long getOrLabelId() {
        return orLabelId;
    }

    public void setOrLabelId(Long orLabelId) {
        this.orLabelId = orLabelId;
    }
}
