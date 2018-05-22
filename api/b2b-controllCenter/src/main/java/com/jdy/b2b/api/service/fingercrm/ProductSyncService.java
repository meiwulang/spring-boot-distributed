package com.jdy.b2b.api.service.fingercrm;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.fingercrm.ProductSyncInfoDTO;
import com.jdy.b2b.api.model.fingercrm.ProductSyncSimpleVo;
import com.jdy.b2b.api.model.fingercrm.ProductSyncVO;
import com.jdy.b2b.api.model.fingercrm.ProductTicketSyncInfoDTO;

import java.util.List;

/**
 * Created by strict on 2017/10/10.
 */
public interface ProductSyncService {

    /**
     * 获取 上架 状态的 所有产品列表 同步用
     * @return
     * @param vo
     */
    List<ProductTicketSyncInfoDTO> getProductList(ProductSyncSimpleVo vo);

    /**
     * 获取 上架 状态的 所有产品列表 同步用于礼品卡系统
     * @return
     */
    List<ProductSyncInfoDTO> getToPresentProductList();



    ResultBean syncProduct(ProductSyncVO productSyncVO);
}
