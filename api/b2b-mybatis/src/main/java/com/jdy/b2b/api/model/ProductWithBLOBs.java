package com.jdy.b2b.api.model;

import com.jdy.b2b.api.model.product.Product;

public class ProductWithBLOBs extends Product {
    private String pSpecial;

    private String pCostInclude;

    private String pCostExclude;

    private String pNotes;

    private String pVisa;

    public String getpSpecial() {
        return pSpecial;
    }

    public void setpSpecial(String pSpecial) {
        this.pSpecial = pSpecial == null ? null : pSpecial.trim();
    }

    public String getpCostInclude() {
        return pCostInclude;
    }

    public void setpCostInclude(String pCostInclude) {
        this.pCostInclude = pCostInclude == null ? null : pCostInclude.trim();
    }

    public String getpCostExclude() {
        return pCostExclude;
    }

    public void setpCostExclude(String pCostExclude) {
        this.pCostExclude = pCostExclude == null ? null : pCostExclude.trim();
    }

    public String getpNotes() {
        return pNotes;
    }

    public void setpNotes(String pNotes) {
        this.pNotes = pNotes == null ? null : pNotes.trim();
    }

    public String getpVisa() {
        return pVisa;
    }

    public void setpVisa(String pVisa) {
        this.pVisa = pVisa == null ? null : pVisa.trim();
    }
}