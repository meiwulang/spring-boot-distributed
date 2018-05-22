package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.OneTuple;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.agentStatistics.*;
import com.jdy.b2b.api.service.AgentStatisticsService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2017/11/9.
 * 代理人统计管理
 */
@RestController
@RequestMapping("agentStatisticsManagement")
public class AgentStatisticsManagementController {
    @Autowired
    private AgentStatisticsService agentStatisticsService;


    /**
     * 代理拓展统计报表 总计
     *
     * @param param
     * @return
     */
//    @RequestMapping("totalAgentNumberStatisticsGroupByDepartment")
    @Deprecated
    public ResultBean totalAgentNumberStatisticsGroupByDepartment(@RequestBody AgentStatisticsPram param) {
        param.setpId((long) 0);
        List<AgentStatistics> agentStatistics = agentStatisticsService.selectTotalAgentNumGroupByDepartment(param);
        final int[] total = {0};
        agentStatistics.forEach(agent -> {
            int num = agent.getNum() + getChildrenNum(agent.getChildren());
            agent.setNum(num);
            total[0] += num;
            if (StringUtils.isBlank(agent.getPrincipal())) {
                agent.setPrincipal("");
            }
        });
        agentStatistics.sort(Comparator.comparingInt(agent -> -agent.getNum()));
        Map map = new HashMap();
        map.put("list", agentStatistics);
        map.put("total", total[0]);
        ResultBean successResult = ResultBean.getSuccessResult(map);
        successResult.setCode("200");
        return successResult;
    }

    /**
     * 代理拓展统计报表 月统计和日统计
     *
     * @param param
     * @return
     */
//    @RequestMapping("newAgentNumberStatisticsByDepartment")
    @Deprecated
    public ResultBean newAgentNumberStatisticsByDepartment(@RequestBody AgentStatisticsPram param) {
        param.setpId((long) 0);
        List<AgentStatistics> agentStatistics = agentStatisticsService.selectNewAgentNumGroupByDepartmentAndTime(param);
        final int[] total = {0};
        agentStatistics.forEach(agent -> {
            int num = agent.getNum() + getChildrenNum(agent.getChildren());
            agent.setNum(num);
            total[0] += num;
            if (StringUtils.isBlank(agent.getPrincipal())) {
                agent.setPrincipal("");
            }
//            agent.setChildren(null);
        });
        agentStatistics.sort(Comparator.comparingInt(agent -> -agent.getNum()));
        Map map = new HashMap();
        map.put("list", agentStatistics);
        map.put("total", total[0]);
        ResultBean successResult = ResultBean.getSuccessResult(map);
        successResult.setCode("200");
        return successResult;
    }

    /**
     * 按部门查询所有员工的下线
     *
     * @param param
     * @return
     */
//    @RequestMapping("totalAgentNumberInDepartmentGroupByAgent")
    @Deprecated
    public ResultBean totalAgentNumberInDepartmentGroupByAgent(@RequestBody AgentStatisticsPram param) {
        List<AgentStatisticsOfAgent> agentStatistics = agentStatisticsService.selectotalAgentNumberInDepartmentGroupByAgent(param);
        final int[] total = {0};
        agentStatistics.forEach(agent -> {
            if (Objects.isNull(param.getStartDate()) || (param.getStartDate().isBefore(agent.getCreateTime()) && param.getEndDate().isAfter(agent.getCreateTime()))) {
                agent.setNum(getAgentChildrenNum(agent.getChildren()) + 1);
            } else {
                agent.setNum(getAgentChildrenNum(agent.getChildren()));
            }
            total[0] += agent.getNum();
            agent.setChildren(null);
        });
        agentStatistics.sort(Comparator.comparingInt(agent -> -agent.getNum()));
        Map map = new HashMap();
        map.put("list", agentStatistics);
        map.put("total", total[0]);
        ResultBean successResult = ResultBean.getSuccessResult(map);
        successResult.setCode("200");
        return successResult;
    }

    @Deprecated
    public int getAgentChildrenNum(List<AgentStatisticsOfAgent> children) {
        if (CollectionUtils.isEmpty(children)) {
            return 0;
        }
        final int[] num = {children.size()};
        children.forEach(agentStatistics -> {
            num[0] = num[0] + getAgentChildrenNum(agentStatistics.getChildren());

        });
        return num[0];
    }

