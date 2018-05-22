package com.jdy.b2b.api.util;

import java.util.HashMap;
import java.util.Map;

public class DataContext {


	private static ThreadLocal<DataContext> dataContext = new ThreadLocal<DataContext>() {
		@Override
		protected DataContext initialValue() {
			return new DataContext();
		}
	};

	private Map<String, Object> store = new HashMap<String, Object>();

	// 获取线程上下文
	private static DataContext getDataContext() {
		return dataContext.get();
	}

	// 线程上下文存储容器
	private static Map<String, Object> getStore() {
		return getDataContext().store;
	}

	public static Object set(String key, Object value) {
		return getStore().put(key, value);
	}

	public static Object get(String key) {
		return getStore().get(key);
	}


	public static Object remove(String key) {
		return getStore().remove(key);
	}

	public static void clear() {
		getStore().clear();
	}


}