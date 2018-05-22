package com.jdy.b2b.api.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.*;
import com.jdy.b2b.api.dao.product.ProductAssembleCompanyMapper;
import com.jdy.b2b.api.dao.product.ProductGroupMapper;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.ProductNotify;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.model.ticket.TicketListDO;
import com.jdy.b2b.api.model.ticket.TicketSingleResult;
import com.jdy.b2b.api.model.ticketarea.TicketArea;
import com.jdy.b2b.api.model.ticketdeparture.TicketDeparture;
import com.jdy.b2b.api.model.ticketset.TicketSet;
import com.jdy.b2b.api.service.CompanyService;
import com.jdy.b2b.api.service.ScheduleSettingService;
import com.jdy.b2b.api.service.TicketService;
import com.jdy.b2b.api.vo.ticket.CopyGatherTicketsVO;
import com.jdy.b2b.api.vo.ticket.TicketDefaultVo;
import com.jdy.b2b.api.vo.ticket.TicketQueryVo;
import com.jdy.b2b.api.vo.ticket.TicketSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Created by yangcheng on 2017/7/3.
 */
@RestController
@RequestMapping("ticket")
public class TicketController extends BaseController {
    @Autowired
    private TicketService ticketService;
    @Autowired
    private ProductGroupMapper productGroupMapper;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    ProductAssembleCompanyMapper productAssembleCompanyMapper;
    @Autowired
    private CompanyService companyService;
    @Autowired
    TaskExecutor taskExecutor;
    @Value("${product_notify_url}")
    String productNotifyUrl;
    @Autowired
    private ScheduleSettingService scheduleSettingService;

    /**
     * 集结产品复制票等信息
     * @param vo
     * @return
     */
    @PostMapping("copyGatherTickets")
    public ResultBean copyGatherTickets(@RequestBody CopyGatherTicketsVO vo){
        //ResultBean<Integer> successResult = ResultBean.getSuccessResult(ticketService.copyGatherTickets(vo));
        List<Long> companyIds = productAssembleCompanyMapper.selectCompanyIdsByProductIdOK(vo.getProductId());
        int obj = ticketService.copyGatherTickets(companyIds,vo);
        scheduleSettingService.createNewScheduleSettingByProductIdAndCompanyId(vo.getProductId(),vo.getPcompanyId());

        //如果该公司已经集结过该产品,则终止操作
        List<Long> pIds = productAssembleCompanyMapper.selectGatheredCompanyIdsByProductId(vo.getProductId(),vo.getPcompanyId());
        if(pIds!=null && pIds.size()>0){
            return ResultBean.getSuccessResult(0);
        }
        taskExecutor.execute(()->gatherProductNotify(vo));
        return ResultBean.getSuccessResult(obj);
    }

    private void gatherProductNotify(CopyGatherTicketsVO vo) {
        ProductNotify notify = new ProductNotify();
        List<Long> ids = new ArrayList<>();
        ids.add(vo.getProductId());
        notify.setProductIds(ids);
        notify.setCompanyId(vo.getPcompanyId());
        notify.setCompanyName(vo.getPcName());
        notify.setAction(3);
        notify.setStatus(20);
        JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(notify);
        String url = productNotifyUrl + "/channels/sp/product/getProductAlterNotice.do";
        logger.info("集结产品产生集结票通知分销的信息:"+jsonObject.toString());
        JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
        logger.info("通知分销后的结果:"+result.toString());
        Integer code = (Integer) result.get("code");
        if (200!=code) {
            String msg = (String) result.get("msg");
            logger.error(msg);
        }
    }


