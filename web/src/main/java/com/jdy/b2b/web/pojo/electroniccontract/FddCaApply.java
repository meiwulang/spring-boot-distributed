package com.jdy.b2b.web.pojo.electroniccontract;

/**
 * Created by zhangfofa on 2017/12/13.
 */
public class FddCaApply {
    //客户姓名
    private String customerName;

    //邮箱
    private String email;

    //证件类型
    private String identType;

    //证件号码
    private String identNumber;

    //手机号码
    private String mobileNumber;

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getIdentType() {
        return identType;
    }

    public void setIdentType(String identType) {
        this.identType = identType;
    }

    public String getIdentNumber() {
        return identNumber;
    }

    public void setIdentNumber(String identNumber) {
        this.identNumber = identNumber;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    @Override
    public String toString() {
        return "FddCaApply{" +
                "customerName='" + customerName + '\'' +
                ", email='" + email + '\'' +
                ", identType='" + identType + '\'' +
                ", identNumber='" + identNumber + '\'' +
                ", mobileNumber='" + mobileNumber + '\'' +
                '}';
    }
}
