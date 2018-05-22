package com.jdy.b2b.web.pojo.order;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/26 15:07
 */
public class CardDO {
    @NotNull
    private String cardNo;
    @NotNull
    private String pass;

    public String getCardNo() {
        return cardNo;
    }

    public void setCardNo(String cardNo) {
        this.cardNo = cardNo;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }
}
