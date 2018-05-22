package com.jdy.b2b.web.pojo.electroniccontract;

/**
 * Created by zhangfofa on 2017/12/14.
 */
public class GenerateContractNeedInfo {
    private String contractNo;

    private String docTitle;

    private String templateNo;

    private String fontSize;

    private String fontType;

    private String signKeyWord;

    private String keyWordStrategy;

    private String parameterJsonString;

    private String dynamicTables;

    public String getContractNo() {
        return contractNo;
    }

    public void setContractNo(String contractNo) {
        this.contractNo = contractNo;
    }

    public String getDocTitle() {
        return docTitle;
    }

    public void setDocTitle(String docTitle) {
        this.docTitle = docTitle;
    }

    public String getTemplateNo() {
        return templateNo;
    }

    public void setTemplateNo(String templateNo) {
        this.templateNo = templateNo;
    }

    public String getFontSize() {
        return fontSize;
    }

    public void setFontSize(String fontSize) {
        this.fontSize = fontSize;
    }

    public String getFontType() {
        return fontType;
    }

    public void setFontType(String fontType) {
        this.fontType = fontType;
    }

    public String getSignKeyWord() {
        return signKeyWord;
    }

    public void setSignKeyWord(String signKeyWord) {
        this.signKeyWord = signKeyWord;
    }

    public String getKeyWordStrategy() {
        return keyWordStrategy;
    }

    public void setKeyWordStrategy(String keyWordStrategy) {
        this.keyWordStrategy = keyWordStrategy;
    }

    public String getParameterJsonString() {
        return parameterJsonString;
    }

    public void setParameterJsonString(String parameterJsonString) {
        this.parameterJsonString = parameterJsonString;
    }

    public String getDynamicTables() {
        return dynamicTables;
    }

    public void setDynamicTables(String dynamicTables) {
        this.dynamicTables = dynamicTables;
    }
}
