package com.jdy.b2b.web.pojo.productStatistic;

import com.jdy.b2b.web.pojo.StatisticsType;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.exception.ParamUnExpectException;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

import javax.validation.UnexpectedTypeException;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * Created by dugq on 2017/11/16.
 */
public class ListParam implements Serializable {
    private static final long serialVersionUID = -2755224520098101479L;
    @NotNull(message = "no type")
    private Integer type;
    private LocalDate startDate;
    private LocalDate endDate;
    @NotNull(groups = detailList.class,message = "no productId")
    private Long productId;
    //查询条件
    private Long departmentId;
    private Long companyId;
    private Long agentId;
    //接口条件
    private Integer dataLimit; //0:用户级 1:部门级2:单位级3:系统级
    private Integer groupBy;
    private Integer filterBy;


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

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public Integer getDataLimit() {
        return dataLimit;
    }

    public void setDataLimit(Integer dataLimit) {
        this.dataLimit = dataLimit;
    }

    public Integer getGroupBy() {
        return groupBy;
    }

    public void setGroupBy(Integer groupBy) {
        this.groupBy = groupBy;
    }

    public Integer getFilterBy() {
        return filterBy;
    }

    public void setFilterBy(Integer filterBy) {
        this.filterBy = filterBy;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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

    public void init() {
        this.dataLimit = getUser().getuDataLimit();
        initDateByType();
    }

    public void initList(){
        //0:用户级 1:部门级2:单位级3:系统级
        this.filterBy = 0;
        this.groupBy = 0;
        if(this.dataLimit == 0){
            this.agentId = getUser().getUserId();
            this.departmentId = null;
            this.companyId=null;
        }else if(this.dataLimit == 1){
            this.departmentId = getUser().getuDepartmentId();
            this.companyId=null;
            this.agentId = null;
        }else if(this.dataLimit == 2){
            this.departmentId = null;
            this.companyId=getUser().getuCompanyId();
            this.agentId = null;
        }else{
            this.departmentId = null;
            this.companyId=null;
            this.agentId = null;
        }

    }
    public void initDetilList(){
        //0:用户级 1:部门级2:单位级3:系统级
        if(this.dataLimit == 0){
            throw new RuntimeException("暂未实现~~~");
        }else if(this.dataLimit == 1){
            this.filterBy = 1;
            this.groupBy = 2;
            this.departmentId = getUser().getuDepartmentId();
        }else if(this.dataLimit == 2){
            this.filterBy = 1;
            this.groupBy = 12;
            this.companyId=getUser().getuCompanyId();
        }else{
            if(Objects.isNull(this.companyId) && Objects.isNull(this.departmentId)){
                this.filterBy = 1;
                this.groupBy = 3;
            }else if (!Objects.isNull(this.companyId) && Objects.isNull(this.departmentId)){
                this.filterBy = 1;
                this.groupBy = 12;
            }else if (Objects.isNull(this.companyId) && !Objects.isNull(this.departmentId)){
                this.filterBy = 1;
                this.groupBy = 2;
            }
        }
        System.out.println("---------------------------------------------------------");
        System.out.println(this.dataLimit);
        System.out.println(this.filterBy);
        System.out.println(this.groupBy);
        System.out.println("---------------------------------------------------------");
    }

    protected UserResultDTO getUser(){
        Subject subject = SecurityUtils.getSubject();
        UserResultDTO user = (UserResultDTO)subject.getPrincipal();
        return user;
    }

    private void initDateByType() {
        if(Objects.equals(StatisticsType.TOTAL.getValue(),type)){
                startDate =null;
                endDate = null;
        }else if(Objects.equals(StatisticsType.DAY.getValue(),type)){
            if (Objects.isNull(startDate))
                startDate = LocalDate.now();
                endDate = startDate.plusDays(1);
        }else if(Objects.equals(StatisticsType.MONTH.getValue(),type)){
            if (Objects.isNull(startDate)){
                LocalDate now = LocalDate.now();
                startDate = LocalDate.of(now.getYear(),now.getMonthValue(),1);
            }
            endDate = startDate.plusMonths(1);
        }else if(Objects.equals(StatisticsType.TOTAL.getValue(),type)){
            startDate = null;
            endDate = null;
        }else if(Objects.equals(StatisticsType.WEEK.getValue(),type)){
            if (Objects.isNull(startDate)){
                endDate = LocalDate.now();
                startDate = endDate.minusDays(7);
            }else{
                endDate = startDate.plusDays(7);
            }
        }else if(Objects.equals(StatisticsType.SEASON.getValue(),type)){
            endDate = startDate.plusMonths(3);
        }else if(Objects.equals(StatisticsType.YEAR.getValue(),type)){
            endDate = startDate.plusYears(1);
        }else{
            throw new ParamUnExpectException("no such type : "+type);
        }
    }

    public interface detailList {}
}
