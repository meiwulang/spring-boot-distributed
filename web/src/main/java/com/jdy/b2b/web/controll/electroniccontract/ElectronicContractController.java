package com.jdy.b2b.web.controll.electroniccontract;

import java.io.File;
import java.io.IOException;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.jdy.b2b.web.pojo.order.Order;
import com.jdy.b2b.web.util.*;
import org.apache.commons.io.FileUtils;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fadada.sdk.client.FddClientBase;
import com.fadada.sdk.util.crypt.FddEncryptTool;
import com.fadada.sdk.util.http.HttpsUtil;
import com.jdy.b2b.web.pojo.electroniccontract.*;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import net.sf.json.JSONObject;

/**
 * Created by zhangfofa on 2017/12/13.
 */
@ApiModel
@Controller
@RequestMapping("front/order/m/electronicContract")
public class ElectronicContractController extends BaseController {
    private final Logger logger = LoggerFactory.getLogger(ElectronicContractController.class);

    @Autowired
    private FddParamer fddParamer;

    @Value("${salesCenterUrl}")
    String salesCenterUrl;

    @ApiOperation(value = "合同模板传输接口")
    @RequestMapping(value = "/contractTemplateTransmit", method = RequestMethod.POST)
    @ResponseBody
    public ResultBean contractTemplateTransmit(@RequestBody MultipartFile multipartFile,
                                               BaseVO baseVO) {
        File file = new File(fddParamer.getTemporaryFileSavePath()+multipartFile.getOriginalFilename());
        try {
            FileUtils.copyInputStreamToFile(multipartFile.getInputStream(), file);
        } catch (IOException e) {
            e.printStackTrace();
        }

        //向法大大上传合同模板
        FddClientBase clientBase = preParameter();
        String templateNo = RandomStringUtil.generateNameAccordingDateAndRandomString(6);
        logger.error("模板编号："+templateNo+"文件名称："+multipartFile.getOriginalFilename());
        String response = clientBase.invokeUploadTemplate(templateNo, file, null);
        file.delete();
        logger.error("上传合同模板响应参数："+response);

        //保存合同模板信息
        JSONObject jsonObject = JSONObject.fromObject(response);
        if(!Objects.equals(jsonObject.get("result").toString().toLowerCase(), "success")) {
            return ResultBean.getFailResult("上传模板失败");
        }
        ContractTemplateInfo contractTemplateInfo = new ContractTemplateInfo();
        contractTemplateInfo.setCreateUser(baseVO.getPuserId());
        contractTemplateInfo.setCompanyId(baseVO.getPcompanyId());
        contractTemplateInfo.setTemplateNo(templateNo);
        contractTemplateInfo.setTemplateTitle(multipartFile.getOriginalFilename().substring(0, multipartFile.getOriginalFilename().length()-4));
        String url = salesCenterUrl + "electronicContract/addContractTemplate";
        return restTemplate.postForEntity(url, contractTemplateInfo, ResultBean.class).getBody();
    }

    @ApiOperation(value = "生成合同接口")
    @RequestMapping("/generateContract")
    @ResponseBody
    public ResultBean generateContract(@RequestBody String orderNo) {
        //查询该订单对应的产品是否绑定合同
        String queryProductWhetherBindingContractUrl = salesCenterUrl + "electronicContract/queryProductWhetherBindingContractByOrderNo";
        ResultBean productWhetherBindingContracResultBean = restTemplate.postForEntity(queryProductWhetherBindingContractUrl, orderNo, ResultBean.class).getBody();
        if(productWhetherBindingContracResultBean.isFail()) {
            return ResultBean.getFailResult("该订单对应产品未绑定合同模板无法生成合同！");
        }

        //查询生成合同所需信息
        String queryGenerateContractNeedInfoUrl = salesCenterUrl + "electronicContract/queryGenerateContractNeedInfoByOrderNo";
        ResultBean generateContractNeedInfoResultBean = restTemplate.postForEntity(queryGenerateContractNeedInfoUrl, orderNo, ResultBean.class).getBody();
        //生成合同
        GenerateContractNeedInfo generateContractNeedInfo = (GenerateContractNeedInfo) generateContractNeedInfoResultBean.getParsedData(GenerateContractNeedInfo.class);
        FddClientBase clientBase = preParameter();
        String generateContractResponse = clientBase.invokeGenerateContract(generateContractNeedInfo.getTemplateNo(), generateContractNeedInfo.getContractNo(), generateContractNeedInfo.getDocTitle(),
                generateContractNeedInfo.getFontSize(), generateContractNeedInfo.getFontType(), generateContractNeedInfo.getParameterJsonString(), null);
        logger.error("生成合同响应参数："+generateContractResponse);
        JSONObject generateContractResult = JSONObject.fromObject(generateContractResponse);
        if(!Objects.equals(generateContractResult.get("result").toString().toLowerCase(), "success")) {
            return ResultBean.getFailResult("生成合同失败!");
        }
        //保存生成的合同信息
        SignContractInfo signContractInfo = new SignContractInfo();
        signContractInfo.setOrderNo(orderNo);
        signContractInfo.setContractNo(generateContractNeedInfo.getContractNo());
        signContractInfo.setTemplateNo(generateContractNeedInfo.getTemplateNo());
        signContractInfo.setViewPdfUrl(generateContractResult.get("viewpdf_url").toString());
        signContractInfo.setDownloadUrl(generateContractResult.get("download_url").toString());
        signContractInfo.setIsCompanySigin((byte)0);
        signContractInfo.setIsCustomerSign((byte)0);
        signContractInfo.setStatus((byte)0);
        String addSignContractInfoUrl = salesCenterUrl + "electronicContract/addSignContractInfo";
        restTemplate.postForEntity(addSignContractInfoUrl, signContractInfo, ResultBean.class).getBody();
        return ResultBean.getIndexSuccessResult("合同保存成功");
    }

