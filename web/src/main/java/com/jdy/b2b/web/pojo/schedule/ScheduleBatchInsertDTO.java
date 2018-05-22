package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;
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
@ApiModel(description = "班期批量插入DTO")
public class ScheduleBatchInsertDTO extends BaseVO{

    @ApiModelProperty("出发时间，yyyy-MM-dd")
    @NotNull
    @NotEmpty
    private List<String> calendars;

    @ApiModelProperty("票信息")
    private List<TicketAddDTO> tickets;

    @ApiModelProperty("车辆信息")
    private List<BusBatchAddDTO> busDTOS;

    @ApiModelProperty("线路ID")
    @NotNull
    private Long sProductId;

    @ApiModelProperty("班期编号")
    @NotNull
    private String sScheduleNo;

    @ApiModelProperty("班期名称")
    private String sScheduleName;

    @ApiModelProperty("车辆数")
    @Min(1)
    private Integer sCarNum=0;

    @ApiModelProperty("每车座位数")
    @Min(1)
    private Integer sCarSeats=0;

    @ApiModelProperty("出发时分")
    private Date sLeaveTime;

    @ApiModelProperty("停售时间")
    @NotNull
    @Min(1)
    private Integer sStopSale;

    @ApiModelProperty("停售类型 0:分钟 1:小时 2:天数")
    @NotNull
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
    private Integer sGroupNum;

    public List<String> getCalendars() {
        return calendars;
    }

    public void setCalendars(List<String> calendars) {
        this.calendars = calendars;
    }

    public List<TicketAddDTO> getTickets() {
        return tickets;
    }

    public void setTickets(List<TicketAddDTO> tickets) {
        this.tickets = tickets;
    }

    public List<BusBatchAddDTO> getBusDTOS() {
        return busDTOS;
    }

    public void setBusDTOS(List<BusBatchAddDTO> busDTOS) {
        this.busDTOS = busDTOS;
    }

    public Long getsProductId() {
        return sProductId;
    }

    public void setsProductId(Long sProductId) {
        this.sProductId = sProductId;
    }

    public String getsScheduleNo() {
        return sScheduleNo;
    }

    public void setsScheduleNo(String sScheduleNo) {
        this.sScheduleNo = sScheduleNo;
    }

    public String getsScheduleName() {
        return sScheduleName;
    }

    public void setsScheduleName(String sScheduleName) {
        this.sScheduleName = sScheduleName;
    }

    public Integer getsCarNum() {
        return sCarNum;
    }

    public void setsCarNum(Integer sCarNum) {
        this.sCarNum = sCarNum;
    }

    public Integer getsCarSeats() {
        return sCarSeats;
    }

    public void setsCarSeats(Integer sCarSeats) {
        this.sCarSeats = sCarSeats;
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
