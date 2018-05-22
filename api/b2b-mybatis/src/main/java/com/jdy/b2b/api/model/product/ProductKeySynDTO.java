package com.jdy.b2b.api.model.product;

/**
 * Created by strict on 2018/3/9.
 */
public class ProductKeySynDTO {
    private Long kId;
    private Long pId;
    private String kName;
    private String kColor;

    public Long getpId() {
        return pId;
    }

    public void setpId(Long pId) {
        this.pId = pId;
    }

    public Long getkId() {
        return kId;
    }

    public void setkId(Long kId) {
        this.kId = kId;
    }

    public String getkName() {
        return kName;
    }

    public void setkName(String kName) {
        this.kName = kName;
    }

    public String getkColor() {
        return kColor;
    }

    public void setkColor(String kColor) {
        this.kColor = kColor;
    }
}
