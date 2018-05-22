package com.jdy.b2b.api.model.front;

import com.jdy.b2b.api.model.ticket.Ticket;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by dugq on 2017/9/19.
 */
public class ProductScheduleDto implements Serializable {
    private static final long serialVersionUID = -8001745481539817051L;
    private String name;
    private String bl_num;   //编号
    private String sGroupOrderNo;
    private int bl_seat_count; //总座位数
    private Date bl_start_date; //出团日期
    private String bl_start_week; //星期
    private int p_days; //天数
    private int bl_saled; //已定座位数
    private String p_name; //产品名称
    private Integer p_confirm; //是否需要确认
    private Integer sold;   //已订
    private Integer hold;   //预留
    private Integer lock;   //锁定
    private Integer sham;   //虚占
    private Integer s_group_num;  //成团人数
    private Long s_id;
    private String calendar;
    private List<FrontTicket> ticket;
    private List<Ticket> backTicket;
    private Date sLeaveTime;
    private Integer stopSale;
    private Integer stopType;

    public String getsGroupOrderNo() {
        return sGroupOrderNo;
    }

    public void setsGroupOrderNo(String sGroupOrderNo) {
        this.sGroupOrderNo = sGroupOrderNo;
    }

    public Date getsLeaveTime() {
        return sLeaveTime;
    }

    public void setsLeaveTime(Date sLeaveTime) {
        this.sLeaveTime = sLeaveTime;
    }

    public Integer getStopSale() {
        return stopSale;
    }

    public void setStopSale(Integer stopSale) {
        this.stopSale = stopSale;
    }

    public Integer getStopType() {
        return stopType;
    }

    public void setStopType(Integer stopType) {
        this.stopType = stopType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Ticket> getBackTicket() {
        return backTicket;
    }

    public void setBackTicket(List<Ticket> backTicket) {
        this.backTicket = backTicket;
    }

    public String getCalendar() {
        return calendar;
    }

    public void setCalendar(String calendar) {
        this.calendar = calendar;
    }

    public Long getS_id() {
        return s_id;
    }

    public void setS_id(Long s_id) {
        this.s_id = s_id;
    }

    public Integer getS_group_num() {
        return s_group_num;
    }

    public void setS_group_num(Integer s_group_num) {
        this.s_group_num = s_group_num;
    }

    public Integer getSold() {
        return sold;
    }

    public void setSold(Integer sold) {
        this.sold = sold;
    }

    public Integer getHold() {
        return hold;
    }

    public void setHold(Integer hold) {
        this.hold = hold;
    }

    public Integer getLock() {
        return lock;
    }

    public void setLock(Integer lock) {
        this.lock = lock;
    }

    public Integer getSham() {
        return sham;
    }

    public void setSham(Integer sham) {
        this.sham = sham;
    }

    public Integer getP_confirm() {
        return p_confirm;
    }

    public void setP_confirm(Integer p_confirm) {
        this.p_confirm = p_confirm;
    }



    public String getBl_num() {
        return bl_num;
    }

    public void setBl_num(String bl_num) {
        this.bl_num = bl_num;
    }

    public int getBl_seat_count() {
        return bl_seat_count;
    }

    public void setBl_seat_count(int bl_seat_count) {
        this.bl_seat_count = bl_seat_count;
    }

    public Date getBl_start_date() {
        return bl_start_date;
    }

    public void setBl_start_date(Date bl_start_date) {
        this.bl_start_date = bl_start_date;
    }

    public String getBl_start_week() {
        return bl_start_week;
    }

    public void setBl_start_week(String bl_start_week) {
        this.bl_start_week = bl_start_week;
    }

    public int getP_days() {
        return p_days;
    }

    public void setP_days(int p_days) {
        this.p_days = p_days;
    }

    public int getBl_saled() {
        return bl_saled;
    }

    public void setBl_saled(int bl_saled) {
        this.bl_saled = bl_saled;
    }

    public String getP_name() {
        return p_name;
    }

    public void setP_name(String p_name) {
        this.p_name = p_name;
    }

    public List<FrontTicket> getTicket() {
        return ticket;
    }

    public void setTicket(List<FrontTicket> ticket) {
        this.ticket = ticket;
    }
}
