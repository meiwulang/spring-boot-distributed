package com.jdy.b2b.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Created by ASUS on 2017/5/5.
 */
@EnableAutoConfiguration
@SpringBootApplication
@EnableTransactionManagement
@ServletComponentScan
@EnableScheduling
public class ControllCenterApp {

	public static void main(String[] args) {
		SpringApplication.run(ControllCenterApp.class, args);
		System.out.println("                               B2B计调、资源中心服务进程启动完成");
	}
}