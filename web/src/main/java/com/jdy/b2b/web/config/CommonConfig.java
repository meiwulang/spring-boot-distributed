package com.jdy.b2b.web.config;

import javax.servlet.MultipartConfigElement;

import org.springframework.boot.autoconfigure.web.HttpMessageConverters;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;

import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;

@Configuration
public class CommonConfig {

	@Bean
	public MultipartConfigElement multipartConfigElement() {
		MultipartConfigFactory factory = new MultipartConfigFactory();
		factory.setMaxFileSize(1024L * 1024L * 10L);// 文件限制最大10M
		return factory.createMultipartConfig();
	}

	@Bean
	public HttpMessageConverters customConverters() {
		HttpMessageConverter<?> additional = new FastJsonHttpMessageConverter();
		return new HttpMessageConverters(additional);
	}
}