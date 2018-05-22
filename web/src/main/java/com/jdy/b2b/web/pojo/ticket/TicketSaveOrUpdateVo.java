package com.jdy.b2b.web.pojo.ticket;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.web.annotation.EffortDay;
import com.jdy.b2b.web.annotation.MyValidator;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

/**
 * Created by yangcheng on 2017/7/3.
 */
@ApiModel("票价新增/保存vo")
public class TicketSaveOrUpdateVo extends BaseVO {
    @ApiModelProperty(value = "票价id,更新必填")
    @NotNull(groups = {Update.class},message = "票价id不能为空")
    private Long id;

    @ApiModelProperty(value = "ascription  0：本地  1：区域")
    private Integer ascription;

    @ApiModelProperty("来自产品管理还是集结管理 产品:true")
    @NotNull(groups = {Save.class},message = "来自产品管理还是集结管理 不能为空")
    private Boolean fromProductListMenu;

    @NotNull(groups = {Save.class},message = "所属公司id不能为空")
    @ApiModelProperty(value = "所属公司id,保存/更新必填")
    private Long tCompanyId;
    @NotNull(groups = {Save.class},message = "产品id不能为空")
    @ApiModelProperty(value = "产品id,保存/更新必填")
    private Long tProductId;
    @NotNull(groups = {Save.class},message = "票类型不能为空")
    @ApiModelProperty(value = "票类型:0:单票,1:套票,保存/更新必填")
    private Integer tTicketType;
    @ApiModelProperty(value = "票价类型:0:成人票,1:儿童票")
    private Integer tType;
    @NotBlank(groups = {Save.class},message = "票价名称不能为空")
    @Length(max=20,groups = {Save.class},message = "票价名称长度最大为20个字")
    @ApiModelProperty(value = "票价名称,保存/更新必填",allowableValues = "range[0,20]")
    private String tName;
    @ApiModelProperty(value = "限制类型 0:无限制 1:实名票 2:限制性别 3:限制年龄")
    @Min(value=0,groups = Save.class,message = "限制类型最小为0")
    @Max(value=3,groups = Save.class,message = "限制类型最大为3")
    private Integer tLimitType;
    @ApiModelProperty(value = "限制条件")
    private String tLimitCondition;
    @ApiModelProperty(value = "票价类目")
    private String tCategory;
    @ApiModelProperty(value = "交通类别 0:飞机 1:火车 2:汽车 3:邮轮,保存/更新必填")
    private Integer tTraffic;
    @NotNull(groups = {Save.class},message = "门市价不能为空")
    @ApiModelProperty(value = "门市价,保存/更新必填")
    private BigDecimal tMarketPrice;
    @NotNull(groups = {Save.class},message = "同行价不能为空")
    @ApiModelProperty(value = "同行价,保存/更新必填")
    private BigDecimal tPeerPrice;

    @ApiModelProperty(value = "内部集结价,保存/更新必填")
    private BigDecimal tGatherPrice;

    @ApiModelProperty(value = "补房差")
    private BigDecimal tPriceAdd;
    @ApiModelProperty(value = "退房差")
    private BigDecimal tPriceReduce;
    @ApiModelProperty(value = "库存")
    private Integer tStock;
    @NotBlank(groups = {Save.class},message = "周几有效不能为空")
    @ApiModelProperty(value = "周几有效0000000,保存/更新必填")
    @EffortDay(groups = {Save.class})
    private String tEffectWeek;
    @Length(max=200,groups = {Save.class},message = "票价简介最长200个字")
    @ApiModelProperty(value = "票价简介")
    private String tIntroduction;
    @ApiModelProperty(value = "源票价ID")
    private Long tSourceId;
    @ApiModelProperty(value = "默认价格 true:false")
    @NotNull(groups = Update.class,message = "修改时默认价格不能为空")
    private Boolean tDefaultPrice;
    @ApiModelProperty(value = "状态 0:有效 1:无效 2:删除")
    @Min(value=0,groups = Save.class,message = "状态最小为0")
    @Max(value=2,groups = Save.class,message = "状态最大为2")
    private Integer tStatus;

    @ApiModelProperty(value = "成人数")
    @Min(value=0,groups = Save.class,message = "成人数最小为0")
    private Integer tAdultNum;//成人数
    @ApiModelProperty(value = "儿童数")
    @Min(value=0,groups = Save.class,message = "儿童数最小为0")
    private Integer tChildNum;//  儿童数

    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;
    @ApiModelProperty(value = "创建者",hidden = true)
    private Long createUser;
    @ApiModelProperty(value = "更新时间",hidden = true)
    private Date updateTime;
    @ApiModelProperty(value = "更新者",hidden = true)
    private Long updateUser;
    @ApiModelProperty(value = "始发站集合")
    private List<TicketDepartureSaveOrUpdateVo> ticketDepartureList = new ArrayList<TicketDepartureSaveOrUpdateVo>();
    @ApiModelProperty(value = "套票关联关系")
    private List<TicketSetSaveOrUpdateVo> sets = new ArrayList<TicketSetSaveOrUpdateVo>();
    //@NotEmpty(groups = Save.class,message = "投放城市集合不能为空")
    @ApiModelProperty(value = "投放城市,保存/更新必填")
    //@Valid
    private List<TicketAreaSaveOrUpdateVo> ticketAreaList = new ArrayList<TicketAreaSaveOrUpdateVo>();

    public Boolean getFromProductListMenu() {
        return fromProductListMenu;
    }

    public void setFromProductListMenu(Boolean fromProductListMenu) {
        this.fromProductListMenu = fromProductListMenu;
    }


    private List<Long> factoryTicketIds;

    private BigDecimal factoryPrice;


