package com.jdy.b2b.api.model.organizationalstructure;

import java.util.Objects;

/**
 * Created by zhangfofa on 2017/11/16.
 */
public class Node {
    /**
     * 节点编号
     */
    private String id;
    /**
     * 节点内容
     */
    private String text;
    /**
     * 父节点编号
     */
    private String parentId;
    /**
     * 公司id
     */
    private String companyId;
    /**
     * 负责人
     */
    private String personInCharge;
    /**
     * 孩子节点列表
     */
    private Children children = new Children();

    private String leaderName;

    private Byte departmentType;

    public String getLeaderName() {
        return leaderName;
    }

    public void setLeaderName(String leaderName) {
        this.leaderName = leaderName;
    }

    public Byte getDepartmentType() {
        return departmentType;
    }

    public void setDepartmentType(Byte departmentType) {
        this.departmentType = departmentType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String getPersonInCharge() {
        return personInCharge;
    }

    public void setPersonInCharge(String personInCharge) {
        this.personInCharge = personInCharge;
    }

    // 先序遍历，拼接JSON字符串
    public String toString() {
        StringBuffer sb = new StringBuffer();
        sb.append("{id : '");
        sb.append(id);
        sb.append("', text : '");
        sb.append(text);
        sb.append("', parentId : '");
        sb.append(parentId);
        if(!Objects.equals(companyId, "")) {
            sb.append("', companyId : '");
            sb.append(companyId);
        }
        if(!Objects.equals(personInCharge, "")) {
            sb.append("', personInCharge : '");
            sb.append(personInCharge);
        }
        sb.append("', leaderName : '");
        sb.append(Objects.toString(leaderName,""));
        sb.append("', departmentType : '");
        sb.append(departmentType);
        sb.append("'");
        String result = sb.toString();

        if (children != null && children.getSize() != 0) {
            result += ", children : " + children.toString();
        } else {
            result += ", leaf : true";
        }
        return result + "}";
    }

    // 添加孩子节点
    public void addChild(Node node) {
        this.children.addChild(node);
    }

    // 兄弟节点横向排序
    public void sortChildren() {
        if (children != null && children.getSize() != 0) {
            children.sortChildren();
        }
    }
}
