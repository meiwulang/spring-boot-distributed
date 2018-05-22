package com.jdy.b2b.api.model.designProject;

public class DesignProjectWithBLOBs extends DesignProject {
    private String dpOrderAmount;

    private String dpCoreScenic;

    private String dpStandardAccommodation;

    private String dpMinClusteringNum;

    public String getDpOrderAmount() {
        return dpOrderAmount;
    }

    public void setDpOrderAmount(String dpOrderAmount) {
        this.dpOrderAmount = dpOrderAmount == null ? null : dpOrderAmount.trim();
    }

    public String getDpCoreScenic() {
        return dpCoreScenic;
    }

    public void setDpCoreScenic(String dpCoreScenic) {
        this.dpCoreScenic = dpCoreScenic == null ? null : dpCoreScenic.trim();
    }

    public String getDpStandardAccommodation() {
        return dpStandardAccommodation;
    }

    public void setDpStandardAccommodation(String dpStandardAccommodation) {
        this.dpStandardAccommodation = dpStandardAccommodation == null ? null : dpStandardAccommodation.trim();
    }

    public String getDpMinClusteringNum() {
        return dpMinClusteringNum;
    }

    public void setDpMinClusteringNum(String dpMinClusteringNum) {
        this.dpMinClusteringNum = dpMinClusteringNum == null ? null : dpMinClusteringNum.trim();
    }
}