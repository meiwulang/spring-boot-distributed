package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.common.BaseVO;

import java.util.List;

/**
 * Created by strict on 2017/9/21.
 */
public class OrderH5Vo extends BaseVO{
    private String source; // m

    private String order_type; // seller

    private String status; //待审核0  已报名1  已首款7  已全款8   已取消4  已驳回6  未签署5

    private String key;

    private String no;

    private Long p_id;

    private Long bl_id;

    private String city_code;

    private Integer limit;

    private Integer page;

    private Long companyId;

    private Long userId;

    private String appletId;

    private List<Long> tickets;//下单前选择的票

    private Integer isVisitor;//是否是游客

    public Integer getIsVisitor() {
        return isVisitor;
    }

    public void setIsVisitor(Integer isVisitor) {
        this.isVisitor = isVisitor;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getOrder_type() {
        return order_type;
    }

    public void setOrder_type(String order_type) {
        this.order_type = order_type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public Long getP_id() {
        return p_id;
    }

    public void setP_id(Long p_id) {
        this.p_id = p_id;
    }

    public Long getBl_id() {
        return bl_id;
    }

    public void setBl_id(Long bl_id) {
        this.bl_id = bl_id;
    }

    public String getCity_code() {
        return city_code;
    }

    public void setCity_code(String city_code) {
        this.city_code = city_code;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public String getAppletId() {
        return appletId;
    }

    public void setAppletId(String appletId) {
        this.appletId = appletId;
    }

    public List<Long> getTickets() {
        return tickets;
    }

    public void setTickets(List<Long> tickets) {
        this.tickets = tickets;
    }
}
