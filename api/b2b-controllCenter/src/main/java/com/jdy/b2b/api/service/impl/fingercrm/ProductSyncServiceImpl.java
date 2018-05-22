package com.jdy.b2b.api.service.impl.fingercrm;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.EncodingObjectWithMd5Utils;
import com.jdy.b2b.api.common.HttpClientUtils;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.brand.BrandMapper;
import com.jdy.b2b.api.dao.product.ProductGroupMapper;
import com.jdy.b2b.api.dao.product.ProductKeysMapper;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.dao.product.ProductUserMapper;
import com.jdy.b2b.api.dao.ticket.TicketMapper;
import com.jdy.b2b.api.model.brand.Brand;
import com.jdy.b2b.api.model.company.ProductTypeEnum;
import com.jdy.b2b.api.model.fingercrm.*;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.model.product.ProductKeySynDTO;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.service.fingercrm.ProductSyncService;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by strict on 2017/10/10.
 */
@Service
@Transactional
public class ProductSyncServiceImpl extends BaseService implements ProductSyncService {

    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private ProductGroupMapper productGroupMapper;
    @Autowired
    private ProductUserMapper productUserMapper;
    @Autowired
    private TicketMapper ticketMapper;
    @Autowired
    private ProductKeysMapper productKeysMapper;

    @Value("${shp_card_web_interface_url}")
    String shpCardInterfaceUrl;
    @Autowired
    private TaskExecutor taskExecutor;
    @Autowired
    MQAssembleService mqAssembleService;
    @Autowired
    BrandMapper brandMapper;

    private static final String headComapnyGroupNo = "01360780-f326-11e7-a84c-00163e0ebb1a";

    @Override
    public List<ProductTicketSyncInfoDTO> getProductList(ProductSyncSimpleVo vo) {
        List<ProductTicketSyncInfoDTO> finalList = null;
        //  pid--->(categroyId-->List<TicketInfo>)
        Map<String,List<TicketInfo>> dataMap = new HashMap<>();
        Map<String,ProductTicketSyncInfoDTO> finalMap = new HashMap<>();
        Long productId = null;
        if (vo.getProductIds() != null && vo.getProductIdList().size()>0){
            productId = vo.getProductIdList().get(0);
        }
        List<ProductSyncInfoDTO> list = productMapper.selectShelfProductList(vo.getCompanyId(),productId);
        Set<Long> productIdList = null;
        if (list != null){
            productIdList = new HashSet<>();
            for (ProductSyncInfoDTO p : list){
                productIdList.add(p.getProduct_id());//产品的 id 去重
                initProduct(p);
                String key = p.getProduct_id() + "-" + p.getCategoryId();
                if (dataMap.containsKey(key)){
                        dataMap.get(key).add(initTicketInfo(p));
                }else{
                    List<TicketInfo> tList = new ArrayList<>();
                    tList.add(initTicketInfo(p));
                    dataMap.put(key,tList);
                }
            }

            for(ProductSyncInfoDTO p : list){
                String key = p.getProduct_id() + "-" + p.getCategoryId();
                if (!finalMap.containsKey(key)){
                    finalMap.put(key,initProductTicketInfo(p,dataMap.get(key)));
                }
            }
            List<ProductKeySynDTO> keysList = productKeysMapper.selectByPIds(productIdList);
            Map<Long,List<ProductKeySynDTO>> keysMap = initKeysList(keysList);
            for (Map.Entry<String,ProductTicketSyncInfoDTO> pt : finalMap.entrySet()){
                String tempPId = pt.getKey().split("-")[0];
                if (keysMap.containsKey(Long.valueOf(tempPId))){
                    pt.getValue().setProductKeys(keysMap.get(Long.valueOf(tempPId)));
                }
            }
        }

        Collection<ProductTicketSyncInfoDTO> dataList = finalMap.values();
        finalList = new ArrayList<>(dataList);
        return finalList;
    }

    private Map<Long, List<ProductKeySynDTO>> initKeysList(List<ProductKeySynDTO> keysList) {
        Map<Long,List<ProductKeySynDTO>> map = new HashMap<>();
        for (ProductKeySynDTO k : keysList){
            if (map.containsKey(k.getpId())){
                map.get(k.getpId()).add(k);
            }else {
                List<ProductKeySynDTO> list = new ArrayList<>();
                list.add(k);
                map.put(k.getpId(),list);
            }
        }
        return map;
    }

