package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/25 21:15
 */
@ApiModel
public class CardValidateVO extends BaseVO {

    @NotNull
    @NotEmpty
    private List<CardDO> cardList;
    @NotNull
    private Long pid;
    @NotBlank
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
