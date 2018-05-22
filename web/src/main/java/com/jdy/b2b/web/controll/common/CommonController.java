package com.jdy.b2b.web.controll.common;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.web.service.CommonService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.EncodingObjectWithMd5Utils;
import com.jdy.b2b.web.util.HttpClientUtils;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * @Description 公共控制层
 * @author 王斌
 * @date 2017年7月5日 上午9:59:43
 * @version V1.0
 */
@Api(value = "CommonController", description = "文件操作接口")
@RestController
@RequestMapping(value = "/common", method = RequestMethod.POST)
public class CommonController extends BaseController{

	@Autowired
	CommonService service;
	//@Value("${spring.wechat.getConfigUrl}getTokenUrl}")
	private  String getTokenUrl;
	//@Value("${spring.wechat.getConfigUrl}")
	private  String getConfigUrl;
	@Value("${spring.wechat.publicid}")
	private  String publicid;
	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager shiroEhcacheManager;

	/**
	 * @Description: 文件上传
	 * @author 王斌
	 * @date 2017年7月5日 上午10:54:45
	 * @param file
	 * @param fileType
	 * @return
	 */
	@RequestMapping(value = "/file/upload", method = RequestMethod.POST)
	ResultBean<Map<String, Object>> uploadFile(MultipartFile file,
			String fileType) {
		if (Objects.isNull(file)) {
			return new ResultBean<>("-1", "file 不能为空");
		}
		if (Objects.isNull(fileType)) {
			return new ResultBean<>("-1", "fileType 不能为空");
		}

		return service.uploadFile(file, fileType);
	}

	/**
	 * @Description: 文件删除
	 * @author 王斌
	 * @date 2017年7月5日 上午10:54:59
	 * @param fileURI
	 * @param fileType
	 * @return
	 */
	@RequestMapping(value = "/file/delete", method = RequestMethod.POST)
	ResultBean<?> deleteFile(String fileURI, String fileType) {
		if (Objects.isNull(fileURI)) {
			return new ResultBean<>("-1", "fileURI 不能为空");
		}
		if (Objects.isNull(fileType)) {
			return new ResultBean<>("-1", "fileType 不能为空");
		}
		return service.delFile(fileURI, fileType);
	}

	/**
	 * 微信上传文件到oss
	 * @return
	 */
	@ApiOperation(value = "接收到前端给的mediaid,即serverId后,微信上传文件到oss")
	@GetMapping(value = "/downloadMedia/{mediaId}")
	public ResultBean downloadMedia(@PathVariable String mediaId, HttpServletRequest request) {
		//从初始化配置时获取的缓存中 获取token
		String accessToken = getToken();

		//获取文件
		String requestUrl = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=MEDIA_ID";
		requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken).replace("MEDIA_ID", mediaId);
		HttpURLConnection conn = null;
		try {
			URL url = new URL(requestUrl);
			conn = (HttpURLConnection) url.openConnection();
			conn.setDoInput(true);
			conn.setRequestMethod("GET");
			conn.setConnectTimeout(30000);
			conn.setReadTimeout(30000);
			BufferedInputStream bis = new BufferedInputStream(conn.getInputStream());
			String randomFileName = "/wxfile/"+getRandomFileName();
			FileOutputStream  output = new FileOutputStream(new File(randomFileName));
			byte[] buff = new byte[100];
			int rc = 0;
			while ((rc = bis.read(buff, 0, 100)) > 0) {
				output.write(buff, 0, rc);
			}
			File realFile = new File(randomFileName);

			// 调用上传到oss接口
			ResultBean<Map<String, Object>> resultBean = service.uploadWXFile(realFile, "jpg");
			//删除临时文件
			//暂时不删除临时文件
			//realFile.delete();
			return resultBean;
		} catch (Exception e) {
			e.printStackTrace();
			return ResultBean.getFailResult("上传失败!");
		} finally {
			if (conn != null) {
				conn.disconnect();
			}
		}
	}



	@ApiOperation(value = "调用长沙接口,传递token,url,timestamp 获取cofig配置参数")
	@GetMapping(value = "getWXconfig")
	public ResultBean getWXconfig(@RequestParam(value = "pageUrl") String pageUrl, HttpServletRequest request){
		//获取当前页面url
		String url = pageUrl;
		logger.error("getCurrentPageUrl###前端传递__________________"+url.toString());
		//调用长沙接口获取config信息
		Map<String,String> params = new HashMap<>();
		params.put("url",url);
		params.put("openId",getUser().getuWxOpenId());
		//进行加密
		String encoding = EncodingObjectWithMd5Utils.encoding(params).toJSONString();
		logger.error("encoding参数_________________________"+encoding);

		JSONObject jsonObject = HttpClientUtils.httpPostJSON(getConfigUrl, encoding);
		logger.error("jsonobject____________________________ "+jsonObject);

		Map<String,Object> configMap = new HashMap<>();
		if(jsonObject.get("code").equals(Integer.valueOf(0))){
			configMap.put("timestamp",jsonObject.get("timestamp"));
			configMap.put("nonceStr",jsonObject.get("nonce_str").toString());
			configMap.put("signature",jsonObject.get("signature").toString());
			logger.error("configMap________________________  "+configMap);
		}else{
			throw new RuntimeException("获取配置信息出错!");
		}

		return ResultBean.getSuccessResult(configMap);
	}

	public String getToken(){
		//获取token
		String finalTokenUrl = getTokenUrl.replace("OPEN_ID", getUser().getuWxOpenId()).replace("PUBLIC_ID", publicid);
		String accessToken = (String)HttpClientUtils.httpGet(finalTokenUrl).get("content");
		return accessToken;
	}

	public String getRandomFileName() {
		StringBuilder sb = new StringBuilder();
		sb.append(new Date().getTime()).append(".txt");
		return sb.toString();
	}
}