    /**
     * 根据id查询  考虑套票
     * new
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "get/{id}/{single}", method = RequestMethod.GET)
    public ResultBean<Ticket> queryForTicketById(@PathVariable("id") Long id,@PathVariable("single") Integer single) {
        ResultBean<Ticket> resultBean =  ResultBean.getSuccessResult(ticketService.queryForTicketById(id,single));
        return resultBean;
    }


    /**
     * 根据id查询  单表
     * new
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "get/{id}", method = RequestMethod.GET)
    public ResultBean<Ticket> queryForTicketOnly(@PathVariable("id") Long id) {
        ResultBean<Ticket> resultBean =  ResultBean.getSuccessResult(ticketService.queryForTicketOnly(id));
        return resultBean;
    }

    /**
     * 分页查询票列表 条件搜索列表(名称)  添加套票时查询单票列表(限制条件为单票)
     * new
     * @param vo
     * @return
     */
    @RequestMapping(value = "list", method = RequestMethod.POST)
    public ResultBean queryForTicketListForPage(@RequestBody TicketQueryVo vo) {
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        Ticket ticket = JSONUtil.trans(vo, Ticket.class);

        //flag 1:集结产品列表  2:产品列表
        //如果是来自产品列表菜单,则companyId设置为产品所属公司
        //如果是集结产品菜单,则设置为当前公司
        Product p = productMapper.selectByPrimaryKey(vo.gettProductId());
        ticket.settCompanyId(p.getCompanyId());

        ticket.settStatus(Constants.TICKET_DELETE);
        List<TicketListDO> list = ticketService.queryForTicketListForPage(ticket);
        return ResultBean.getSuccessResult(new PageInfo(list));
    }


    /**
     * 根据票价类目查询列表
     * new
     * @param vo
     * @return
     */
    @RequestMapping(value = "outList", method = RequestMethod.POST)
    public ResultBean queryForOutTicketList(@RequestBody TicketQueryVo vo) {
        //flag 1:集结产品列表  2:产品列表
        //如果是来自产品列表菜单,则companyId设置为产品所属公司
        //如果是集结产品菜单,则设置为当前公司
        Product p = productMapper.selectByPrimaryKey(vo.gettProductId());
        if(Integer.valueOf(1).equals(vo.getFlag())){
            vo.settCompanyId(vo.getPcompanyId());
        }else{
            vo.settCompanyId(p.getCompanyId());
        }
        Ticket ticket = JSONUtil.trans(vo, Ticket.class);
        ticket.settStatus(Constants.TICKET_DELETE);
        List<TicketSingleResult> list = ticketService.queryForOutTicketList(ticket);
        return ResultBean.getSuccessResult(new PageInfo(list));
    }

