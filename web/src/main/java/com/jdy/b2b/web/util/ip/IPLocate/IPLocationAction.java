/**
 * 
 */
package com.jdy.b2b.web.util.ip.IPLocate;



import com.jdy.b2b.web.util.ip.IPParseNew.IPLocation;
import com.jdy.b2b.web.util.ip.IPParseNew.IPSeeker;
import com.jdy.b2b.web.util.ip.analyzer.sample.IKAnalzyerDemo;

/**
 * @author xujunj
 * ip定位
 */
public class IPLocationAction {
	private static IPSeeker ipSeeker ;
	public static IPResult getIPLocation(String ip,String path) {

		if(ipSeeker==null){
			ipSeeker = IPSeeker.getInstance(path+"/qqwry.dat");
		}
		IPResult result = new IPResult();
		IPLocation location = ipSeeker.getIPLocation(ip);

		IKAnalzyerDemo.getRegionCode(location.getCountry(), result);
		result.setCarrier(location.getArea());

		return result;
	}
}