    private ProductTicketSyncInfoDTO initProductTicketInfo(ProductSyncInfoDTO p, List<TicketInfo> ticketInfos) {
        ProductTicketSyncInfoDTO dto = new ProductTicketSyncInfoDTO();
        dto.setPriceList(ticketInfos);
        dto.setCompanyId(p.getProductCompanyId());
        dto.setBuy_url(p.getBuy_url());
        dto.setCategory(p.getCategory());
        dto.setCategoryId(p.getCategoryId());
        dto.setGroup(p.getGroup());
        dto.setImage(p.getImage());
        dto.setName(p.getName());
        dto.setProduct_code(p.getProduct_code());
        dto.setProduct_type_name(p.getProduct_type_name());
        dto.setProduct_type_value(p.getProduct_type_value());
        dto.setProduct_id(p.getProduct_id());
        dto.setContractName(p.getContractName());
        dto.setProductNo(p.getProductNo());
        dto.setSort(p.getSort());
        dto.setpContactsEn(p.getpContactsEn());
        dto.setpCreativeOfficerCn(p.getpCreativeOfficerCn());
        dto.setpCreativeOfficerEn(p.getpCreativeOfficerEn());
        dto.setpTopicCn(p.getpTopicCn());
        dto.setpTopicEn(p.getpTopicEn());
        return dto;
    }

    private TicketInfo initTicketInfo(ProductSyncInfoDTO p) {
        TicketInfo ticketInfo = new TicketInfo();
        ticketInfo.setUnitPriceId(p.getUnitPriceId());
        ticketInfo.setLastUpdateTime(p.getLastUpdateTime());
        ticketInfo.setPriceName(p.getPriceName());
        ticketInfo.setStock(p.getStock());
        ticketInfo.setUnit_pirce(p.getUnit_pirce());
        ticketInfo.setGatherPrice(p.getGatherPrice());
        ticketInfo.setCompanyId(p.getCompanyId());
        ticketInfo.setCompanyName(p.getCompanyName());
        ticketInfo.setTicketType(p.getTicketType());
        if (p.getTicketType() == 0){
            ticketInfo.setTicketTypeName("成人票");
        }else{
            ticketInfo.setTicketTypeName("儿童票");
        }
        ticketInfo.setTrafficType(p.getTrafficType());
        ticketInfo.setTrafficName(p.getTrafficName());
        ticketInfo.setIsGather(p.getIsGather());
        ticketInfo.setFromTicketId(p.getFromTicketId());
        ticketInfo.setEndPlace(p.getEndPlace());
        ticketInfo.setStartPlaceId(p.getStartPlaceId());
        ticketInfo.setStartPlace(p.getStartPlace());
        //ticketInfo.setEndPlaceId(p.getEndPlaceId());
        ticketInfo.setFactoryPrice(p.getFactoryPrice());
        return ticketInfo;
    }

    @Override
    public List<ProductSyncInfoDTO> getToPresentProductList() {
        List<ProductSyncInfoDTO> list = productMapper.selectShelfToPresentProductList();
        if (list != null){
            for (ProductSyncInfoDTO p : list){
                initProduct(p);
            }
        }
        return list;
    }

    @Override
    public ResultBean syncProduct(ProductSyncVO productSyncVO) {
        Product product = productMapper.selectByPrimaryKey(productSyncVO.getProductId());
        if (product == null){
            return new ResultBean("201","产品不存在");
        }
        Product updateProduct = new Product();
        updateProduct.setpStatus(productSyncVO.getPublish()?0:3);
        updateProduct.setId(productSyncVO.getProductId());
        productMapper.updateByPrimaryKeySelective(updateProduct);
        return new ResultBean("200","发布成功");
        //处理特殊的总公司的 虚拟组
        //rizhi
        /*boolean hasHeadCompany = hasHeadCompanyGroupId(productSyncVO.getvGroupIds());
        // 删除 之前在 product_group表中的数据 根据 产品ID,类目ID,公司ID,组ID
        int num = deleteProductGroupDataByPIdAndCatagroyId(productSyncVO);
        ProductSyncVO tempVo = null;
        if (hasHeadCompany){
            tempVo = buildTempVo(productSyncVO);
            int num2 = deleteProductGroupDataByPIdAndCatagroyId(tempVo);
        }

        // 由于分销端的数据中有可能有在尚品这是已经被删除或者暂停的票ticket,需要筛选掉无效的票
        // 真实有效存在的票ID
        Set<Long> existTIdList = queryExistTicketList(productSyncVO.getPromotionList());
        logger.info("真实有效存在的票ID ==================> " + JSON.toJSONString(existTIdList));
        if (productSyncVO.getPublish()){
            if (existTIdList == null || existTIdList.size() == 0){
                return new ResultBean("400","需要发布的票在尚品处状态有问题,全都不存在,请重新同步");
            }
            // 拼装待插入的数据
            List insertList = buildProductGroupList(productSyncVO,existTIdList);
            logger.info("拼装之后待插入的数据 ==================> " + JSON.toJSONString(insertList));
            if (productSyncVO.getDeliveryType().equals(0)){
                if (insertList.size() > 0)
                    productGroupMapper.insertBatch(insertList);
            }else{
                if (insertList.size() > 0)
                    productUserMapper.insertBatch(insertList);
            }
            if (hasHeadCompany){
                List headCompanyList = buildProductGroupList(tempVo,existTIdList);
                if (tempVo.getDeliveryType().equals(0)){
                    if (headCompanyList.size() > 0)
                        productGroupMapper.insertBatch(headCompanyList);
                }else{
                    if (headCompanyList.size() > 0)
                        productUserMapper.insertBatch(headCompanyList);
                }
            }
        }
        // 异步处理 产品的 状态
        ResultBean resultBean = setProductStatus(productSyncVO,product,existTIdList,hasHeadCompany);
        logger.info("发布/停止 之后结果 ==================> " + JSON.toJSONString(resultBean));
        if (resultBean != null){
            return resultBean;
        }*/
        //return new ResultBean("404","产品状态有问题");
    }