    @Deprecated
    public int getChildrenNum(List<AgentStatistics> children) {
        if (CollectionUtils.isEmpty(children)) {
            return 0;
        }
        final int[] num = {0};
        children.forEach(agentStatistics -> {
            num[0] = num[0] + agentStatistics.getNum() + getChildrenNum(agentStatistics.getChildren());

        });
        return num[0];
    }

    //    @RequestMapping("agentStatisticsGroupByDepartment")
    @Deprecated
    public ResultBean agentStatisticsGroupByDepartment(@RequestBody AgentStatisticsPram param) {
        List<AgentStatistics> agentStatistics = agentStatisticsService.agentStatisticsGroupByDepartment(param);
        LinkedList<AgentStatistics> reduce = agentStatistics.stream().reduce(new LinkedList<AgentStatistics>(), (acc, agent) -> {
            if (agent.getNum() > 0) acc.add(agent);
            return acc;
        }, (left, right) -> {
            left.addAll(right);
            return left;
        });
        reduce.sort(Comparator.comparingInt(agent -> -agent.getNum()));
        int total = agentStatistics.stream().reduce(0, (acc, agent) -> acc + agent.getNum(), (left, right) -> left + right);
        Map map = new HashMap();
        map.put("list", reduce);
        map.put("total", total);
        ResultBean successResult = ResultBean.getSuccessResult(map);
        successResult.setCode("200");
        return successResult;
    }

    //    @RequestMapping("agentStatisticsByDepartmentIdGroupByAgent")
    @Deprecated
    public ResultBean selectAgentsNumByDepartmentIdGroupByAgent(@RequestBody AgentStatisticsPram param) {
        List<AgentStatisticsOfAgent> agentStatisticsOfAgents = agentStatisticsService.selectAgentsNumByDepartmentIdGroupByAgent(param);
        LinkedList<AgentStatisticsOfAgent> reduce = agentStatisticsOfAgents.stream().reduce(new LinkedList<AgentStatisticsOfAgent>(), (acc, agent) -> {
            if (agent.getNum() > 0) acc.add(agent);
            return acc;
        }, (left, right) -> {
            left.addAll(right);
            return left;
        });
        reduce.sort(Comparator.comparingInt(agent -> -agent.getNum()));
        int total = agentStatisticsOfAgents.stream().reduce(0, (acc, agent) -> acc + agent.getNum(), (left, right) -> left + right);
        Map map = new HashMap();
        map.put("list", reduce);
        map.put("total", total);
        ResultBean successResult = ResultBean.getSuccessResult(map);
        successResult.setCode("200");
        return successResult;
    }

    /*-------------------------------------------------------上面的代码作废------------------------------------------------------------------------*/
    /*-------------------------------------------------------2017-12-08版本------------------------------------------------------------------------*/
    /*-------------------------------------------------------2017-12-08版本------------------------------------------------------------------------*/
    /*-------------------------------------------------------2017-12-08版本------------------------------------------------------------------------*/
    /*-------------------------------------------------------2017-12-08版本------------------------------------------------------------------------*/

    /**
     * 单位级代理人统计 按部门分组
     *
     * @param param
     * @return
     */
    @RequestMapping("companyLevelGroupByDepartment")
    public ResultBean selectFirstLevelAgent(@RequestBody AgentStatisticsPram param) {
        OneTuple<Integer> total = new OneTuple(0);
        // 一级代理人列表
        List<AgentStatistics> agentStatistics = agentStatisticsService.selectFirstLevelAgent(param);

        //遍历一级代理人计算每个人的下线个数，并剔除下级代理人数为0的一级代理人 ，同时计算总数
        Predicate<AgentStatistics> agentStatisticsPredicate = agent -> {
            int num = agent.countNumIncludeSelf(param);
            total.setA(total.getA() + num);
            return num > 0;
        };
        List<AgentStatistics> reduce = agentStatistics.stream().filter(agentStatisticsPredicate).collect(Collectors.toList());
        // 构建部门列表
        List<AgentStatisticsGroupByDepartment> list = new LinkedList<>();
        //将一级代理人按部门分组
        Map<Long, List<AgentStatistics>> collect = reduce.stream().collect(Collectors.groupingBy(agent -> agent.getDepartmentId()));
        //遍历按部门分组后的map，根据一级代理人集合构建新的部门并加入的部门列表
        collect.forEach((id, agents) -> {
            AgentStatisticsGroupByDepartment agent = new AgentStatisticsGroupByDepartment(agents);
            list.add(agent);
        });
        list.sort(Comparator.comparingInt(agent->-agent.getNum() ));
        return builderResultBean(total, list);
    }

