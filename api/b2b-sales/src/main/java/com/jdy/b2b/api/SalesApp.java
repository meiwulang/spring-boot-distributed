package com.jdy.b2b.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class SalesApp {

	public static void main(String[] args) {
		SpringApplication.run(SalesApp.class, args);
		System.out.println("销售中心启动成功!!");
	}
}
