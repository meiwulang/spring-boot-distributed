/**
 * IK 中文分词  版本 5.0.1
 * IK Analyzer release 5.0.1
 * 
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * 源代码由林良益(linliangyi2005@gmail.com)提供
 * 版权声明 2012，乌龙茶工作室
 * provided by Linliangyi and copyright 2012 by Oolong studio
 * 
 * 
 */
package com.jdy.b2b.web.util.ip.analyzer.sample;

import com.jdy.b2b.web.util.ip.IPLocate.IPResult;
import com.jdy.b2b.web.util.ip.analyzer.lucene.IKAnalyzer;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.apache.lucene.analysis.tokenattributes.OffsetAttribute;
import org.apache.lucene.analysis.tokenattributes.TypeAttribute;

import java.io.IOException;
import java.io.StringReader;

/**
 * 使用IKAnalyzer进行分词的演示
 * 2012-10-22
 *
 */
public class IKAnalzyerDemo {
	
	//public static String code;
	
	
	public static void getRegionCode(String region, IPResult ipResult){
		//构建IK分词器，使用smart分词模式
		Analyzer analyzer = new IKAnalyzer(true);
		//获取Lucene的TokenStream对象
	    TokenStream ts = null;
		try {
			ts = analyzer.tokenStream("myfield", new StringReader(region));
			//获取词元位置属性
		    OffsetAttribute offset = ts.addAttribute(OffsetAttribute.class);
		    //获取词元文本属性
		    CharTermAttribute term = ts.addAttribute(CharTermAttribute.class);
		    //获取词元文本属性
		    TypeAttribute type = ts.addAttribute(TypeAttribute.class);
		    
		    
		    //重置TokenStream（重置StringReader）
			ts.reset(); 
			//迭代获取分词结果
			String tmp;
			String[] a;
			while (ts.incrementToken()) {
			  //System.out.println(offset.startOffset() + " - " + offset.endOffset() + " : " + term.toString() + " | " + type.type());
			  //System.out.println(code);
				//System.out.println((term.subSequence(0, term.length())).toString());
				
				//term.
				if (term != null) {
					 tmp = term.toString();
					 a = tmp.split(";");
					 if (a != null && a.length == 2) {
						//System.out.println(a[0] + "********" + a[1]);
						if (a[1].length() == 2) {
							ipResult.setProvince(a[0]);
							ipResult.setProvinceCode(a[1]);
						}else if(a[1].length() == 4){
							ipResult.setCity(a[0]);
							ipResult.setCityCode(a[1]);	  
						}
					}
				}
				
				/*if (code != null) {
					if (code.length() == 2) {
						ipResult.setProvince(term.toString());
						ipResult.setProvinceCode(code);
					}else if(code.length() == 4){
						ipResult.setCity(term.toString());
						ipResult.setCityCode(code);	  
					}
				}*/
			  //System.out.println(term.toString() + ":" + code );
			}
			
			//关闭TokenStream（关闭StringReader）
			ts.end();   // Perform end-of-stream operations, e.g. set the final offset.

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			//释放TokenStream的所有资源
			if(ts != null){
		      try {
				ts.close();
		      } catch (IOException e) {
				e.printStackTrace();
		      }
			}
	    }
		
	}

}
