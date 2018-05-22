package com.jdy.b2b.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class B2bFinanceApplication {

	public static void main(String[] args) {
		SpringApplication.run(B2bFinanceApplication.class, args);
		System.out.println("财务中心启动成功!!!");
	}
}