    private ProductSyncVO buildTempVo(ProductSyncVO productSyncVO) {
        ProductSyncVO vo = new ProductSyncVO();
        vo.setCompanyId(0l);
        vo.setCategoryId(productSyncVO.getCategoryId());
        vo.setDeliveryType(productSyncVO.getDeliveryType());
        vo.setProductId(productSyncVO.getProductId());
        List<String> groupIds = new ArrayList<>();
        groupIds.add(headComapnyGroupNo);
        vo.setPromotionList(productSyncVO.getPromotionList());
        vo.setvGroupIds(groupIds);
        return vo;
    }

    private boolean hasHeadCompanyGroupId(List<String> groupIds) {
        if (groupIds != null){
            Iterator<String> it = groupIds.iterator();
            while (it.hasNext()){
                if (headComapnyGroupNo.equals(it.next())){
                    logger.info("未去掉 总公司的组的虚拟组:"+groupIds);
                    it.remove();
                    logger.info("去掉 总公司的组后的虚拟组:"+groupIds);
                    return true;
                }
            }
        }
        return false;
    }

    private <T> List<T> buildProductGroupList(ProductSyncVO productSyncVO, Set<Long> existTIdList) {
        List buildList = new ArrayList<>();
        if (productSyncVO.getDeliveryType().equals(0)){
            for ( ProductTicketSyncDTO syncDTO : productSyncVO.getPromotionList()){
                if (existTIdList.contains(syncDTO.getUnitPriceId())){
                    for (String gNo : productSyncVO.getvGroupIds()){
                        ProductGroup productGroup = ProductGroup.buildBy(gNo,productSyncVO.getCompanyId(),syncDTO);
                        buildList.add(productGroup);
                    }
                }
            }
        }else{
            for ( ProductTicketSyncDTO syncDTO  : productSyncVO.getPromotionList()){
                if (existTIdList.contains(syncDTO.getUnitPriceId())){
                    for (String openId : productSyncVO.getvGroupIds()){
                        ProductUser productUser = ProductUser.buildBy(openId , productSyncVO.getCompanyId(),syncDTO);
                        buildList.add(productUser);
                    }
                }
            }
        }
        return buildList;
    }


    private void initProduct(ProductSyncInfoDTO p){
        p.setGroup("");
        p.setStock(0);
//        StringBuffer sb = new StringBuffer(syncProductListUrl);
//        sb.append("wap/m/detail.html?p_id=").append(p.getProduct_id()).append("&from=preview");
//        p.setBuy_url(sb.toString());
        p.setProduct_type_name(ProductTypeEnum.getDescriptionsOfCOdes(p.getProduct_type_value()));
    }

    private int deleteProductGroupDataByPIdAndCatagroyId(ProductSyncVO productSyncVO){
        if (productSyncVO.getDeliveryType().equals(0)){
            return productGroupMapper.deleteByPNoAndCatagroyIdAndCompanyIdAndGNo(productSyncVO.getProductId(),productSyncVO.getCategoryId(),productSyncVO.getCompanyId(),productSyncVO.getvGroupIds());
        }else{
            return productUserMapper.deleteByPNoAndCategroyId(productSyncVO.getProductId(),productSyncVO.getCategoryId(),productSyncVO.getCompanyId());
        }
    }

