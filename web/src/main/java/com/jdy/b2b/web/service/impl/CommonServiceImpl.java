package com.jdy.b2b.web.service.impl;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jdy.b2b.web.config.oss.OSSUtils;
import com.jdy.b2b.web.config.oss.OssConfiguration;
import com.jdy.b2b.web.service.CommonService;
import com.jdy.b2b.web.util.KeyUtils;
import com.jdy.b2b.web.util.ResultBean;

/**
 * @Description 公共业务实现层
 * @author 王斌
 * @date 2017年7月5日 上午10:13:41
 * @version V1.0
 */
@Service
public class CommonServiceImpl implements CommonService {
	@Autowired
	OssConfiguration ossConfiguration;

	@Override
	public ResultBean<Map<String, Object>> uploadWXFile(File file,String fileType) throws IOException {
		FileInputStream fis = new FileInputStream(file);
		//TODO 将file转换为MultipartFile
		//MultipartFile multi = new MockMultipartFile("模板.xls", fis);

		OSSUtils oSSUtils = OSSUtils.getInstance(ossConfiguration);
		String originalFilename =  file.getName();
		String fileSuffix = originalFilename.substring(originalFilename.lastIndexOf("."));
		StringBuilder key = new StringBuilder();
		key.append(fileType).append("/").append(KeyUtils.getRandom32EndTimePK()).append(fileSuffix);
		try {
			oSSUtils.uploadFile(ossConfiguration.getPic(), key.toString(),fis);
		} catch (Exception e) {
			return new ResultBean<>("109", "文件上传失败");
		}
		Map<String, Object> data = new HashMap<>();
		// 拼接完整路径
		key.insert(0, "/").insert(0, ossConfiguration.getEndpoint())
				.insert(0, ".").insert(0, ossConfiguration.getPic())
				.insert(0, "http://");
		data.put("key", key.toString());
		data.put("size", file.length()/1024);
		return ResultBean.getSuccessResult(data);
	}


	@Override
	public ResultBean<Map<String, Object>> uploadFile(MultipartFile file,
			String fileType) {
		OSSUtils oSSUtils = OSSUtils.getInstance(ossConfiguration);
		String originalFilename = file.getOriginalFilename();
		String fileSuffix = originalFilename
				.substring(originalFilename.lastIndexOf("."));
		StringBuilder key = new StringBuilder();
		key.append(fileType).append("/").append(KeyUtils.getRandom32EndTimePK())
				.append(fileSuffix);
		try {
			oSSUtils.uploadFile(ossConfiguration.getPic(), key.toString(),
					file.getInputStream());
		} catch (Exception e) {
			return new ResultBean<>("109", "文件上传失败");
		}
		Map<String, Object> data = new HashMap<>();
		// 拼接完整路径
		key.insert(0, "/").insert(0, ossConfiguration.getEndpoint())
				.insert(0, ".").insert(0, ossConfiguration.getPic())
				.insert(0, "http://");
		data.put("key", key.toString());
		data.put("size", file.getSize());
		return ResultBean.getSuccessResult(data);
	}

	public String uploadFile(InputStream is, String fileName) {
		OSSUtils oSSUtils = OSSUtils.getInstance(ossConfiguration);
		try {
			oSSUtils.uploadFile(ossConfiguration.getPic(),fileName,is);
		} catch (Exception e) {
			e.printStackTrace();
		}
		String url = "http://"+ossConfiguration.getPic()+"."+ossConfiguration.getEndpoint()+"/"+fileName;
		return url;

	}

	@Override
	public ResultBean<?> delFile(String key, String fileType) {
		String bucketName = ossConfiguration.getPic();
		if (key.contains(fileType)) {
			key = key.substring(key.indexOf(fileType));
		}
		OSSUtils oSSUtils = OSSUtils.getInstance(ossConfiguration);
		oSSUtils.deleteObject(bucketName, key);
		return ResultBean.getSuccessResult();
	}

}
