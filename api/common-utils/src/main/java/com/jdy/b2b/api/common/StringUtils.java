package com.jdy.b2b.api.common;

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 字符串处理类
 * 
 * @author dengbo
 *
 */
public abstract class StringUtils {

	private static Logger log = Logger.getLogger(StringUtils.class.getName());

	/***
	 * 随机产生32位16进制字符串
	 * 
	 * @return
	 */
	public static String getRandom32PK() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

	/**
	 * 替换字符串中的逗号
	 * 
	 * @param str
	 * @return
	 */
	public static String replaceStr(String str) {
		if (str == null || "".equals(str)) {
			str = "0";
		}
		if (str.contains(",")) {
			str = str.replace(",", "");
		}
		return str;
	}

	/**
	 * 判断字符串是否为空或者空字符串
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNotNullOrEmptyStr(String str) {
		if (str == null || "".equals(str)) {
			return false;
		} else return !"null".equals(str);
	}

	/**
	 * 判断字符串是否为空或者空字符串
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNullOrEmptyStr(String str) {
		return !isNotNullOrEmptyStr(str);
	}

	/**
	 * 判断str是否为null或空字符串，若是，则返回空字符串，否则返回str.trim()。
	 * 
	 * @param str
	 * @return
	 */
	public static String objToStr(String str) {
		if (str == null || "".equals(str)) {
			return "";
		} else {
			return str.trim();
		}
	}

	/**
	 * 替换用科学计算法显示的数据
	 * 
	 * @param str
	 * @return
	 */
	public static String repStr(String str) {
		BigDecimal bigDecimal = new BigDecimal(str);
		DecimalFormat df = new DecimalFormat("0.00");
		return df.format(bigDecimal);
	}

	/**
	 * 字符串转换成金额的一般表示方法
	 * 
	 * @param str
	 * @return
	 */
	public static String repAmount(String str) {
		BigDecimal bigDecimal1 = new BigDecimal(str);
		BigDecimal bigDecimal2 = new BigDecimal(10000);
		// DecimalFormat df = new DecimalFormat("###,###,###0.00");
		bigDecimal1 = bigDecimal1.divide(bigDecimal2);
		// return df.format(bigDecimal1);
		return bigDecimal1.toString();
	}

	/**
	 * 金额相加
	 * 
	 * @param str1
	 * @param str2
	 * @return
	 */
	public static String addAmount(String str1, String str2) {
		if (isNotNullOrEmptyStr(str1) && str1.contains(",")) {
			str1 = str1.replaceAll(",", "");
		}
		if (isNotNullOrEmptyStr(str2) && str2.contains(",")) {
			str2 = str2.replaceAll(",", "");
		}
		BigDecimal bigDecimal1 = new BigDecimal(str1);
		BigDecimal bigDecimal2 = new BigDecimal(str2);
		bigDecimal1 = bigDecimal1.add(bigDecimal2);
		return bigDecimal1.toString();
	}

	/**
	 * 金额相除并转换成百分比形式
	 * 
	 * @param str1
	 * @param str2
	 * @param scale
	 * @return
	 */
	public static String divAmount(String str1, String str2, int scale) {
		BigDecimal bigDecimal1 = new BigDecimal(str1);
		BigDecimal bigDecimal2 = new BigDecimal(str2);
		double d = (bigDecimal1
				.divide(bigDecimal2, scale, BigDecimal.ROUND_HALF_UP)
				.doubleValue());
		// NumberFormat nFromat = NumberFormat.getPercentInstance();
		// String rates = nFromat.format(d);
		DecimalFormat df = new DecimalFormat("0.00%");
		String r = "";
		if (isNotNullOrEmptyStr(d + "")) {
			r = df.format(d);
		}
		return isNotNullOrEmptyStr(r) ? r : "0.00%";
	}

	/**
	 * 金额的差额
	 * 
	 * @return
	 */
	public static String getMargin(String str1, String str2) {
		if (isNotNullOrEmptyStr(str1) && str1.contains(",")) {
			str1 = str1.replaceAll(",", "");
		}
		if (isNotNullOrEmptyStr(str2) && str2.contains(",")) {
			str2 = str2.replaceAll(",", "");
		}
		BigDecimal bigDecimal1 = new BigDecimal(str1);
		BigDecimal bigDecimal2 = new BigDecimal(str2);
		// DecimalFormat df = new DecimalFormat("###,###,###0.00");
		bigDecimal1 = bigDecimal1.subtract(bigDecimal2);
		// return df.format(bigDecimal1);
		return bigDecimal1.toString();
	}

	/**
	 * 把金额用千分位显示
	 * 
	 * @param str
	 * @return
	 */
	public static String showAmount(String str) {
		BigDecimal bigDecimal1 = new BigDecimal(str);
		DecimalFormat df = new DecimalFormat("###,###,###,###.00");
		return df.format(bigDecimal1);
	}

