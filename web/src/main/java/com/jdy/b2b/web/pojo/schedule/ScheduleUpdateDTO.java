package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/2 10:42
 */
@ApiModel(description = "班期更新DTO")
public class ScheduleUpdateDTO extends BaseVO{

    @ApiModelProperty("票信息是否有修改，便于判断操作")
    private Boolean ticketsChanged;

    @ApiModelProperty("来自产品管理还是集结管理 产品:true")
    private Boolean fromProductListMenu;

    @ApiModelProperty("票信息")
    @Valid
    private List<TicketAddDTO> tickets;

    @ApiModelProperty("主键id")
    @NotNull
    private Long id;

    @ApiModelProperty("班期名称")
    private String sScheduleName;

    @ApiModelProperty("出发时分")
    private Date sLeaveTime;

    @ApiModelProperty("停售时间")
    @Min(1)
    private Integer sStopSale;

    @ApiModelProperty("停售类型 0:分钟 1:小时 2:天数")
    @Range(min = 0, max = 2)
    private Integer sStopType;

    @ApiModelProperty("虚拟已售数")
    @Min(0)
    private Integer sShamNum;

    @ApiModelProperty("是否打印0:打印 1:不打印")
    private Boolean sPrint;

    @ApiModelProperty("入座方式 0:不对号入座 1:对号入座(系统随机) 2:对号入座(人工选择)")
    @Range(min = 0, max = 2)
    private Integer sSitType;

    @ApiModelProperty("成团人数")
    @Min(1)
    private Integer sGroupNum;

    private Integer flag;

    public Boolean getFromProductListMenu() {
        return fromProductListMenu;
    }

    public void setFromProductListMenu(Boolean fromProductListMenu) {
        this.fromProductListMenu = fromProductListMenu;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Boolean getTicketsChanged() {
        return ticketsChanged;
    }

    public void setTicketsChanged(Boolean ticketsChanged) {
        this.ticketsChanged = ticketsChanged;
    }

    public List<TicketAddDTO> getTickets() {
        return tickets;
    }

    public void setTickets(List<TicketAddDTO> tickets) {
        this.tickets = tickets;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getsScheduleName() {
        return sScheduleName;
    }

    public void setsScheduleName(String sScheduleName) {
        this.sScheduleName = sScheduleName;
    }

    public Date getsLeaveTime() {
        return sLeaveTime;
    }

    public void setsLeaveTime(Date sLeaveTime) {
        this.sLeaveTime = sLeaveTime;
    }

    public Integer getsStopSale() {
        return sStopSale;
    }

    public void setsStopSale(Integer sStopSale) {
        this.sStopSale = sStopSale;
    }

    public Integer getsStopType() {
        return sStopType;
    }

    public void setsStopType(Integer sStopType) {
        this.sStopType = sStopType;
    }

    public Integer getsShamNum() {
        return sShamNum;
    }

    public void setsShamNum(Integer sShamNum) {
        this.sShamNum = sShamNum;
    }

    public Boolean getsPrint() {
        return sPrint;
    }

    public void setsPrint(Boolean sPrint) {
        this.sPrint = sPrint;
    }

    public Integer getsSitType() {
        return sSitType;
    }

    public void setsSitType(Integer sSitType) {
        this.sSitType = sSitType;
    }

    public Integer getsGroupNum() {
        return sGroupNum;
    }

    public void setsGroupNum(Integer sGroupNum) {
        this.sGroupNum = sGroupNum;
    }

}
