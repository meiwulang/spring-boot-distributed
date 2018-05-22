/*
 * Powered By [dchy-framework]
 * Web Site: http://www.fingercrm.cn
 */

package com.jdy.b2b.api.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Jdbc工具类
 * 
 * @author zb
 * @version 1.0
 * @since 1.0
 */
public class JdbcUtils {
	/**
	 * 封装in,返回 "(?,?,?)"
	 * 
	 * @param length
	 * @return
	 */
	public static String wrapIn(int length) {
		StringBuffer sb = new StringBuffer();
		sb.append("(");
		for (int i = 0; i < length; i++) {
			sb.append(i != 0 ? "," : "");
			sb.append("?");
		}
		return sb.append(")").toString();
	}

	/**
	 * 去除圆括号<br>
	 * 例如: select substr(kx.name),kx.address from (select * from tableA where
	 * name in (?)) kx where kx.id in (?) and kx.date =
	 * to_date('2011-9-1','yyyy-mm-dd') and kx.cw = ?<br>
	 * 返回: select substr[-],kx.address from [-] kx where kx.id in [-] and
	 * kx.date = to_date[-] and kx.cw = ?
	 * 
	 * @param str
	 * @return
	 */
	public static String replaceAllParenthesis(String str) {
		while (str.contains("(")) {
			str = str.replaceAll("\\(([^()])*\\)", "[-]");
		}
		return str;
	}

	/**
	 * 将map的key从大写转小写
	 * 
	 * @param map
	 */
	public static Map<String, Object> lowerCaseMapKey(Map<String, Object> map) {
		Map<String, Object> newmap = new HashMap<String, Object>();
		for (String key : map.keySet()) {
			newmap.put(key.toLowerCase(), map.get(key));
		}
		return newmap;
	}

	/**
	 * 将listMap的key从大写转小写
	 * 
	 * @param listMap
	 */
	public static List<Map<String, Object>> lowerCaseMapKey(List<Map<String, Object>> listMap) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		for (Map<String, Object> map : listMap) {
			list.add(lowerCaseMapKey(map));
		}
		return list;
	}
}
