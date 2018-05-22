package com.jdy.b2b.api.model.agentStatistics;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.util.CollectionUtils;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2017/11/9.
 */
public class AgentStatistics extends BaseAgentStatistics implements Serializable{

    private static final long serialVersionUID = 4848770366630553099L;

    private Long companyId;
    private Long departmentId;
    private Long agentId;
    private String departmentName;
    private String companyName;
    private String principal;
    //今天总数
    private Integer num = 0;
    //历史总数，包括今天
    private Integer totalNum;
    private List<AgentStatistics> children;
    /**
     * time和shortTime都是代理人的创建时间，一个针对年月日操作，一个针对时分秒操作
     */
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate time;

    private String agentName;

    @DateTimeFormat(pattern="HH:mm")
    @JsonFormat(pattern="HH:mm")
    private LocalTime shortTime;
    private Long firstAgentId;


    public AgentStatistics() {
    }

    public AgentStatistics(Integer num,LocalDate time) {
        this.num = num;
        this.time = time;
    }

    /**
     * 计算下线代理人总数，包括自己
     * @param param
     * @return
     */
    public int countNumIncludeSelf(AgentStatisticsPram param){
         countChildrenNum(param);
        //如果自己符合条件也计算在内
        if(isTimeInRange(param.getStartTime(),param.getEndTime()) && isDateInRange(param.getStartDate(),param.getEndDate())){
            this.num+=1;
        }
        return this.num;
    }

    public Long getFirstAgentId() {
        return firstAgentId;
    }

    public void setFirstAgentId(Long firstAgentId) {
        this.firstAgentId = firstAgentId;
    }

    /**
     * 计算下线代理人总数，不包括自己
     * @param param
     * @return
     */
    public int countChildrenNum(AgentStatisticsPram param){
        if(CollectionUtils.isEmpty(children)){
            return 0;
        }
        this.num = children.stream().reduce(0,(acc,agent)-> {
            if(agent.isTimeInRange(param.getStartTime(),param.getEndTime()) && agent.isDateInRange(param.getStartDate(),param.getEndDate())){
                acc+=1;
            }
            acc+=agent.countChildrenNum(param);
            return acc;
        },(left, right)->left+right);
        return this.num;
    }

    // startDate or endTIme == null or (startDate <= this.time < endDate)
    public boolean isDateInRange(LocalDate startDate, LocalDate endDate){
        if(Objects.isNull(this.time)){
            System.out.println(this.agentName);
        }
        if(Objects.isNull(startDate) || Objects.isNull(endDate))
            return true;
        if(startDate.isAfter(this.time))
            return false;
        return endDate.isAfter(this.time);
    }


    public boolean isTimeInRange(LocalTime startTime, LocalTime endTime){
        if(Objects.isNull(startTime) || Objects.isNull(endTime))
            return true;
        if(startTime.isAfter(this.shortTime))
            return false;
        return endTime.isAfter(this.shortTime);
    }


    public List<AgentStatistics> allChildren(){
        LinkedList list = new LinkedList();
        if(CollectionUtils.isEmpty(this.children)){
            return list;
        }
        list.addAll(this.children);
        this.children.forEach(agents -> list.addAll(agents.allChildren()));
        return list;
    }

    public List<AgentStatistics> allChildrenIncludeSelf(){
        List list = allChildren();
        list.add(this);
        return list;
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public LocalTime getShortTime() {
        return shortTime;
    }

    public void setShortTime(LocalTime shortTime) {
        this.shortTime = shortTime;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }


    public Integer getTotalNum() {
        return totalNum;
    }

    public void setTotalNum(Integer totalNum) {
        this.totalNum = totalNum;
    }

    public List<AgentStatistics> getChildren() {
        return children;
    }

    public void setChildren(List<AgentStatistics> children) {
        this.children = children;
    }

    public LocalDate getTime() {
        return time;
    }

    public void setTime(LocalDate time) {
        this.time = time;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getPrincipal() {
        return principal;
    }

    public void setPrincipal(String principal) {
        this.principal = principal;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
