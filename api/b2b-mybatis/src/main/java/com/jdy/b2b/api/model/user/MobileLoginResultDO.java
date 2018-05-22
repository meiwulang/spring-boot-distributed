package com.jdy.b2b.api.model.user;

/**
 * Created by yangcheng on 2017/9/22.
 */
public class MobileLoginResultDO {
    private Long u_id;//用户id
    private Long userId;//兼容web的userId
    private String u_realname;//真实姓名
    private String u_name;//用户名
    private Long u_org_id;//所属单位
    private String org_name;//单位名称
    private String org_city;//单位城市
    private String org_city_code;//城市码
    private String u_face;//头像
    private String phone;//手机
    private String org_type;//公司类型

    private String org_sname;//单位简称,暂时不传
    private String u_nickname;//微信昵称,暂时不传
    private String wap_menu;//权限菜单,暂时不传


    public String getU_face() {
        return u_face;
    }

    public void setU_face(String u_face) {
        this.u_face = u_face;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getOrg_type() {
        return org_type;
    }

    public void setOrg_type(String org_type) {
        this.org_type = org_type;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getU_id() {
        return u_id;
    }

    public void setU_id(Long u_id) {
        this.u_id = u_id;
    }

    public String getU_realname() {
        return u_realname;
    }

    public void setU_realname(String u_realname) {
        this.u_realname = u_realname;
    }

    public String getU_name() {
        return u_name;
    }

    public void setU_name(String u_name) {
        this.u_name = u_name;
    }

    public String getU_nickname() {
        return u_nickname;
    }

    public void setU_nickname(String u_nickname) {
        this.u_nickname = u_nickname;
    }

    public String getWap_menu() {
        return wap_menu;
    }

    public void setWap_menu(String wap_menu) {
        this.wap_menu = wap_menu;
    }

    public Long getU_org_id() {
        return u_org_id;
    }

    public void setU_org_id(Long u_org_id) {
        this.u_org_id = u_org_id;
    }

    public String getOrg_name() {
        return org_name;
    }

    public void setOrg_name(String org_name) {
        this.org_name = org_name;
    }

    public String getOrg_sname() {
        return org_sname;
    }

    public void setOrg_sname(String org_sname) {
        this.org_sname = org_sname;
    }

    public String getOrg_city() {
        return org_city;
    }

    public void setOrg_city(String org_city) {
        this.org_city = org_city;
    }

    public String getOrg_city_code() {
        return org_city_code;
    }

    public void setOrg_city_code(String org_city_code) {
        this.org_city_code = org_city_code;
    }
}
