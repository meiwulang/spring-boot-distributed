package com.jdy.b2b.api.model.user;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yangcheng on 2017/9/26.
 */

public class WXUserResultDO {
    private Long u_id;//用户id
    private String u_name;//用户名
    private String u_realname;//用户真实姓名
    private String u_mobile;//用户手机
    private String u_qq;//qq
    private String u_sex;//性别
    private String u_openid;//用户openid
    private String u_head;//头像URL
    private Long org_id;//公司id
    private String org_type;//公司类型
    private String org_province;//省
    private String org_city;//城市
    private String org_county;//区县
    private String org_addr;//公司地址
    private String r_name;//角色名称
    private String u_face;//头像(真正用到)
    private String u_stype;//用户销售类型 0:非销售类 1:销售类 2:签约人员 3:路人甲

    private Long u_org_id;
    private String org_name;

    private Map<String,Object> map = new HashMap<String,Object>();
    private String u_nickname;//用户昵称,暂无
    private String u_wechatimg;//微信头像,暂无
    private String u_nature;//个性签名(用于手机端显示),暂无
    private String org_logo;//公司logo,暂无
    private String org_service_tel;//暂无
    private String org_sname;//公司简称,暂无
    private String org_release;//产品类型,暂无

    
    public String getU_stype() {
		return u_stype;
	}

	public void setU_stype(String u_stype) {
		this.u_stype = u_stype;
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

    public Map<String, Object> getMap() {
        return map;
    }

    public void setMap(Map<String, Object> map) {
        this.map = map;
    }

    public Long getOrg_id() {
        return org_id;
    }

    public void setOrg_id(Long org_id) {
        this.org_id = org_id;
    }

    public String getOrg_logo() {
        return org_logo;
    }

    public void setOrg_logo(String org_logo) {
        this.org_logo = org_logo;
    }

    public String getOrg_sname() {
        return org_sname;
    }

    public void setOrg_sname(String org_sname) {
        this.org_sname = org_sname;
    }

    public String getOrg_type() {
        return org_type;
    }

    public void setOrg_type(String org_type) {
        this.org_type = org_type;
    }

    public String getOrg_release() {
        return org_release;
    }

    public void setOrg_release(String org_release) {
        this.org_release = org_release;
    }

    public String getOrg_province() {
        return org_province;
    }

    public void setOrg_province(String org_province) {
        this.org_province = org_province;
    }

    public String getOrg_city() {
        return org_city;
    }

    public void setOrg_city(String org_city) {
        this.org_city = org_city;
    }

    public String getOrg_county() {
        return org_county;
    }

    public void setOrg_county(String org_county) {
        this.org_county = org_county;
    }

    public String getOrg_service_tel() {
        return org_service_tel;
    }

    public void setOrg_service_tel(String org_service_tel) {
        this.org_service_tel = org_service_tel;
    }

    public String getOrg_addr() {
        return org_addr;
    }

    public void setOrg_addr(String org_addr) {
        this.org_addr = org_addr;
    }

    public Long getU_id() {
        return u_id;
    }

    public void setU_id(Long u_id) {
        this.u_id = u_id;
    }

    public String getU_name() {
        return u_name;
    }

    public void setU_name(String u_name) {
        this.u_name = u_name;
    }

    public String getU_realname() {
        return u_realname;
    }

    public void setU_realname(String u_realname) {
        this.u_realname = u_realname;
    }

    public String getU_mobile() {
        return u_mobile;
    }

    public void setU_mobile(String u_mobile) {
        this.u_mobile = u_mobile;
    }

    public String getU_qq() {
        return u_qq;
    }

    public void setU_qq(String u_qq) {
        this.u_qq = u_qq;
    }

    public String getU_sex() {
        return u_sex;
    }

    public void setU_sex(String u_sex) {
        this.u_sex = u_sex;
    }

    public String getU_openid() {
        return u_openid;
    }

    public void setU_openid(String u_openid) {
        this.u_openid = u_openid;
    }

    public String getU_head() {
        return u_head;
    }

    public void setU_head(String u_head) {
        this.u_head = u_head;
    }

    public String getU_nickname() {
        return u_nickname;
    }

    public void setU_nickname(String u_nickname) {
        this.u_nickname = u_nickname;
    }

    public String getU_wechatimg() {
        return u_wechatimg;
    }

    public void setU_wechatimg(String u_wechatimg) {
        this.u_wechatimg = u_wechatimg;
    }

    public String getU_nature() {
        return u_nature;
    }

    public void setU_nature(String u_nature) {
        this.u_nature = u_nature;
    }

    public String getU_face() {
        return u_face;
    }

    public void setU_face(String u_face) {
        this.u_face = u_face;
    }

    public String getR_name() {
        return r_name;
    }

    public void setR_name(String r_name) {
        this.r_name = r_name;
    }
}
