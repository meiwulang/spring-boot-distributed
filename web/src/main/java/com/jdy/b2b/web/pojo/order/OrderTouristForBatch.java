package com.jdy.b2b.web.pojo.order;


import com.jdy.b2b.web.util.BaseVO;

import java.util.Date;
import java.util.List;

/**
 * Created by strict on 2018/4/13.
 */
public class OrderTouristForBatch extends BaseVO {

    private Long otOrderId;

    //private Integer otType;

    //private Integer otRep;

    /*private Long otLeaveId;

    private Byte otLeaveType;

    private BigDecimal otLeavePrice;

    private Long otReturnId;

    private Byte otReturnType;

    private BigDecimal otReturnPrice;*/

    private Date updateTime;

    private Long updateUser;

    /*private Integer tAdultNum;//成人数

    private Integer tChildNum;//  儿童数*/

    private List<OrderTouristAddInfo> touristInfo ;

    public Long getOtOrderId() {
        return otOrderId;
    }

    public void setOtOrderId(Long otOrderId) {
        this.otOrderId = otOrderId;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public List<OrderTouristAddInfo> getTouristInfo() {
        return touristInfo;
    }

    public void setTouristInfo(List<OrderTouristAddInfo> touristInfo) {
        this.touristInfo = touristInfo;
    }
}
