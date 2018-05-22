package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/13 14:56
 */
@ApiModel(description = "订单日志列表")
public class OrderOperLogsDTO extends BaseVO {

    @ApiModelProperty(value = "订单操作日志")
    private List<OrderLogs> operLogs;

    public List<OrderLogs> getOperLogs() {
        return operLogs;
    }

    public void setOperLogs(List<OrderLogs> operLogs) {
        this.operLogs = operLogs;
    }

}
