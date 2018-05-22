package com.jdy.b2b.web.config.oss;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipOutputStream;

/**
 * 
 * 阿里云OSS工具 <br>
 *
 */
public class OSSUtils {

	private static Logger log = LoggerFactory.getLogger(OSSUtils.class);
	private OSSClient client;
	public  volatile static OSSUtils INSTANCE = null;
	private OSSUtils(OssConfiguration ossConfiguration){
		client = new OSSClient(ossConfiguration.getEndpoint(), ossConfiguration.getKey(), ossConfiguration.getSecret());
	}

	/**
	 * 获取实例
	 * @return
	 */
	public static OSSUtils getInstance(OssConfiguration ossConfiguration){
		if(INSTANCE == null){
			synchronized (OSSUtils.class) {
				if(INSTANCE == null) {
					INSTANCE = new OSSUtils(ossConfiguration);
				}
			}
		}
		return INSTANCE;
	}

	/**
	 * 
	 * 根据指定key删除在bucket中的对象<br>
	 *
	 * @param bucketName
	 * @param key
	 */
	public void deleteObject(String bucketName, String key) {
		try {
			client.deleteObject(bucketName, key);
		} catch (Exception ex) {
			log.error("出现错误 bucketName:" + ex.toString());
			ex.printStackTrace();
		} finally {
			client.shutdown();
		}
	}

	/**
	 * 
	 * 根据前缀批量删除在bucket中的对象<br>
	 *
	 * @param bucketName
	 * @param prefix
	 */
	public void deleteObjectWithPrefix(String bucketName, String prefix) {
		try {
			ObjectListing objectListing = client.listObjects(new ListObjectsRequest(bucketName).withPrefix(prefix));
			if (!objectListing.getObjectSummaries().isEmpty()) {
				List<String> keys = new ArrayList<String>();
				for (OSSObjectSummary objectSummary : objectListing.getObjectSummaries()) {
					keys.add(objectSummary.getKey());
				}
				// 批量删除
				if (!keys.isEmpty()) {
					client.deleteObjects(new DeleteObjectsRequest(bucketName).withKeys(keys));
				}
			}
		} catch (Exception ex) {
			log.error("出现错误 bucketName:" + ex.toString());
			ex.printStackTrace();
		} finally {
			client.shutdown();
		}
	}

	/**
	 * 
	 * 根据sourceKey查找对象拷贝至destinationKey<br>
	 *
	 * @param bucketName
	 *            说明:oss支持跨bucket拷贝,咱这里只需要bucket内部拷贝,因此就只用了一个bucketName
	 * @param sourceKey
	 * @param destinationKey
	 */
	public void copyObject(String bucketName, String sourceKey, String destinationKey) {
		try {
			client.copyObject(bucketName, sourceKey, bucketName, destinationKey);
		} catch (Exception ex) {
			log.error("出现错误 bucketName:" + ex.toString());ex.printStackTrace();
		} finally {
			client.shutdown();
		}
	}

	/**
	 * 
	 * 根据前缀sourcePrefix查找对象集合进行批量拷贝至destinationPrefix前缀下<br>
	 *
	 * @param bucketName
	 * @param sourcePrefix
	 * @param destinationPrefix
	 */
	public void copyObjectWithPrefix(String bucketName, String sourcePrefix, String destinationPrefix) {
		try {
			ObjectListing objectListing = client.listObjects(new ListObjectsRequest(bucketName).withPrefix(sourcePrefix));
			if (!objectListing.getObjectSummaries().isEmpty()) {
				String sourceKey = null;
				for (OSSObjectSummary objectSummary : objectListing.getObjectSummaries()) {
					sourceKey = objectSummary.getKey();
					client.copyObject(bucketName, sourceKey, bucketName, sourceKey.replace(sourcePrefix, destinationPrefix));
				}
			}
		} catch (Exception ex) {
			log.error("出现错误 bucketName:" + ex.toString());ex.printStackTrace();
		} finally {
			client.shutdown();
		}
	}