    @DateTimeFormat(pattern="yyyy-MM-dd")
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate suitableStartTime;

    @DateTimeFormat(pattern="yyyy-MM-dd")
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate suitableEndTime;

    public BigDecimal getFactoryPrice() {
        return factoryPrice;
    }

    public void setFactoryPrice(BigDecimal factoryPrice) {
        this.factoryPrice = factoryPrice;
    }

    public LocalDate getSuitableStartTime() {
        return suitableStartTime;
    }

    public void setSuitableStartTime(LocalDate suitableStartTime) {
        this.suitableStartTime = suitableStartTime;
    }

    public LocalDate getSuitableEndTime() {
        return suitableEndTime;
    }

    public void setSuitableEndTime(LocalDate suitableEndTime) {
        this.suitableEndTime = suitableEndTime;
    }

    public List<Long> getFactoryTicketIds() {
        return factoryTicketIds;
    }

    public void setFactoryTicketIds(List<Long> factoryTicketIds) {
        this.factoryTicketIds = factoryTicketIds;
    }


    public Integer gettAdultNum() {
        return tAdultNum;
    }

    public void settAdultNum(Integer tAdultNum) {
        this.tAdultNum = tAdultNum;
    }

    public Integer gettChildNum() {
        return tChildNum;
    }

    public void settChildNum(Integer tChildNum) {
        this.tChildNum = tChildNum;
    }

    public Integer getAscription() {
        return ascription;
    }

    public void setAscription(Integer ascription) {
        this.ascription = ascription;
    }

    public BigDecimal gettGatherPrice() {
        return tGatherPrice;
    }

    public void settGatherPrice(BigDecimal tGatherPrice) {
        this.tGatherPrice = tGatherPrice;
    }

    public Boolean gettDefaultPrice() {
        return tDefaultPrice;
    }

    public void settDefaultPrice(Boolean tDefaultPrice) {
        this.tDefaultPrice = tDefaultPrice;
    }

    public List<TicketDepartureSaveOrUpdateVo> getTicketDepartureList() {
        return ticketDepartureList;
    }

    public void setTicketDepartureList(List<TicketDepartureSaveOrUpdateVo> ticketDepartureList) {
        this.ticketDepartureList = ticketDepartureList;
    }

    public List<TicketSetSaveOrUpdateVo> getSets() {
        return sets;
    }

    public void setSets(List<TicketSetSaveOrUpdateVo> sets) {
        this.sets = sets;
    }

    public List<TicketAreaSaveOrUpdateVo> getTicketAreaList() {
        return ticketAreaList;
    }

    public void setTicketAreaList(List<TicketAreaSaveOrUpdateVo> ticketAreaList) {
        this.ticketAreaList = ticketAreaList;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long gettCompanyId() {
        return tCompanyId;
    }

    public void settCompanyId(Long tCompanyId) {
        this.tCompanyId = tCompanyId;
    }

    public Long gettProductId() {
        return tProductId;
    }

    public void settProductId(Long tProductId) {
        this.tProductId = tProductId;
    }

    public Integer gettTicketType() {
        return tTicketType;
    }

    public void settTicketType(Integer tTicketType) {
        this.tTicketType = tTicketType;
    }

    public Integer gettType() {
        return tType;
    }

    public void settType(Integer tType) {
        this.tType = tType;
    }

    public String gettName() {
        return tName;
    }

    public void settName(String tName) {
        this.tName = tName == null ? null : tName.trim();
    }

    public Integer gettLimitType() {
        return tLimitType;
    }

    public void settLimitType(Integer tLimitType) {
        this.tLimitType = tLimitType;
    }

    public String gettLimitCondition() {
        return tLimitCondition;
    }

    public void settLimitCondition(String tLimitCondition) {
        this.tLimitCondition = tLimitCondition == null ? null : tLimitCondition.trim();
    }

    public String gettCategory() {
        return tCategory;
    }

    public void settCategory(String tCategory) {
        this.tCategory = tCategory == null ? null : tCategory.trim();
    }

    public Integer gettTraffic() {
        return tTraffic;
    }

    public void settTraffic(Integer tTraffic) {
        this.tTraffic = tTraffic;
    }

    public BigDecimal gettMarketPrice() {
        return tMarketPrice;
    }

    public void settMarketPrice(BigDecimal tMarketPrice) {
        this.tMarketPrice = tMarketPrice;
    }

    public BigDecimal gettPeerPrice() {
        return tPeerPrice;
    }

    public void settPeerPrice(BigDecimal tPeerPrice) {
        this.tPeerPrice = tPeerPrice;
    }

    public BigDecimal gettPriceAdd() {
        return tPriceAdd;
    }

    public void settPriceAdd(BigDecimal tPriceAdd) {
        this.tPriceAdd = tPriceAdd;
    }

    public BigDecimal gettPriceReduce() {
        return tPriceReduce;
    }

    public void settPriceReduce(BigDecimal tPriceReduce) {
        this.tPriceReduce = tPriceReduce;
    }

    public Integer gettStock() {
        return tStock;
    }

    public void settStock(Integer tStock) {
        this.tStock = tStock;
    }

    public String gettEffectWeek() {
        return tEffectWeek;
    }

    public void settEffectWeek(String tEffectWeek) {
        this.tEffectWeek = tEffectWeek == null ? null : tEffectWeek.trim();
    }

    public String gettIntroduction() {
        return tIntroduction;
    }

    public void settIntroduction(String tIntroduction) {
        this.tIntroduction = tIntroduction == null ? null : tIntroduction.trim();
    }

    public Long gettSourceId() {
        return tSourceId;
    }

    public void settSourceId(Long tSourceId) {
        this.tSourceId = tSourceId;
    }

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }
}
