package com.jdy.b2b.api.model.diy;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by dugq on 2018/1/24.
 */
public class OrderPayLine {
    private int lineType;
    private Date createTime;

    private String createDate;
    private String createHour;

    public String getCreateDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd");
        createDate = sdf.format(createTime);
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public String getCreateHour() {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        createHour = sdf.format(createTime);
        return createHour;
    }

    public void setCreateHour(String createHour) {
        this.createHour = createHour;
    }

    public OrderPayLine(int lineType) {
        this.lineType = lineType;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public OrderPayLine() {
    }

    public int getLineType() {
        return lineType;
    }

    public void setLineType(int lineType) {
        this.lineType = lineType;
    }
}
