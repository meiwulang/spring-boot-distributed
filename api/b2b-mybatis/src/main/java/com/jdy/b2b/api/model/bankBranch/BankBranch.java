package com.jdy.b2b.api.model.bankBranch;

public class BankBranch {
    private Integer bbId;

    private String bbName;

    private String bbNumber;

    private Integer bbBaId;

    private Integer bbPId;

    private Integer bbCId;

    private Integer bbCoId;

    public Integer getBbId() {
        return bbId;
    }

    public void setBbId(Integer bbId) {
        this.bbId = bbId;
    }

    public String getBbName() {
        return bbName;
    }

    public void setBbName(String bbName) {
        this.bbName = bbName == null ? null : bbName.trim();
    }

    public String getBbNumber() {
        return bbNumber;
    }

    public void setBbNumber(String bbNumber) {
        this.bbNumber = bbNumber == null ? null : bbNumber.trim();
    }

    public Integer getBbBaId() {
        return bbBaId;
    }

    public void setBbBaId(Integer bbBaId) {
        this.bbBaId = bbBaId;
    }

    public Integer getBbPId() {
        return bbPId;
    }

    public void setBbPId(Integer bbPId) {
        this.bbPId = bbPId;
    }

    public Integer getBbCId() {
        return bbCId;
    }

    public void setBbCId(Integer bbCId) {
        this.bbCId = bbCId;
    }

    public Integer getBbCoId() {
        return bbCoId;
    }

    public void setBbCoId(Integer bbCoId) {
        this.bbCoId = bbCoId;
    }
}