    /**
     * 保存或修改票信息  设为无效 设为默认价格  删除(逻辑删除)
     * 新增操作需要在web操作中间表两张
     * @param vo
     * @return
     */
    @Transactional
    @RequestMapping(value = "saveOrUpdate", method = RequestMethod.POST)
    public ResultBean<Long> saveOrUpdateTicket(@RequestBody TicketSaveOrUpdateVo vo) {
        Ticket ticket = JSONUtil.trans(vo, Ticket.class);
        Product p  = productMapper.selectByPrimaryKey(ticket.gettProductId());
        if (vo != null && vo.getId() != null) {
            ticket.setUpdateUser(vo.getPuserId());
            ticket.setUpdateTime(new Date());
            if( Objects.equals(p.getpFirstPayType(),1)){
                if(ticket.gettMarketPrice().compareTo(p.getpPayAmount())<0){
                    return new ResultBean<>("-1","输入的票价过小,已小于产品首付款固定金额"+p.getpPayAmount()+"!");
                }
            }

            //1.执行更新
            int result = ticketService.updateTicket(ticket);

            //2.单票和套票都需要插入ticketArea表(先删除,后插入)
            /*ticketService.deleteAreaByTicketId(ticket.getId());
            //如果是删除操作,则不进行插入
            List<TicketArea> areaList = ticket.getTicketAreaList();
            if(areaList.size()>0){
                for(TicketArea area:areaList){
                    area.setCreateTime(new Date());
                    area.setCreateUser(vo.getPuserId());
                    area.setTaTicketId(ticket.getId());
                }
                ticketService.saveTicketAreaBash(ticket.getTicketAreaList());
            }*/


            //3.单票需要插入始发站(不是必填)
            //if(vo.gettTicketType()!=null && vo.gettTicketType().equals(Constants.TICKET_SINGLE_YES)){
                ticketService.deleteDepartureByTicketId(ticket.getId());
                List<TicketDeparture> ticketDepartureList = ticket.getTicketDepartureList();
                if(ticketDepartureList.size()>0){
                    for(TicketDeparture departure:ticketDepartureList){
                        departure.setTicketId(ticket.getId());
                        departure.setCreateTime(new Date());
                        departure.setCreateUser(vo.getPuserId());
                    }
                    ticketService.saveTicketDepartureBash(ticket.getTicketDepartureList());
                }
            //}
            //5.套票需要维护ticketset表
            //if (vo.gettTicketType()!=null && vo.gettTicketType().equals(Constants.TICKET_SINGLE_NO)) {
                //如果是套票,批量删除单票记录和中间表集合
                ticketService.deleteSetById(vo.getId());
                //如果是删除套票,则不需要插入,如果是编辑套票,需要插入新的单票集合和记录集合
                //不要判断等于yes,因为前段传来的status有可能为null
                List<TicketSet> sets = ticket.getSets();
                if (sets.size()>0) {
                    for (TicketSet ts : ticket.getSets()) {
                        ts.setCreateTime(new Date());
                        ts.setCreateUser(vo.getPuserId());
                        ts.setTsSetId(ticket.getId());
                    }
                    ticketService.saveTicketSetBash(ticket.getSets());
                }
            //}

            //编辑票之后,同步到集结的票
            //TODO 判断来自哪个菜单
            if (vo.getFromProductListMenu()) {
                ticketService.synchroGatherTickets(ticket,vo);
            }

            if (result > 0) {
                Ticket ticketData = ticketService.queryForTicketOnly(ticket.getId());
                taskExecutor.execute(()->productNotify(ticketData,3));
                return ResultBean.getSuccessResult((long) result);
            } else {
                //return new ResultBean("-1", "更新票失败");
                throw new RuntimeException("更新票失败");
            }
        } else {



            ticket.setCreateTime(new Date());
            ticket.setCreateUser(vo.getPuserId());
            ticket.settDefaultPrice(Constants.TICKET_DEFAULT_PRICE_NO);
            ticket.settStatus(Constants.TICKET_EFFECT_YES);

            //1.先插入单票或套票记录
            //插入前,先判断产品中 如果设置的是固定金额,则输入的票价金额不能小于固定金额

            if( Objects.equals(p.getpFirstPayType(),1)){
                if(ticket.gettMarketPrice().compareTo(p.getpPayAmount())<0){
                    return new ResultBean<>("-1","输入的票价过小,已小于产品首付款固定金额"+p.getpPayAmount()+"!");
                }
            }

            int result = ticketService.saveTicket(ticket);


            //3.单票需要插入始发站(不是必填)
            List<TicketDeparture> list = ticket.getTicketDepartureList();
            if(list.size()>0){
                for(TicketDeparture departure:list){
                    departure.setCreateUser(vo.getPuserId());
                    departure.setCreateTime(new Date());
                    departure.setTicketId(ticket.getId());
                }
                ticketService.saveTicketDepartureBash(list);
            }

            //4.如果是套票,还需要插入单票中间表记录集合--批量保存
            List<TicketSet> sets = ticket.getSets();
            if(sets.size()>0){
                //如果是新增套票
                for (TicketSet ts : ticket.getSets()) {
                    ts.setTsSetId(ticket.getId());
                    ts.setCreateUser(vo.getPuserId());
                    ts.setCreateTime(new Date());
                }
                ticketService.saveTicketSetBash(ticket.getSets());
            }


            if(ticket.getAscription().equals(Integer.valueOf(1))){

                //如果是区域产品,需要将新增的票及始发站复制到发起过集结的公司
                List<Long> companyIds = productAssembleCompanyMapper.selectCompanyIdsByProductIdOK(ticket.gettProductId());
                if (companyIds!=null && companyIds.size()>0) {
                    ticketService.createAndCopyTicket(vo,ticket);
                }
            }
            if (result > 0) {
                ResultBean<Long> successResult = ResultBean.getSuccessResult(ticket.getId());
                successResult.setId(ticket.getId());
                taskExecutor.execute(()->productNotify(ticket,4));
                return successResult;

            } else {
                throw new RuntimeException("新增票失败");
            }
        }
    }

