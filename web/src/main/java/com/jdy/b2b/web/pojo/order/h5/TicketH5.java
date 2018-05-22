package com.jdy.b2b.web.pojo.order.h5;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;
import java.util.Map;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/27 14:10
 */
@ApiModel(description = "购票信息")
public class TicketH5 {

    @ApiModelProperty(value = "票id")
    private Long id;
    @ApiModelProperty(value = "名称")
    private String name;
    @ApiModelProperty(value = "数量")
    private Integer num;
    @ApiModelProperty(value = "房间数")
    private Integer roomNum;
    @ApiModelProperty(value = "单票接送信息")
    private List<TouristDepartsH5> seat;
    @ApiModelProperty(value = "套票信息")
    private Map<Long, TicketH5> list;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public Integer getRoomNum() {
        return roomNum;
    }

    public void setRoomNum(Integer roomNum) {
        this.roomNum = roomNum;
    }

    public List<TouristDepartsH5> getSeat() {
        return seat;
    }

    public void setSeat(List<TouristDepartsH5> seat) {
        this.seat = seat;
    }

    public Map<Long, TicketH5> getList() {
        return list;
    }

    public void setList(Map<Long, TicketH5> list) {
        this.list = list;
    }
}