    private Set<Long> queryExistTicketList(List<ProductTicketSyncDTO> promotionList){
        //Set<Long> tIdList = ticketMapper.selectByPIdAndCatagroyId(productSyncVO.getProductId(),productSyncVO.getCategoryId());
        List<Long> orginTId = new ArrayList<>();
        if (promotionList != null && promotionList.size() > 0){
            for (ProductTicketSyncDTO syncDTO : promotionList){
                orginTId.add(syncDTO.getUnitPriceId());
            }
        }else{
            return null;
        }
        return ticketMapper.selectEffictiveTicketIdList(orginTId);
    }

    private ResultBean setProductStatus(ProductSyncVO param, Product p, Set<Long> existTIdList, boolean hasHeadCompany){
        if (param.getPublish()){//发布的行为
            if( !Objects.equals(p.getCompanyId(), param.getCompanyId())){// 区域产品 即别的公司的产品，被集结产生 新的票
                //区域产品一定是发布状态才能产生新的集结票，所以 p 这个产品就是发布状态，无需做处理
                return new ResultBean("200","区域产品已经是发布状态");
            } else{
                //当前操作者所在公司名下的产品，在原来逻辑的基础上  只搜索当前人员所在公司下的 票 具体为下面的 tIdList 中的数据

                //尚品数据库中 当前人员所在公司 当前产品 当前类目 有效的 票
                Set<Long> tIdList = ticketMapper.selectEffictiveByPIdAndCatagroyId(param.getProductId(),param.getCategoryId(),param.getCompanyId());
                if (hasHeadCompany){
                    Set<Long> headCompanyTIdList = ticketMapper.selectEffictiveByPIdAndCatagroyId(param.getProductId(),param.getCategoryId(),0l);
                    logger.info("尚品数据库中 总公司 当前产品 当前类目 有效的 票 ==================> " + JSON.toJSONString(headCompanyTIdList));
                }

                logger.info("尚品数据库中 当前人员所在公司 当前产品 当前类目 有效的 票 ==================> " + JSON.toJSONString(tIdList));
                boolean isAll = true;
                if (existTIdList.size() < tIdList.size()){
                    // 同步过来的 有效的 票id数量 少于 当前产品 当前类目下的 票数量
                    // 则 这个 类目下 的 票 一定只是 部分票发布
                    isAll = false;
                }else{
                    for (Long trueId : tIdList){
                        //传递过来的票 中  有没有 从数据库中查出来的所有的 有效的票
                        if (!existTIdList.contains(trueId)){
                            //只要发现一张在 传递过来的票 中 是 不存在的   就认为 当前类目下 不是全部的票都进行了发布操作 所以 产品不能设置为 发布 状态
                            isAll = false;
                            break;
                        }
                    }
                }
                if (p.getpStatus() == 3){
                    //如果是 入库 状态 则需要开始验证
                    if (isAll){
                        Product productVo = new Product();
                        productVo.setId(param.getProductId());
                        productVo.setpStatus(0);
                        productMapper.updateByPrimaryKeySelective(productVo);
                        Product temp = productMapper.selectByPrimaryKey(productVo.getId());
                        Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
                        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
                        return new ResultBean("200","产品发布成功");
                    }
                    return new ResultBean("202","该产品当前类目下还有票未制定规则,产品未发布");
                }else {
                    // status == 0 当前已为 发布状态
                    if (isAll){
                        //产品当前状态为 发布 状态，此次请求发布了另一个类目下的票
                        return new ResultBean("200","产品发布成功");
                    }else{
                        return new ResultBean("200","产品发布成功,但当前类目下还有部分票未设置规则");
                    }
                }
            }
        }else{//停止分销的行为
                // 区域   在 原来的逻辑上 删除 以停止分销的票复制出来的集结的票的规则  2018.03.02 暂时不做
                if (Objects.equals(p.getCompanyId(), param.getCompanyId())){
                    if (p.getpStatus() == 0) {
                        //如果是 发布  状态  则需要开始验证
                        //查找product_group中  当前产品  非 当前类目 下其他的票
                        List<ProductGroup> otherRelList = productGroupMapper.selectRelByPIdExcludeCategoryId(param.getProductId(),param.getCategoryId());
                        logger.info("查找product_group中  当前产品  非 当前类目 下其他的票 otherRelList ==================> " + JSON.toJSONString(otherRelList));
                        //查找product_user中  当前产品  非 当前类目 下其他的票
                        List<ProductUser> otherRelListInUser = productUserMapper.selectRelByPIdExcludeCategoryId(param.getProductId(),param.getCategoryId());
                        logger.info("查找product_user中  当前产品  非 当前类目 下其他的票 otherRelListInUser ==================> " + JSON.toJSONString(otherRelList));
                        if ((otherRelListInUser == null || otherRelListInUser.size() == 0) && (otherRelList == null || otherRelList.size() == 0)){
                            Product productVo = new Product();
                            productVo.setId(param.getProductId());
                            productVo.setpStatus(3);
                            int flag = productMapper.updateByPrimaryKeySelective(productVo);
                            if (flag > 0){
                                taskExecutor.execute(() -> {syncProductUneffect(param.getProductId());});
                                Product temp = productMapper.selectByPrimaryKey(productVo.getId());
                                Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
                                taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
                            }
                            return new ResultBean("203","产品所有票都已停止分销");
                        }
                        HashMap<String,List<ProductGroup>> relMap = otherRelList.stream().collect(Collectors.toMap(relKey ->relKey.gettCategoryId().toString(),relValue->{
                            return new ArrayList<ProductGroup>(){
                                {add(relValue);}
                            };
                        },(left,right)->{
                            left.addAll(right);
                            return left;
                        },HashMap<String,List<ProductGroup>>::new));
                        logger.info("otherRelList整理成 map ==================> " + JSON.toJSONString(relMap));
                        HashMap<String,List<ProductUser>> relMapInUser = otherRelListInUser.stream().collect(Collectors.toMap(relKey ->relKey.gettCategroyId().toString(),relValue->{
                            return new ArrayList<ProductUser>(){
                                {add(relValue);}
                            };
                        },(left,right)->{
                            left.addAll(right);
                            return left;
                        },HashMap<String,List<ProductUser>>::new));
                        logger.info("otherRelListInUser整理成 map ==================> " + JSON.toJSONString(relMapInUser));
                        // 停止的类目之外的 票
                        List<Ticket> otherTicketList = ticketMapper.selectEffictiveTicketByPIdExcludeCategoryId(param.getProductId(),param.getCategoryId());
                        HashMap<String,List<Ticket>> ticketMap = otherTicketList.stream().collect(Collectors.toMap(ticketKey -> ticketKey.gettCategory(),ticketValue->{
                            return new ArrayList<Ticket>(){
                                {add(ticketValue);}
                            };
                        },(left,right)->{
                            left.addAll(right);
                            return left;
                        },HashMap<String,List<Ticket>>::new));

                        boolean isAll = false;
                        for (Map.Entry<String,List<ProductUser>> entry : relMapInUser.entrySet()){
                            if (ticketMap.containsKey(entry.getKey())){
                                if (entry.getValue().size() == ticketMap.get(entry.getKey()).size()){
                                    isAll = true;
                                    break;
                                }
                            }
                        }

                        if (!isAll){
                            for (Map.Entry<String,List<ProductGroup>> entry : relMap.entrySet()){
                                if (ticketMap.containsKey(entry.getKey())){
                                    if (ticketMap.get(entry.getKey()).size() == entry.getValue().size()){
                                        isAll = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (!isAll){
                            Product productVo = new Product();
                            productVo.setId(param.getProductId());
                            productVo.setpStatus(3);
                            int flag = productMapper.updateByPrimaryKeySelective(productVo);
                            if (flag > 0){
                                taskExecutor.execute(() -> {syncProductUneffect(param.getProductId());});
                                Product temp = productMapper.selectByPrimaryKey(productVo.getId());
                                Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
                                taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
                            }
                            return new ResultBean("203","停止分销成功，但产品仍有票设置了规则");
                        }
                        return new ResultBean("204","停止分销成功,但产品仍然为发布状态");

                    }
                    // 有可能出现  3状态 产品 停止分销  因为之前 只发布了 部分的票的规则
                    return new ResultBean("203","产品所有票都已停止分销");
                }else{
                    return new ResultBean("200","集结产品已停止分销");
                }


        }
    }

    private void syncProductUneffect(Long pId){
        Map data = new HashMap();
        data.put("productId", pId);
        data.put("yn2", 0);
        Map param = new HashMap();
        param.put("data", data);
        JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(param);
        String url = shpCardInterfaceUrl + "/dataSync/updateProductById";
        JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
        String code = (String) result.get("code");
        if (!"200".equals(code)) {
            String msg = (String) result.get("msg");
            throw new RuntimeException(msg);
        }
    }



}
