package com.jdy.b2b.api.util;

import cn.jdytrip.sp.data.warehouse.util.HttpUtils;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.SpringUtils;
import com.jdy.b2b.api.model.ProductCostDTO;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.model.ticket.TicketInfoDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * 数据同步工具类
 * @author chris
 * @since Apr 27.18
 */
public class DataSyncUtils {
    public static Logger logger = LoggerFactory.getLogger(DataSyncUtils.class);

    private String dataWarehouseURL;

    private String appSecretKey;

    private String appId;

    private static DataSyncUtils instance = null;

    private DataSyncUtils(){
        MQAssembleService mqService = SpringUtils.getBean(MQAssembleService.class);
        this.appId = mqService.appId;
        this.appSecretKey = mqService.appSecret;
        this.dataWarehouseURL = mqService.requestUrl;
    }
    public static DataSyncUtils getInstance() {
        if (instance == null) {
            synchronized (DataSyncUtils.class) {
                if (instance == null) {
                    instance = new DataSyncUtils();
                }
            }
        }
        return instance;
    }

    public void syncProductCostData(ProductCostDTO productCostDTO) {
        if (ObjectUtils.isEmpty(productCostDTO)) {
            logger.error("syncProductCostData productCostDTO is null.");
            return;
        }
        //同步产品成本数据
        List<ProductCostDTO> prodCostingTitles = new ArrayList<>();
        prodCostingTitles.add(productCostDTO);
        instance.syncData2WH("/productCost/syncProductCost", prodCostingTitles);
    }

    public void syncTicketData(Ticket ticket) {
        //同步产品成本数据
        List<TicketInfoDTO> tickets = new ArrayList<>();
        tickets.add(new TicketInfoDTO(ticket));
        this.syncData2WH("/ticket/syncTicket", tickets);
    }

    private void syncData2WH(String url, Object data) {
        logger.info("syncData2WH start...");
        //同步返佣明细到数据仓库
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("auth", this.buildAuthObj());
        jsonObject.put("data", data);
        String resp = HttpUtils.postJson(this.dataWarehouseURL + url, jsonObject.toString());
        logger.info("syncData2WH resp = " + resp);

    }

    private JSONObject buildAuthObj() {
        JSONObject auth = new JSONObject();
        auth.put("appId", this.appId);
        auth.put("appSecret", this.appSecretKey);
        return auth;
    }

}