    /**
     * 部门代理人统计 按人员分组
     *
     * @param param
     * @return
     */
    @RequestMapping("departmentLevelGroupByAgent")
    public ResultBean departmentLevelGroupByAgent(@RequestBody AgentStatisticsPram param) {
        OneTuple<Integer> total = new OneTuple(0);
        // 一级代理人列表
        List<AgentStatistics> agentStatistics = agentStatisticsService.selectFirstLevelAgent(param);
        List<AgentStatistics> list = agentStatistics.stream().filter(agent -> {
            int num = agent.countNumIncludeSelf(param);
            total.setA(total.getA() + num);
            return num > 0;
        }).collect(Collectors.toList());
        list.sort(Comparator.comparingInt(agent->-agent.getNum() ));
        return builderResultBean(total, list);
    }

    /**
     * 某部门某一级代理人的下线统计  按时间分组
     *
     * @param param
     * @return
     */
    @RequestMapping("agentLevelGroupByTime")
    public ResultBean agentLevelGroupByTime(@RequestBody AgentStatisticsPram param) {
        //    逻辑和  companyLevelGroupByTime 接口一样 ： 不关注代理人，1、按条件查询出符合条件的代理人 2、过滤不在使时间范围内的代理人 3、按时间分组  ！！！！差别在于查询代理人时条件不同
      return countByDepartmentIdGroupByTime(param);
    }

    /**
     * 单位级代理人统计 按时间分组
     *
     * @param param
     * @return
     */
    @RequestMapping("companyLevelGroupByTime")
    public ResultBean countByDepartmentIdGroupByTime(@RequestBody AgentStatisticsPram param) {
        OneTuple<Integer> total = new OneTuple(0);
        // 一级代理人列表
        List<AgentStatistics> agentStatistics = agentStatisticsService.selectFirstLevelAgent(param);

        //过滤掉不在日期范围内的代理人,并按照时间分组
        Predicate<AgentStatistics> filterConditions = agent -> {agent.setChildren(null); return agent.isDateInRange(param.getStartDate(), param.getEndDate());};
        Collector<AgentStatistics, ?, Map<Integer, List<AgentStatistics>>> groupConditions = StatisticsType.ofValue(param.getType()).groupBy();
        Map<Integer, List<AgentStatistics>> agentsGroupByTime = agentStatistics.stream().flatMap(agents -> agents.allChildrenIncludeSelf().stream()).filter(filterConditions).collect(groupConditions);

        // 构建时间列表
        PriorityQueue<AgentStatisticsGroupByTime> list = new PriorityQueue<>(Comparator.comparingInt(AgentStatisticsGroupByTime::getDesNum));
        agentsGroupByTime.forEach((key, value) -> {
            AgentStatisticsGroupByTime agent = StatisticsType.ofValue(param.getType()).builderAgentStatistics(key,value);
            total.setA(total.getA() + value.size());
            list.add(agent);
        });
        return builderResultBean(total, list);
    }




    /**
     * 时间段代理人统计 按部门分组
     * @param param
     * @return
     */
    @RequestMapping("timeLevelGroupByDepartment")
    public ResultBean timeLevelGroupByDepartment(@RequestBody AgentStatisticsPram param) {
        OneTuple<Integer> total = new OneTuple(0);
        // 一级代理人列表
        List<AgentStatistics> agentStatistics = agentStatisticsService.selectFirstLevelAgent(param);

        //过滤掉不在日期范围内或者不在时间段内的代理人,并按照时间分组
        Predicate<AgentStatistics> filterConditions = agent -> agent.countNumIncludeSelf(param)>0;
        Collector<AgentStatistics, ?, Map<Long, List<AgentStatistics>>> groupConditions = Collectors.groupingBy(agent -> agent.getDepartmentId());
        Map<Long, List<AgentStatistics>> agentsGroupByTime = agentStatistics.stream().filter(filterConditions).collect(groupConditions);

        // 构建部门列表
        PriorityQueue<AgentStatisticsGroupByDepartment> list = new PriorityQueue<>(Comparator.comparingInt(AgentStatisticsGroupByDepartment::descNum));
        agentsGroupByTime.forEach((key, value) -> {
            AgentStatisticsGroupByDepartment department = new AgentStatisticsGroupByDepartment(value);
            int num = value.stream().reduce(0,(acc,agent)->acc+agent.getNum(),(left,right)->left+right);
            total.setA(total.getA() + num);
            list.add(department);
        });
        return builderResultBean(total, list);
    }