    @ApiOperation(value = "合同签署接口")
    @RequestMapping(value = "/signContract", method = RequestMethod.POST)
    @ResponseBody
    public ResultBean signContract(@RequestBody SignContract signContract) {
        String orderNo = signContract.getOrderNo();
        logger.error("合同签署接口:"+orderNo);
        Integer type = 1;

        //判断该订单是否已生成合同
        String querySignContractInfoUrl = salesCenterUrl + "electronicContract/querySignContractInfoByOrderNo";
        MultiValueMap querySignContractInfoParameters = OrganizeRequestParamsUtil.buildMultiValueMap(new String[]{"orderNo", "status"}, new String[]{orderNo, "2"});
        ResultBean signContractInfoResultBean = restTemplate.postForEntity(querySignContractInfoUrl, querySignContractInfoParameters, ResultBean.class).getBody();
        if(signContractInfoResultBean.isFail()) {
            return ResultBean.getFailResult("该订单号下目前没有可签署的合同！");
        }

        //判断公司是否已签署合同
        SignContractInfo signContractInfoQueryResult = (SignContractInfo)signContractInfoResultBean.getParsedData(SignContractInfo.class);
        if(!(signContractInfoQueryResult.getIsCompanySigin().intValue() == 1 && signContractInfoQueryResult.getIsCustomerSign().intValue() == 0)) {
            return ResultBean.getFailResult("系统繁忙请稍后再试！");
        }

        //判断订单是否已支付完成，支付完成之后才允许签署合同
        String queryOrderByOrderNoUrl = salesCenterUrl + "electronicContract/queryOrderByOrderNo";
        ResultBean orderResultBean = restTemplate.postForEntity(queryOrderByOrderNoUrl, orderNo, ResultBean.class).getBody();
        Order order = (Order)orderResultBean.getParsedData(Order.class);
        if(order.getoStatus().intValue() != 3) {
            return ResultBean.getFailResult("该订单尚未支付或系统尚未收到微信成功支付通知！");
        }

        //查询游客签署合同所需信息
        String queryCustomerSignContractNeedInfoUrl = salesCenterUrl + "electronicContract/queryCustomerSignContractNeedInfoByOrderNo";
        ResultBean customerSignContractNeedInfoResultBean = restTemplate.postForEntity(queryCustomerSignContractNeedInfoUrl, orderNo, ResultBean.class).getBody();
        CustomerSignContractNeedInfo customerSignContractNeedInfo = (CustomerSignContractNeedInfo) customerSignContractNeedInfoResultBean.getParsedData(CustomerSignContractNeedInfo.class);
        //申请游客CA
        FddClientBase clientBase = preParameter();
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
            String pushDocResponse = pushDocExtSign("0",
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

    @ApiOperation(value = "游客签署合同后回调接口")
    @RequestMapping("/callback")
    public void customerSignContractCallback (HttpServletRequest request,
                                              HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/text;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");
        String transaction_id = request.getParameter("transaction_id");
        String contract_id = request.getParameter("contract_id");
        String result_code = request.getParameter("result_code");
        String result_desc = request.getParameter("result_desc");
        String download_url = request.getParameter("download_url");
        String viewpdf_url = request.getParameter("viewpdf_url");
        String timestamp = request.getParameter("timestamp");
        String msg_digest = request.getParameter("msg_digest");
        logger.error("法大大回调入参："+"transaction_id: "+transaction_id+", contract_id: "+contract_id+", result_code: "+result_code+", result_desc: "+result_desc+
                     ", download_url: "+download_url+", viewpdf_url: "+viewpdf_url+", timestamp: "+timestamp+", msg_digest: "+msg_digest);
        String generateMsgDigest = null;
        try {
            String sha1 = FddEncryptTool.sha1(fddParamer.getAppId() + FddEncryptTool.md5Digest(timestamp) + FddEncryptTool.sha1(fddParamer.getAppSecret()+transaction_id));
            generateMsgDigest = new String(FddEncryptTool.Base64Encode(sha1.getBytes()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        logger.error("自生成签名："+generateMsgDigest);
        if(!Objects.equals(generateMsgDigest, msg_digest)) {
            logger.error("签名验证失败！");
            response.setStatus(302);
            response.setHeader("msg", "你加密被篡改");
            return;
        }

        if(Objects.equals(result_code, "3000")) {
            CustomerSignContractCallback customerSignContractCallback = new CustomerSignContractCallback();
            customerSignContractCallback.setContractNo(contract_id);
            customerSignContractCallback.setDownloadUrl(download_url);
            customerSignContractCallback.setViewpdfUrl(viewpdf_url);
            String url = salesCenterUrl+"electronicContract/customerSignContractCallback";
            restTemplate.postForEntity(url, customerSignContractCallback, ResultBean.class).getBody();

            FddClientBase clientBase = preParameter();
            String contractFillingResponse = clientBase.invokeContractFilling(contract_id);
            JSONObject contractFillingResult = JSONObject.fromObject(contractFillingResponse);
            if(Objects.equals(contractFillingResult.get("result").toString().toLowerCase(), "success")) {
                SignContractInfo signContractInfo = new SignContractInfo();
                signContractInfo.setContractNo(contract_id);
                signContractInfo.setStatus((byte)3);
                signContractInfo.setUpdateTime(new Date());
                String updateSignContractInfoUrl = salesCenterUrl + "electronicContract/updateSignContractInfoByContractNo";
                restTemplate.postForEntity(updateSignContractInfoUrl, signContractInfo, ResultBean.class).getBody();
            }
        }
    }

    @ApiOperation(value = "根据订单编号查看合同查看和下载地址")
    @RequestMapping("/queryContractViewAndDownloadUrlByOrderNo")
    @ResponseBody
    public ResultBean queryContractViewAndDownloadUrlByOrderNo(@RequestBody NotifyQueryDTO notifyQueryDTO) {
        logger.error("根据订单编号查看合同查看和下载地址："+notifyQueryDTO.toString());
        String generateMsgDigest = null;
        try {
            String sha1 = FddEncryptTool.sha1(fddParamer.getAppId() + FddEncryptTool.md5Digest(notifyQueryDTO.getTimeStamp()) + FddEncryptTool.sha1(fddParamer.getAppSecret()+notifyQueryDTO.getOrderNo()));
            generateMsgDigest = new String(FddEncryptTool.Base64Encode(sha1.getBytes()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        logger.error("自生成签名："+generateMsgDigest);
        if(!Objects.equals(generateMsgDigest, notifyQueryDTO.getMsgDigest())) {
            logger.error("签名验证失败！");
            return ResultBean.getFailResult("签名验证失败");
        }

        String queryContractViewAndDownloadUrlByOrderNoUrl = salesCenterUrl + "electronicContract/queryContractViewAndDownloadUrlByOrderNo";
        return restTemplate.postForEntity(queryContractViewAndDownloadUrlByOrderNoUrl, notifyQueryDTO.getOrderNo(), ResultBean.class).getBody();
    }

    private FddClientBase preParameter() {
        logger.error("调用法大大SDK中的FddClientBase()构造方法时传入的相关参数：appId: "+fddParamer.getAppId()+", appSecret: "+fddParamer.getAppSecret()+", version: "+fddParamer.getVersion()+", url:  "+fddParamer.getUrl());
        return new FddClientBase(fddParamer.getAppId(), fddParamer.getAppSecret(), fddParamer.getVersion(), fddParamer.getUrl());
    }

    public String pushDocExtSign(String pushType,
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

    @ApiOperation(value = "合同模板列表")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "合同模板列表", response = ContractTemplateInfoExt.class)})
    @PostMapping("/searchList")
    @ResponseBody
    public ResultBean searchList(@RequestBody ContractTemplateListDO vo) {
        String url = salesCenterUrl + "electronicContract/searchList";
        return restTemplate.postForObject(url, vo, ResultBean.class);
    }

    @ApiOperation(value = "删除合同模板")
    @GetMapping("/deleteTemp/{id}")
    @ResponseBody
    public ResultBean deleteTemp(@PathVariable Long id) {
        String url = salesCenterUrl + "electronicContract/deleteTemp/{id}";
        return restTemplate.getForObject(url, ResultBean.class, id);
    }

    @ApiOperation(value = "产品相关合同模板列表")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "产品相关合同模板列表", response = ProductContractListDTO.class)})
    @GetMapping("/prodTempList/{pid}")
    @ResponseBody
    public ResultBean prodTempList(@PathVariable Long pid,
                                   BaseVO baseVO) {
        BindProAndTmpDO bindProAndTmpDO = new BindProAndTmpDO();
        bindProAndTmpDO.setPid(pid);
        bindProAndTmpDO.setPcompanyId(baseVO.getPcompanyId());
        bindProAndTmpDO.setPuDataLimit(baseVO.getPuDataLimit());
        String url = salesCenterUrl + "electronicContract/prodTempList";
        return restTemplate.postForObject(url, bindProAndTmpDO, ResultBean.class);
    }

    @ApiOperation(value = "绑定产品和合同模板")
    @PostMapping("/bindProAndTmp")
    @ResponseBody
    public ResultBean bindProAndTmp(@Validated @RequestBody BindProAndTmpDO vo) {
        String url = salesCenterUrl + "electronicContract/bindProAndTmp";
        return restTemplate.postForObject(url, vo, ResultBean.class);
    }

}