    /**
     * 批量保存票(单票)
     * @param list
     * @return
     */
    @Transactional
    @RequestMapping(value = "saveBash", method = RequestMethod.POST)
    public ResultBean<Long> saveTicketBash(@RequestBody List<TicketSaveOrUpdateVo> list) {

       // List<Ticket> ticketList = JSONUtil.trans(list, List.class);
        /*return JSON.parseObject(JSON.toJSONString(ticketList), ArrayList<Ticket>());*/
        //1.设置票的时间和默认状态

        List<Ticket> ticketList = JSON.parseObject(JSON.toJSONString(list), new TypeReference<List<Ticket>>(){});
        Long[] ids =new Long[ticketList.size()];
        for(Ticket ticket:ticketList){
            ticket.setCreateTime(new Date());
            ticket.settDefaultPrice(Constants.TICKET_DEFAULT_PRICE_NO);
            ticket.settStatus(Constants.TICKET_EFFECT_YES);
        }
        //2.批量插入
        int result = ticketService.saveTicketBash(ticketList);
        for (int i=0;i<ticketList.size();i++){
            ids[i]=ticketList.get(i).getId();
        }
        //3.插入投放城市和始发站集合
        for(Ticket ticket:ticketList){
            //1.遍历每张票的投放城市
            for(TicketArea area:ticket.getTicketAreaList()){
                area.setCreateTime(new Date());
                area.setTaTicketId(ticket.getId());
                area.setCreateUser(ticket.getCreateUser());
            }
            ticketService.saveTicketAreaBash(ticket.getTicketAreaList());
            //2.遍历每张票的始发站
            List<TicketDeparture> departurelist = ticket.getTicketDepartureList();
            if(departurelist.size()>0){
                for(TicketDeparture departure:departurelist){
                    departure.setCreateTime(new Date());
                    departure.setTicketId(ticket.getId());
                    departure.setCreateUser(ticket.getCreateUser());
                }
                ticketService.saveTicketDepartureBash(departurelist);
            }
        }
        if (result > 0) {
            ResultBean<Long> successResult = ResultBean.getSuccessResult((long) result);
            successResult.setId(ids);
            return successResult;

        } else {
            throw new RuntimeException("批量插入票失败");
        }

    }


