package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.common.BaseVO;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/25 21:15
 */
public class CardValidateVO extends BaseVO {

    private List<CardDO> cardList;
    private Long pid;
    private String appletId;//小程序openid

    public CardValidateVO() {
    }

    public CardValidateVO(List<CardDO> cardList, Long pid) {
        this.cardList = cardList;
        this.pid = pid;
    }

    public List<CardDO> getCardList() {
        return cardList;
    }

    public void setCardList(List<CardDO> cardList) {
        this.cardList = cardList;
    }

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public String getAppletId() {
        return appletId;
    }

    public void setAppletId(String appletId) {
        this.appletId = appletId;
    }
}
