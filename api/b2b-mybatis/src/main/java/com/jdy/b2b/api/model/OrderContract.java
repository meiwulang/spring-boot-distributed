package com.jdy.b2b.api.model;

import com.jdy.b2b.api.model.electroniccontract.SignContractInfoBaseVO;

import java.util.Objects;

import static org.apache.commons.lang3.time.DateFormatUtils.format;

/**
 * Created by ASUS on 2017/12/14.
 */
public class OrderContract extends SignContractInfoBaseVO {

    private static final String format = "yyyy-MM-dd HH:mm:ss";
    private String signName;

    private String companySignContractTimeStr;

    private String customerSignContractTimeStr;

    private String createTimeStr;

    private String updateTimeStr;

    public String getSignName() {
        return signName;
    }

    public void setSignName(String signName) {
        this.signName = signName;
    }

    public String getCompanySignContractTimeStr() {
        if (Objects.nonNull(getCompanySignContractTime())) {
            companySignContractTimeStr = format(getCompanySignContractTime(), format);
        }
        return companySignContractTimeStr;
    }

    public void setCompanySignContractTimeStr(String companySignContractTimeStr) {
        this.companySignContractTimeStr = companySignContractTimeStr;
    }

    public String getCustomerSignContractTimeStr() {
        if (Objects.nonNull(getCustomerSignContractTime())) {
            customerSignContractTimeStr = format(getCustomerSignContractTime(), format);
        }
        return customerSignContractTimeStr;
    }

    public void setCustomerSignContractTimeStr(String customerSignContractTimeStr) {
        this.customerSignContractTimeStr = customerSignContractTimeStr;
    }

    public String getCreateTimeStr() {
        if (Objects.nonNull(getCreateTime())) {
            createTimeStr = format(getCreateTime(), format);
        }
        return createTimeStr;
    }

    public void setCreateTimeStr(String createTimeStr) {
        this.createTimeStr = createTimeStr;
    }

    public String getUpdateTimeStr() {
        if (Objects.nonNull(getUpdateTime())) {
            updateTimeStr = format(getUpdateTime(), format);
        }
        return updateTimeStr;
    }

    public void setUpdateTimeStr(String updateTimeStr) {
        this.updateTimeStr = updateTimeStr;
    }
}
