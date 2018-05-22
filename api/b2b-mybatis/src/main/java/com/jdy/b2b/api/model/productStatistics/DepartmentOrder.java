package com.jdy.b2b.api.model.productStatistics;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Created by dugq on 2017/11/16.
 */
public class DepartmentOrder extends ParentOrder implements Serializable {
    private static final long serialVersionUID = -2270436184091469127L;
    private Long departmentId;
    private String departmentName;

    public DepartmentOrder() {
        super(1);
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

}
