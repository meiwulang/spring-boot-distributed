package com.jdy.b2b.web.service.impl;

import com.fadada.sdk.client.FddClientBase;
import com.fadada.sdk.util.crypt.FddEncryptTool;
import com.fadada.sdk.util.http.HttpsUtil;
import com.jdy.b2b.web.pojo.electroniccontract.CustomerSignContractNeedInfo;
import com.jdy.b2b.web.pojo.electroniccontract.FddParamer;
import com.jdy.b2b.web.pojo.electroniccontract.SignContract;
import com.jdy.b2b.web.pojo.electroniccontract.SignContractInfo;
import com.jdy.b2b.web.pojo.order.PayNeedInfo;
import com.jdy.b2b.web.service.ElectronicContractForPcService;
import com.jdy.b2b.web.util.*;
import net.sf.json.JSONObject;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import java.util.*;

/**
 * Created by zhangfofa on 2018/1/24.
 */
@Service
public class ElectronicContractForPcServiceImpl extends BaseService implements ElectronicContractForPcService {

    @Value("${salesCenterUrl}")
    String salesCenterUrl;

    @Autowired
    private FddParamer fddParamer;

    public ResultBean companyAndCustomerSignContract(SignContract signContract) {
        Integer type = 1;
        String orderNo = signContract.getOrderNo();
        String queryPayNeedInfoUrl = salesCenterUrl + "Order/queryPayNeedInfoByOrderNo";
        ResultBean payNeedInfoResultBean = restTemplate.postForEntity(queryPayNeedInfoUrl, orderNo, ResultBean.class).getBody();
        PayNeedInfo payNeedInfo = (PayNeedInfo) payNeedInfoResultBean.getParsedData(PayNeedInfo.class);
        if(!(payNeedInfo.getoType().intValue() == 2 && payNeedInfo.getPayMethod().intValue() == 2)) {
            return ResultBean.getFailResult("该订单不属于企业线下支付，无法一次性签署合同！");
        }
        boolean flag = (payNeedInfo.getOrderSource().intValue() == 4 && payNeedInfo.getOfflineStatus().intValue() == 5) || (payNeedInfo.getOrderSource().intValue() != 4 && payNeedInfo.getOrderStatus().intValue() == 3);
        if(!flag) {
            logger.error("支付完成后才允许签署合同！");
            return ResultBean.getFailResult("支付完成后才允许签署合同！");
        }
        //判断该订单是否已生成合同
        String querySignContractInfoUrl = salesCenterUrl + "electronicContract/querySignContractInfoByOrderNo";
        MultiValueMap querySignContractInfoParameters = OrganizeRequestParamsUtil.buildMultiValueMap(new String[]{"orderNo", "status"}, new String[]{orderNo, "2"});
        ResultBean signContractInfoResultBean = restTemplate.postForEntity(querySignContractInfoUrl, querySignContractInfoParameters, ResultBean.class).getBody();
        if(signContractInfoResultBean.isFail()) {
            logger.error("该订单尚未生成合同！");
            return ResultBean.getFailResult("该订单尚未生成合同！");
        }

        //判断该合同公司是否已签署
        SignContractInfo signContractInfoQueryResult = (SignContractInfo)signContractInfoResultBean.getParsedData(SignContractInfo.class);
        if(signContractInfoQueryResult.getIsCompanySigin().intValue() == 1) {
            logger.error("公司已签署合同不允许重复签署！");
            return ResultBean.getFailResult("公司已签署合同不允许重复签署！");
        }

        //公司自动签署
        FddClientBase clientBase = preParameter();
        String querySignContractSimplenessInfoUrl = salesCenterUrl + "electronicContract/querySignContractSimplenessInfoByOrderNo";
        ResultBean signContractSimplenessInfoResultBean = restTemplate.postForEntity(querySignContractSimplenessInfoUrl, orderNo, ResultBean.class).getBody();
        SignContract signContractSimplenessInfoResult = (SignContract) signContractSimplenessInfoResultBean.getParsedData(SignContract.class);
        String companyAutoSignContractTransitionNo = RandomStringUtil.getString(30);
        String companyAutoSignContractResponse = clientBase.invokeExtSignAuto(companyAutoSignContractTransitionNo, fddParamer.getCustomerId(), "1", signContractSimplenessInfoResult.getContractNo(),
                signContractSimplenessInfoResult.getDocTitle(), "社盖章", "2", null);
        logger.error("公司自动签署响应参数："+companyAutoSignContractResponse);
        JSONObject companyAutoSignContractResult = JSONObject.fromObject(companyAutoSignContractResponse);
        if(!Objects.equals(companyAutoSignContractResult.get("result").toString().toLowerCase(), "success")) {
            return ResultBean.getFailResult("公司签署合同失败！");
        }

        //保存公司签署合同信息
        SignContractInfo signContractInfo = new SignContractInfo();
        signContractInfo.setContractNo(signContractSimplenessInfoResult.getContractNo());
        signContractInfo.setViewPdfUrl(companyAutoSignContractResult.get("viewpdf_url").toString());
        signContractInfo.setDownloadUrl(companyAutoSignContractResult.get("download_url").toString());
        signContractInfo.setIsCompanySigin((byte)1);
        signContractInfo.setCompanySignContractTime(new Date());
        signContractInfo.setCompanySignContractTransitionNo(companyAutoSignContractTransitionNo);
        String updateSignContractInfoUrl = salesCenterUrl + "electronicContract/updateSignContractInfoByContractNo";
        restTemplate.postForEntity(updateSignContractInfoUrl, signContractInfo, ResultBean.class).getBody();

        //查询游客签署合同所需信息
        String queryCustomerSignContractNeedInfoUrl = salesCenterUrl + "electronicContract/queryCustomerSignContractNeedInfoByOrderNo";
        ResultBean customerSignContractNeedInfoResultBean = restTemplate.postForEntity(queryCustomerSignContractNeedInfoUrl, orderNo, ResultBean.class).getBody();
        CustomerSignContractNeedInfo customerSignContractNeedInfo = (CustomerSignContractNeedInfo) customerSignContractNeedInfoResultBean.getParsedData(CustomerSignContractNeedInfo.class);
        //申请游客CA
        String applyCustomerCaResponse = clientBase.invokeSyncPersonAuto(customerSignContractNeedInfo.getCustomerName(), null, customerSignContractNeedInfo.getIdentNumber(),
                customerSignContractNeedInfo.getIdentType(), customerSignContractNeedInfo.getMobileNumber());
        logger.error("申请游客CA响应参数："+applyCustomerCaResponse);
        JSONObject applyCustomerCaResult = JSONObject.fromObject(applyCustomerCaResponse);
        if(!Objects.equals(applyCustomerCaResult.getString("result").toLowerCase(), "success")) {
            return ResultBean.getFailResult("申请游客CA失败");
        }

        //给游客发送CA申请成功短信
        try {
            SMSUtil.sendSMS(customerSignContractNeedInfo.getMobileNumber(), "56749", null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultBean.getFailResult("短信发送失败");
        }

        //生成游客签署合同短链接
        String customerSignContractTransitionNo = RandomStringUtil.getString(30);
        if(type.intValue() == 1) {
            String pushDocResponse = pushDocExtSignForPc("0",
                    customerSignContractTransitionNo,
                    customerSignContractNeedInfo.getContractNo(),
                    applyCustomerCaResult.getString("customer_id"),
                    customerSignContractNeedInfo.getDocTitle(),
                    customerSignContractNeedInfo.getCustomerName());
            logger.error("生成游客签署合同url响应参数："+pushDocResponse);
            JSONObject pushDocResult = JSONObject.fromObject(pushDocResponse);
            if(!Objects.equals(pushDocResult.get("result").toString().toLowerCase(), "success")) {
                return ResultBean.getFailResult("生成游客签署合同短连接失败");
            }

            //给游客发送签署合同链接短信
            Map<String, Object> map = new HashMap();
            map.put("#touristName#", customerSignContractNeedInfo.getCustomerName());
            map.put("#productName#", customerSignContractNeedInfo.getProductName());
            map.put("#signUrl#", pushDocResult.get("data"));
            String content = SMSUtil.urlencode(map);
            try {
                SMSUtil.sendSMS(customerSignContractNeedInfo.getMobileNumber(), "56068", content);
            } catch (Exception e) {
                e.printStackTrace();
                return ResultBean.getFailResult("短信发送失败");
            }
        }

        //保存游客CA号与交易号
        SignContractInfo signContractInfo2 = new SignContractInfo();
        signContractInfo2.setContractNo(customerSignContractNeedInfo.getContractNo());
        signContractInfo2.setCustomerCaNo(applyCustomerCaResult.getString("customer_id"));
        signContractInfo2.setCustomerSignContractTransitionNo(customerSignContractTransitionNo);
        String updateSignContractInfoUrl2 = salesCenterUrl + "electronicContract/updateSignContractInfoByContractNo";
        restTemplate.postForEntity(updateSignContractInfoUrl2, signContractInfo2, ResultBean.class).getBody();
        return ResultBean.getIndexSuccessResult("短信发送成功！");
    }

    private String pushDocExtSignForPc(String pushType,
                                 String transactionId,
                                 String contractId,
                                 String customerId,
                                 String docTitle,
                                 String signKeyWord) {
        logger.error("生成短链接传入参数："+"pushType: "+pushType+", transactionId: "+transactionId+", contractId: "+contractId+", customerId: "+customerId+
                ", docTitle: "+docTitle+", signKeyWord: "+signKeyWord);
        ArrayList params = new ArrayList();
        String timeStamp = HttpsUtil.getTimeStamp();
        try {
            String sha1 = FddEncryptTool.sha1(fddParamer.getAppId()+FddEncryptTool.md5Digest(timeStamp)+
                    FddEncryptTool.sha1(fddParamer.getAppSecret()+contractId+transactionId+pushType+customerId+signKeyWord));
            String msgDigest = new String(FddEncryptTool.Base64Encode(sha1.getBytes()));

            params.add(new BasicNameValuePair("app_id", fddParamer.getAppId()));
            params.add(new BasicNameValuePair("timestamp", timeStamp));
            params.add(new BasicNameValuePair("v", fddParamer.getVersion()));
            params.add(new BasicNameValuePair("push_type", pushType));
            params.add(new BasicNameValuePair("transaction_id", transactionId));
            params.add(new BasicNameValuePair("contract_id", contractId));
            params.add(new BasicNameValuePair("customer_id", customerId));
            params.add(new BasicNameValuePair("doc_title", docTitle));
            params.add(new BasicNameValuePair("sign_keyword", signKeyWord));
            params.add(new BasicNameValuePair("return_url", fddParamer.getReturnUrl()));
            params.add(new BasicNameValuePair("notify_url", fddParamer.getNotifyUrl()));
            params.add(new BasicNameValuePair("msg_digest", msgDigest));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return HttpsUtil.doPost(fddParamer.getUrl()+"pushdoc_extsign.api", params);
    }

    private FddClientBase preParameter() {
        logger.error("调用法大大SDK中的FddClientBase()构造方法时传入的相关参数：appId: "+fddParamer.getAppId()+", appSecret: "+fddParamer.getAppSecret()+", version: "+fddParamer.getVersion()+", url:  "+fddParamer.getUrl());
        return new FddClientBase(fddParamer.getAppId(), fddParamer.getAppSecret(), fddParamer.getVersion(), fddParamer.getUrl());
    }
}
