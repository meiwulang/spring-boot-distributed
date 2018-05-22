package com.jdy.b2b.api.common;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5 {

	// 全局数组
	private final static String[] strDigits = { "0", "1", "2", "3", "4", "5",
			"6", "7", "8", "9", "a", "b", "c", "d", "e", "f" };
	private final static char[] charDigits = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };

	public MD5() {
	}

	// 返回形式为数字跟字符串
	private static String byteToArrayString(byte bByte) {
		int iRet = bByte;
		// System.out.println("iRet="+iRet);
		if (iRet < 0) {
			iRet += 256;
		}
		int iD1 = iRet / 16;
		int iD2 = iRet % 16;
		return strDigits[iD1] + strDigits[iD2];
	}

	// 返回形式只为数字
	private static String byteToNum(byte bByte) {
		int iRet = bByte;
		System.out.println("iRet1=" + iRet);
		if (iRet < 0) {
			iRet += 256;
		}
		return String.valueOf(iRet);
	}

	// 转换字节数组为16进制字串
	private static String byteToString(byte[] bByte) {
		StringBuffer sBuffer = new StringBuffer();
		for (int i = 0; i < bByte.length; i++) {
			sBuffer.append(byteToArrayString(bByte[i]));
		}
		/*for (int i = 0; i < bByte.length; i++) {
			int val = ((int) bByte[i]) & 0xff;
			if (val < 16)
				sBuffer.append("0");
			sBuffer.append(Integer.toHexString(val));
		}

		char[] strChar = new char[2*16];
		int k = 0;
		for(int i=0;i<16;i++){
			byte b   = bByte[i];

			strChar[k++] = charDigits[b>>>4 & 0xf];//高4位
			strChar[k++] = charDigits[b & 0xf];//低4位
		}

		return new String(strChar);
*/
		return sBuffer.toString();
	}

	public static String GetMD5Code(String strObj) {
		String resultString = null;
		try {
			resultString = new String(strObj);
			MessageDigest md = MessageDigest.getInstance("MD5");
			// md.digest() 该函数返回值为存放哈希值结果的byte数组
			resultString = byteToString(md.digest(strObj.getBytes()));
		} catch (NoSuchAlgorithmException ex) {
			ex.printStackTrace();
		}
		return resultString;
	}

	public static void main(String[] args) {
		// MD5 getMD5 = new MD5();
		String[] sts = { "SDK20151627040538323fmnjcvi6gp8n",
				"SDK20150913090558n1xw9m8maffb86y",
				"SDK20150913090544el959y7r2jrf36i",
				"SDK20141730051231577izqci66cvsuu",
				"SDK201417120511442g8v9vxkmu8yupw",
				"SDK201511121102503886hkgv5uplj0s",
				"SDK20151512030219cj23eloytok0pv8",
				"SDK20131512031222h7a24fwxid4o46r",
				"SDK20121322010607dbsxiu0habd2zri",
				"SDK2014091309095604btx9nw42cldjy" };
		StringBuffer sb = new StringBuffer();
		for(int i=0;i<sts.length;i++){
			if(i==sts.length-1){
				sb.append(MD5.GetMD5Code(sts[i]));
			}else{
				sb.append(MD5.GetMD5Code(sts[i]));
				sb.append(",");
			}
		}
		System.out.println(MD5.GetMD5Code("SDK20150913090558n1xw9m8maffb86y"));
	}
}
