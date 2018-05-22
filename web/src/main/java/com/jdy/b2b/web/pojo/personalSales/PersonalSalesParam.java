package com.jdy.b2b.web.pojo.personalSales;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.web.pojo.StatisticsType;
import com.jdy.b2b.web.util.exception.ParamUnExpectException;
import io.swagger.models.auth.In;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * Created by dugq on 2017/12/18.
 */
public class PersonalSalesParam implements Serializable{
    private static final long serialVersionUID = 4731267742404901100L;
    private Integer type;
    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private Integer identityLevel;
    private Integer dataLimit;
    private Long companyId;
    private Long departmentId;


    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Integer getDataLimit() {
        return dataLimit;
    }

    public void setDataLimit(Integer dataLimit) {
        this.dataLimit = dataLimit;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getIdentityLevel() {
        return identityLevel;
    }

    public void setIdentityLevel(Integer identityLevel) {
        this.identityLevel = identityLevel;
    }

    public void initDateByType() {
        if(Objects.isNull(identityLevel)){
            throw new ParamUnExpectException(" no identityLevel");
        }
        if (Objects.isNull(startDate))
            startDate = LocalDate.now();

        if(Objects.equals(StatisticsType.TOTAL.getValue(),type)){
            startDate =null;
            endDate = null;
        }else if(Objects.equals(StatisticsType.DAY.getValue(),type)){
            if(Objects.isNull(endDate)){
                endDate = startDate.plusDays(1);
            }else{
                endDate = endDate.plusDays(1);
            }
        }else if(Objects.equals(StatisticsType.MONTH.getValue(),type)){
            endDate = startDate.plusMonths(1);
        }else if(Objects.equals(StatisticsType.TOTAL.getValue(),type)){
            startDate = null;
            endDate = null;
        }else if(Objects.equals(StatisticsType.WEEK.getValue(),type)){
                endDate = startDate.plusDays(7);
        }else if(Objects.equals(StatisticsType.SEASON.getValue(),type)){
            endDate = startDate.plusMonths(3);
        }else if(Objects.equals(StatisticsType.YEAR.getValue(),type)){
            endDate = startDate.plusYears(1);
        }else{
            throw new ParamUnExpectException(" no such type : "+type);
        }
    }

}