    /**
     * 某时间段某部门代理人统计  按一级代理人分组
     * @param param
     * @return
     */
    @RequestMapping("timeLevelGroupByAgent")
    public ResultBean timeLevelGroupByAgent(@RequestBody AgentStatisticsPram param) {
       return departmentLevelGroupByAgent(param);
    }

    /**
     * 构建请求成功的返回值
     * @param total  总数
     * @param list  列表
     * @param <T>  列表的泛型
     * @return  结果
     */
    private <T> ResultBean builderResultBean(OneTuple<Integer> total, Collection<T> list) {
        Map map = new HashMap();
        map.put("list", list);
        map.put("total", total.getA());
        ResultBean successResult = ResultBean.getSuccessResult(map);
        successResult.setCode("200");
        return successResult;
    }

    /**
     * 系统级代理人统计 按子公司和一级部门分组
     * @param param
     * @return
     */
    @RequestMapping("systemLevelGroupByChildCompanyOrFirstDepart")
    public ResultBean systemLevelGroupByChildCompanyOrFirstDepart(@RequestBody AgentStatisticsPram param){
        OneTuple<Integer> total = new OneTuple(0);
        // 一级代理人列表,属性中含有下级代理人
        List<AgentStatistics> agentStatistics = agentStatisticsService.selectFirstLevelAgent(param);

        //遍历一级代理人计算每个人的下线个数，并剔除下级代理人数为0的一级代理人 ，同时计算总数
        List<AgentStatistics> reduce = agentStatistics.stream().filter( agent -> {
            int num = agent.countNumIncludeSelf(param);
            total.setA(total.getA() + num);
            return num>0;
        }).collect(Collectors.toList());

        // 构建子公司和列表
        List<AgentStatisticsGroupByCompany> list = new LinkedList<>();
        //1.将子公司放入列表中
        //将代理人列表按照子公司进行分组
        Map<Long, List<AgentStatistics>> childCompanyCollect = reduce.stream().collect(Collectors.groupingBy(agent -> agent.getCompanyId()));
        //遍历按子公司后的map，根据一级代理人集合构建新的子公司元素 并加入的结果列表,设置type为子公司,添加到集合中
        childCompanyCollect.forEach((id, agents) -> {
            AgentStatisticsGroupByCompany agent = new AgentStatisticsGroupByCompany(agents);
            agent.setType(1);
            list.add(agent);
        });
        //移除掉总公司的数据
        list.stream().forEach(s->{
            if(s.getCompanyId().equals(Long.valueOf(0))){
                list.remove(s);
            }
        });

        //2.将一级部门数据放入列表中
        //将代理人数据按照一级部门进行分组
        //TODO 这里按照部门分组  部门是否是顶级的一级部门
        Map<Long, List<AgentStatistics>> departCollect = reduce.stream().filter(s-> s.getCompanyId().equals(0L))
                .collect(Collectors.groupingBy(agent -> agent.getDepartmentId()));

        //遍历按一级部门后的map，根据一级代理人集合构建新的子公司元素 并加入的结果列表,设置type为子公司,添加到集合中
        childCompanyCollect.forEach((id, agents) -> {
            AgentStatisticsGroupByCompany agent = new AgentStatisticsGroupByCompany(agents);
            agent.setType(1);
            list.add(agent);
        });

        list.sort(Comparator.comparingInt(agent->-agent.getNum() ));

        return builderResultBean(total, list);
    }

    /**
     * 系统级代理人统计 按时间分组
     * @param param
     * @return
     */
    @RequestMapping("systemLevelGroupByTime")
    public ResultBean systemLevelGroupByTime(@RequestBody AgentStatisticsPram param){
        return null;
    }




    @RequestMapping("dealAgent")
    public ResultBean dealAgent(@RequestBody AgentStatisticsPram param){
        TableTypeEnum tableType = TableTypeEnum.ofValue(param.getTableType());
        OneTuple<Integer> total = new OneTuple(0);
        // 一级代理人列表
        List<AgentStatistics> agentStatistics = agentStatisticsService.selectFirstLevelAgent(param);

        //遍历一级代理人计算每个人的下线个数，并剔除下级代理人数为0的一级代理人 ，同时计算总数
        List<AgentStatistics> reduce = tableType.predicate(total,param,agentStatistics);

        // 构建部门列表
        List<BaseAgentStatistics> list = tableType.groupBy(reduce,param);

        list.sort(Comparator.comparingInt(agent->-agent.getNum() ));

        return builderResultBean(total, list);
    }

}