	/**
	 * 正则表达式获取连个值之间的值
	 * 
	 * @param b
	 * @param e
	 * @param c
	 * @return
	 */
	public static String getRankVal(String b, String e, String c) {
		log.info("getRankVal b :=>" + b);
		log.info("getRankVal e :=>" + e);
		log.info("getRankVal c :=>" + c);

		Pattern psrjc = Pattern.compile("(?<=" + b + "=)[\\w|-]+(?=" + e + ")");
		Matcher msrjc = psrjc.matcher(c);
		if (msrjc.find()) {
			log.info("getRankVal msrjc.find() true ");
			String srjc = msrjc.group(0);
			log.info("getRankVal srjc :=> " + srjc);
			return srjc.trim();
		}
		return "";
	}

	/**
	 * 匹配中文
	 * 
	 * @param str
	 * @return
	 */
	public static boolean regZh(String str) {
		String reg = "[\u4E00-\u9FA5]+";
		Pattern p = Pattern.compile(reg);
		Matcher m = p.matcher(str);
        return m.find();
    }

	/**
	 * 字符串转成UTF-8
	 * 
	 * @param str
	 * @return
	 */
	public static String regZh2utf_8(String str) {
		if (regZh(str)) {
			try {
				return new String(str.getBytes("ISO-8859-1"), "UTF-8");
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				// e.printStackTrace();
			}
		}
		return str;
	}

	/**
	 * 字符串数组 转 字符串
	 * 
	 * @param arr
	 * @return
	 */
	public static String arrToStr(String[] arr) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < arr.length; i++) {
			sb.append(arr[i]);
		}
		return sb.toString();
	}

	public static final String inputStream2String(InputStream is)
			throws IOException {
		StringBuffer sb = new StringBuffer();
		InputStreamReader reader = new InputStreamReader(is, "utf-8");
		char[] buff = new char[1024];
		int length = 0;
		while ((length = reader.read(buff)) != -1) {
			sb.append(new String(buff, 0, length));
		}
		return sb.toString();
	}

	private static boolean isChinese(char c) {
		Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
        return ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
                || ub == Character.UnicodeBlock.GENERAL_PUNCTUATION
                || ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION
                || ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS;
    }

	public static boolean isMessyCode(String strName) {
		Pattern p = Pattern.compile("\\s*|\t*|\r*|\n*");
		Matcher m = p.matcher(strName);
		String after = m.replaceAll("");
		String temp = after.replaceAll("\\p{P}", "");
		char[] ch = temp.trim().toCharArray();
		float chLength = 0;
		float count = 0;
		for (int i = 0; i < ch.length; i++) {
			char c = ch[i];
			if (!Character.isLetterOrDigit(c)) {
				if (!isChinese(c)) {
					count = count + 1;
				}
				chLength++;
			}
		}
		float result = count / chLength;
        return result > 0.4;
	}

	// 转成utf-8编码
	public static String toEncodedUnicode(String theString,
			boolean escapeSpace) {
		int len = theString.length();
		int bufLen = len * 2;
		if (bufLen < 0) {
			bufLen = Integer.MAX_VALUE;
		}
		StringBuffer outBuffer = new StringBuffer(bufLen);

		for (int x = 0; x < len; x++) {
			char aChar = theString.charAt(x);
			// Handle common case first, selecting largest block that
			// avoids the specials below
			if ((aChar > 61) && (aChar < 127)) {
				outBuffer.append(aChar);
				continue;
			}

			switch (aChar) {
			case ' ':
				if (x == 0 || escapeSpace)
					outBuffer.append('\\');
				outBuffer.append(' ');
				break;
			case '\t':
				outBuffer.append('\\');
				outBuffer.append('t');
				break;
			case '\n':
				outBuffer.append('\\');
				outBuffer.append('n');
				break;
			case '\r':
				outBuffer.append('\\');
				outBuffer.append('r');
				break;
			case '\f':
				outBuffer.append('\\');
				outBuffer.append('f');
				break;
			case '=': // Fall through
			case ':':
				outBuffer.append(aChar);
				break;// Fall through
			case '#': // Fall through
			case '!':
				outBuffer.append('\\');
				outBuffer.append(aChar);
				break;
			default:
				if ((aChar < 0x0020) || (aChar > 0x007e)) {
					// 每个unicode有16位，每四位对应的16进制从高位保存到低位
					outBuffer.append('\\');
					outBuffer.append('u');
					outBuffer.append(toHex((aChar >> 12) & 0xF));
					outBuffer.append(toHex((aChar >> 8) & 0xF));
					outBuffer.append(toHex((aChar >> 4) & 0xF));
					outBuffer.append(toHex(aChar & 0xF));
				} else {
					outBuffer.append(aChar);
				}
			}
		}
		return outBuffer.toString();
	}

	private static char toHex(int nibble) {
		return hexDigit[(nibble & 0xF)];
	}

	private static final char[] hexDigit = { '0', '1', '2', '3', '4', '5', '6',
			'7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };

	public static String base64Encode(String source)
			throws UnsupportedEncodingException {
		return new String(Base64.encodeBase64(source.getBytes("UTF-8")),
				"UTF-8");
	}

	public static boolean isEnglish(String charaString) {

		return charaString.matches("^[a-zA-Z]*");

	}
}
