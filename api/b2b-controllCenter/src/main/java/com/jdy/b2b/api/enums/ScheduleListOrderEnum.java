package com.jdy.b2b.api.enums;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/17 10:10
 */
public enum ScheduleListOrderEnum {

    SCHEDULE_NO_ASC(1, "s_schedule_no", "班期编号升序"),
    SCHEDULE_NO_DESC(2, "s_schedule_no desc", "班期编号降序"),
    CALENDAR_ASC(3, "s_calendar", "出发日期升序"),
    CALENDAR_DESC(4, "s_calendar desc", "出发日期降序"),
    LEAVE_TIME_ASC(5, "s_leave_time", "出发时分升序"),
    LEAVE_TIME_DESC(6, "s_leave_time desc", "出发时分降序"),
    WEEK_DAY_ASC(7, "s_week_day", "星期几升序"),
    WEEK_DAY_DESC(8, "s_week_day desc", "星期几降序");

    private Integer value;
    private String orderBy;
    private String desc;

    ScheduleListOrderEnum(Integer value, String orderBy, String desc) {
        this.value = value;
        this.orderBy = orderBy;
        this.desc = desc;
    }

    public Integer getValue() {
        return value;
    }

    public String getOrderBy() {
        return orderBy;
    }

    public String getDesc() {
        return desc;
    }

    public static String getOrderByValue(Integer value) {
        if (value == null) {
            return "";
        }
        for (ScheduleListOrderEnum enu : values()) {
            if (enu.getValue().equals(value)) {
                return enu.getOrderBy();
            }
        }
        return "";
    }

    public static ScheduleListOrderEnum getByValue(Integer value) {
        if (value == null) {
            return null;
        }
        for (ScheduleListOrderEnum enu : values()) {
            if (enu.getValue().equals(value)) {
                return enu;
            }
        }
        return null;
    }

    public boolean equals(Integer value) {
        if (value == null) {
            return false;
        }
        if (this.value.equals(value)) {
            return true;
        } else {
            return false;
        }
    }
}