	/**
	 * 
	 * 根据前缀sourcePrefix查找对象集合进行批量更名为destinationPrefix前缀<br>
	 *
	 * @param bucketName
	 * @param sourcePrefix
	 * @param destinationPrefix
	 */
	public void renameObjectWithPrefix(String bucketName, String sourcePrefix, String destinationPrefix) {
		try {
			ObjectListing objectListing = client.listObjects(new ListObjectsRequest(bucketName).withPrefix(sourcePrefix));
			if (!objectListing.getObjectSummaries().isEmpty()) {
				List<String> keys = new ArrayList<String>();
				String sourceKey = null;
				for (OSSObjectSummary objectSummary : objectListing.getObjectSummaries()) {
					sourceKey = objectSummary.getKey();
					client.copyObject(bucketName, sourceKey, bucketName, sourceKey.replace(sourcePrefix, destinationPrefix));
					keys.add(sourceKey);
				}
				// 批量删除
				if (!keys.isEmpty()) {
					client.deleteObjects(new DeleteObjectsRequest(bucketName).withKeys(keys));
				}
			}
		} catch (Exception ex) {
			log.error("出现错误 bucketName:" + ex.toString());ex.printStackTrace();
		} finally {
			client.shutdown();
		}
	}

	/**
	 * 
	 * 根据前缀prefix查找对象集合,将content中未引用的对象删除<br>
	 *
	 * @param bucketName
	 * @param prefix
	 * @param content
	 */
	public void cleanObjectWithPrefixAndContent(String bucketName, String prefix, String content) {
		try {
			ObjectListing objectListing = client.listObjects(new ListObjectsRequest(bucketName).withPrefix(prefix));
			if (!objectListing.getObjectSummaries().isEmpty()) {
				List<String> keys = new ArrayList<String>();
				String sourceKey = null;
				for (OSSObjectSummary objectSummary : objectListing.getObjectSummaries()) {
					sourceKey = objectSummary.getKey();
					if (!content.contains(sourceKey)) {
						keys.add(sourceKey);
					}
				}
				// 批量删除
				if (!keys.isEmpty()) {
					client.deleteObjects(new DeleteObjectsRequest(bucketName).withKeys(keys));
				}
			}
		} catch (Exception ex) {
			log.error("出现错误 bucketName:" + ex.toString());ex.printStackTrace();
		} finally {
			client.shutdown();
		}
	}

	/**
	 * 上传文件到OSS
	 * @param bucketName
	 * @param key
	 * @param source
	 * @return
     * @throws Exception
     */
	public String uploadFile(String bucketName,String key,InputStream source)throws Exception{
		try{
			client.putObject(bucketName, key, source);
		}catch (Exception e){
			key = null;
			log.error("出现错误 bucketName:" + e.toString());
			e.printStackTrace();
		}finally {
		}
		return key;
	}

	/**
	 * 读取oss指定路径下的文件
	 * @param bucketName
	 * @param sourcePrefix
	 * @param key
	 * @param shutdown 是否关闭
	 * @return
	 * @throws Exception
	 */
	public OSSObject getPrefuxFile(String bucketName, String sourcePrefix, String key, boolean shutdown)throws Exception{
		InputStream in =null;
		ZipOutputStream out = null;
		String prefix = null;
		OSSObject ossObject = null;
		try{
			if(StringUtils.hasText(sourcePrefix)){
				prefix = sourcePrefix+"/"+key;
			}else{
				prefix = key;
			}
			GetObjectRequest getObjectRequest = new GetObjectRequest(bucketName, prefix);
			ossObject =  client.getObject(getObjectRequest);
			ObjectMetadata objectMeta = ossObject.getObjectMetadata();
			log.info("content-Disposition:"+objectMeta.getContentDisposition());
			log.info("Content-Length :"+objectMeta.getContentLength());
			log.info("Content-Type :"+objectMeta.getContentType());
		}catch (Exception e){
			log.error("出现错误 bucketName:" + e.toString());
		}finally {
			try {
				if(out!=null){
					out.flush();
					out.close();
				}
			}catch (Exception e){}
			if(null != in){
				try {
					in.close();
				}catch (Exception e){}
			}
			if(shutdown) {
				client.shutdown();
			}
		}
		return ossObject;
	}

	/**
	 * 关闭oss
	 */
	public void shutdown(){
		client.shutdown();
	}
}
