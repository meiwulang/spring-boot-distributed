package com.jdy.b2b.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class B2bReportsApplication {

	public static void main(String[] args) {
		SpringApplication.run(B2bReportsApplication.class, args);
		System.out.println("报表中心启动成功!!!");
	}
}
