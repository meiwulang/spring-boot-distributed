package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.model.OrderLogs;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/13 14:56
 */
public class OrderOperLogsDTO extends BaseVO {

    private List<OrderLogs> operLogs;

    public List<OrderLogs> getOperLogs() {
        return operLogs;
    }

    public void setOperLogs(List<OrderLogs> operLogs) {
        this.operLogs = operLogs;
    }

}