    /**
     * 更新单表
     * @param vo
     * @return
     */
    @Transactional
    @RequestMapping(value = "updateTicketOnly", method = RequestMethod.POST)
    public ResultBean<Long> updateTicketOnly(@RequestBody TicketDefaultVo vo) {
        Ticket ticket = JSONUtil.trans(vo, Ticket.class);
        //设为默认价格
        if (vo.gettProductId() != null) {
            //1.查询是否已有默认票价
            Long oldTicketId = ticketService.queryDefaultPrice(vo.gettProductId());
            //2.还原原默认票价
            if (oldTicketId != null) {
                Ticket t = new Ticket();
                t.setId(oldTicketId);
                t.settDefaultPrice(Constants.TICKET_DEFAULT_PRICE_NO);
                int result = ticketService.updateTicket(t);
                if (result < 1) {
                    throw new RuntimeException("还原原默认票价失败");

                }
            }
            //3.设置新的默认票价
            Ticket t1 = new Ticket();
            t1.setId(vo.getId());
            t1.settDefaultPrice(Constants.TICKET_DEFAULT_PRICE_YES);
            int result = ticketService.updateTicket(t1);
            if (result < 1) {
                throw new RuntimeException("还原原默认票价失败");
            } else {
                return ResultBean.getSuccessResult((long) result);
            }
        } else {
            int result = ticketService.updateTicket(ticket);
            //如果是删除票,则物理删除product_group记录
            if(ticket.gettStatus().equals(Constants.TICKET_DELETE)){
                productGroupMapper.deleteByTid(ticket.getId());
                //删除集结票
                Ticket t = ticketService.queryForTicketOnly(ticket.getId());
                if(t.gettFromTicketId()==null) {
                    deleteGatherTickets(ticket.getId());
                }

            }

            if (result < 1) {
                throw new RuntimeException("更新票价状态失败");
            } else {
                Ticket ticket1 = ticketService.queryForTicketOnly(ticket.getId());
                taskExecutor.execute(()->productNotify(ticket1,ticket.gettStatus()));
                return ResultBean.getSuccessResult((long) result);
            }
        }
    }

    private int deleteGatherTickets(Long id) {
        //如果是删除区域产品的票,同步删除
        int result = ticketService.deleteByFromTicketId(id);
        return result;
    }

    /**
     * 票的行为变化通知分销
     * @param ticket 原始数据
     * @param status 当前行为 0有效 1无效 2删除 3保存 4新增
     */
    private void productNotify(Ticket ticket, Integer status){
        logger.info("票变化通知前的数据 ticket:"+JSONObject.toJSONString(ticket)+" 当前行为status:"+status);
        Product product = productMapper.selectByPrimaryKey(ticket.gettProductId());
        if (3 == product.getpStatus() || 0 == product.getpStatus()){ //入库 or 发布
            if(!(ticket.gettStatus()==1 && status == 2) || !(ticket.gettStatus() == 1 && status == 3)){ //原 无效 票 且 删除行为，不通知分销

                Company company = companyService.selectByCompanyId(ticket.gettCompanyId());
                ProductNotify notify = new ProductNotify();
                List<Long> ids = new ArrayList<>();
                ids.add(ticket.gettProductId());
                notify.setProductIds(ids);
                notify.setCompanyId(ticket.gettCompanyId());
                notify.setCompanyName(company.getcName());
                if (Constants.TICKET_DELETE == status){//有效 -->  删除
                    notify.setAction(3);//1线路信息；2行程信息；3票价管理；4班期管理,5产品
                    notify.setStatus(30);//10 新增; 20 更新; 30 取消;40 入库
                    //票置为 无效 所以要填票 id
                    notify.setUnitPriceId(ticket.getId());
                    notify.setCategoryId(Long.valueOf(ticket.gettCategory()));
                }else if (1 == status){ //有效 -->  无效
                    notify.setAction(3);
                    notify.setStatus(30);
                    //票置为 无效 所以要填票 id
                    notify.setUnitPriceId(ticket.getId());
                    notify.setCategoryId(Long.valueOf(ticket.gettCategory()));
                }else if (0 == status ){//票 暂停 --> 有效
                    notify.setAction(3);
                    notify.setStatus(20);
                }else if (3 == status ){//有效票 --> 保存
                    notify.setAction(3);
                    notify.setStatus(20);
                }else if (4 == status ){//新增票
                    notify.setAction(3);
                    notify.setStatus(10);
                }
                JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(notify);
                String url = productNotifyUrl + "/channels/sp/product/getProductAlterNotice.do";
                logger.info("票变化通知分销的信息:"+jsonObject.toString());
                JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
                logger.info("通知分销后的结果:"+result.toString());
                Integer code = (Integer) result.get("code");
                if (!(200 == code)) {
                    String msg = (String) result.get("msg");
                    logger.error(msg);
                }

            }
        }




    }

}
