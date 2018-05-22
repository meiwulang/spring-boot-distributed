package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by dugq on 2018/1/31.
 */
public class ScheduleDepartureStatusDTO{

    @NotNull
    private Long id;

    private Byte departureStatus;

    private Date cancelTime;

    private Long cancelUser;

    @NotEmpty
    private String cancelComment;

    public void setDepartureStatus(Byte departureStatus) {
        this.departureStatus = departureStatus;
    }

    public Date getCancelTime() {
        return cancelTime;
    }

    public void setCancelTime(Date cancelTime) {
        this.cancelTime = cancelTime;
    }

    public Long getCancelUser() {
        return cancelUser;
    }

    public void setCancelUser(Long cancelUser) {
        this.cancelUser = cancelUser;
    }

    public ScheduleDepartureStatusDTO() {
    }

    public ScheduleDepartureStatusDTO(Long id, byte departureStatus) {
        this.id = id;
        this.departureStatus = departureStatus;
    }

    public ScheduleDepartureStatusDTO(Long id, byte departureStatus, String cancelComment) {
        this.id = id;
        this.departureStatus = departureStatus;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte getDepartureStatus() {
        return departureStatus;
    }

    public void setDepartureStatus(byte departureStatus) {
        this.departureStatus = departureStatus;
    }

    public String getCancelComment() {
        return cancelComment;
    }

    public void setCancelComment(String cancelComment) {
        this.cancelComment = cancelComment;
    }
}
