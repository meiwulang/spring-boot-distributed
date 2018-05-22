package com.jdy.b2b.web.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import com.jdy.b2b.web.util.ResultBean;
import org.springframework.web.multipart.MultipartFile;


/**
 * @Description 公共业务层
 * @author 王斌
 * @date 2017年7月5日 上午10:08:10
 * @version V1.0
 */
public interface CommonService {
	/**
	 * @Description:上传文件
	 * @author 王斌
	 * @date 2017年7月5日 上午10:12:32
	 * @param file
	 * @return
	 */
	ResultBean<Map<String, Object>> uploadFile(MultipartFile file,String fileType);

	ResultBean<Map<String, Object>> uploadWXFile(File file, String fileType) throws IOException;

	String uploadFile(InputStream is, String imgName);

	/**
	 * @Description: 删除文件
	 * @author 王斌
	 * @date 2017年7月5日 上午10:44:19
	 * @param fileURI资源路径
	 * @param fileType文件类型
	 * @return
	 */
	ResultBean<?> delFile(String fileURI, String fileType);
}
