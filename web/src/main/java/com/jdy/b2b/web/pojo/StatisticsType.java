package com.jdy.b2b.web.pojo;

/**
 * Created by dugq on 2017/12/5.
 */
public enum StatisticsType {
    TOTAL(0),MONTH(1),DAY(2),WEEK(3), SEASON(4),YEAR(5);

    private int value;

    StatisticsType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

}
