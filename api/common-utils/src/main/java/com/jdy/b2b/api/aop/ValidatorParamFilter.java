package com.jdy.b2b.api.aop;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.MD5;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.StaticDateInYML;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.*;
import java.util.stream.Stream;

/**
 * Created by dugq on 2017/10/10.
 */
@WebFilter(filterName = "requestTokenValidator", urlPatterns = "/fingercrm/*", dispatcherTypes = DispatcherType.REQUEST)
public class ValidatorParamFilter implements Filter {
    private static final ResultBean errorResult = new ResultBean("-10", "sorry ! error token~");
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final static ArrayList ignoreKeys= new ArrayList(){{add("promotionList");}};

    public void writeResult2Response(HttpServletResponse response) {
        ServletOutputStream outputStream = null;
        try {
            outputStream = response.getOutputStream();
            response.setHeader("Content-Type",
                    "application/json;charset=UTF-8");
            outputStream.write(JSON.toJSONString(errorResult)
                    .getBytes("UTF-8"));
        } catch (IOException e1) {
            e1.printStackTrace();
        } finally {
            try {
                outputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String method = request.getMethod();
        String time = null;
        String token = null;
        List<String> paramNames = new LinkedList<>();
        boolean result;
        if ("GET".equalsIgnoreCase(method)) {
            Map<String, String[]> parameterMap = request.getParameterMap();
            for (Map.Entry<String, String[]> entry : parameterMap.entrySet()) {
                if ("time".equalsIgnoreCase(entry.getKey())) {
                    time = entry.getValue()[0];
                } else if ("accesstoken".equalsIgnoreCase(entry.getKey())) {
                    token = entry.getValue()[0];
                } else {
                    paramNames.add(entry.getKey());
                }
            }
            HashMap map = new HashMap();
            map.putAll(parameterMap);
            result = ComparingToken(time, token, paramNames,map);
        } else {
            Map<String, String[]> parameterMap = request.getParameterMap();
            Map<String, Object> map = new HashMap<>();
            map.putAll(parameterMap);
            HttpServletRequest requestWrapper = new BodyReaderHttpServletRequestWrapper(request);
            String body = HttpHelper.getBodyString(requestWrapper);
            if (!StringUtils.isBlank(body)) {
                String contentType = request.getContentType();
                if (contentType.equals("application/x-www-form-urlencoded")) {
                    JSONObject jsonObject = JSON.parseObject(body);
                    map.putAll(jsonObject);
                } else {
                    try {
                        JSONObject jsonObject = JSON.parseObject(body);
                        map.putAll(jsonObject);
                    } catch (Exception e) {
                        Stream.of(body.split("&")).forEach(
                                str -> {
                                    String[] split = str.split("=");
                                    if (split.length < 1) {
                                        return;
                                    } else if (split.length == 1) {
                                        map.put(split[0], "");
                                    } else if (split.length == 2) {
                                        try {
                                            map.put(split[0], URLDecoder.decode(split[1], "UTF-8"));
                                        } catch (UnsupportedEncodingException e1) {
                                            e.printStackTrace();
                                        }
                                    } else {
                                        return;
                                    }
                                }
                        );
                    }
                }
            }
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                if ("time".equalsIgnoreCase(entry.getKey())) {
                    if (entry.getValue() instanceof String[]) {
                        time = ((String[]) entry.getValue())[0];
                    } else if(entry.getValue() instanceof String){
                        time = (String) entry.getValue();
                    }else if(entry.getValue() instanceof Long){
                        time = Long.toString((Long)(entry.getValue()));
                    }else{
                        writeResult2Response((HttpServletResponse) servletResponse);
                        return;
                    }
                } else if ("accesstoken".equalsIgnoreCase(entry.getKey())) {
                    if (entry.getValue() instanceof String[]) {
                        token = ((String[]) entry.getValue())[0];
                    } else if(entry.getValue() instanceof String){
                        token = (String) entry.getValue();
                    }else {
                        token = entry.getValue().toString();
                    }
                } else {
                    paramNames.add(entry.getKey());
                }
            }
            servletRequest = requestWrapper;
            result = ComparingToken(time, token, paramNames, map);
        }
        if (result) {
            filterChain.doFilter(servletRequest, servletResponse);
        } else {
            writeResult2Response((HttpServletResponse) servletResponse);
        }
    }

    private boolean ComparingToken(String time, String token, List<String> paramNames, Map map) throws IOException, ServletException {
        StringBuilder md5Key = new StringBuilder();
        if (StringUtils.isBlank(time)) {
            return false;
        }
        if (StringUtils.isBlank(token)) {
            return false;
        }
        paramNames.add("time");
        map.put("time",time);
        Collections.sort(paramNames);
        paramNames.forEach(name -> {
            Object obj = map.get(name);

            if(ignoreKeys.contains(name)){
                return;
            }

            if (obj instanceof String[]) {
                String[] strs = (String[]) obj;
                md5Key.append(name+"="+StringUtils.join(strs)+"&");
            }
            else {
                md5Key.append(name+"="+obj+"&");
            }
        });
        md5Key.append("key="+ StaticDateInYML.accessKey);
        String str = md5Key.toString();
        logger.error("加密串=========="+str);
        if (token.equals(MD5.GetMD5Code(str))) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void destroy() {

    }

    public static class HttpHelper {

        /**
         * 获取请求Body
         *
         * @param request
         * @return
         */
        public static String getBodyString(ServletRequest request) {
            StringBuilder sb = new StringBuilder();
            InputStream inputStream = null;
            BufferedReader reader = null;
            try {
                inputStream = request.getInputStream();
                reader = new BufferedReader(new InputStreamReader(inputStream, Charset.forName("UTF-8")));
                String line = "";
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (inputStream != null) {
                    try {
                        inputStream.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if (reader != null) {
                    try {
                        reader.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            return sb.toString();
        }

    }

    public class BodyReaderHttpServletRequestWrapper extends HttpServletRequestWrapper {

        private final byte[] body;

        public BodyReaderHttpServletRequestWrapper(HttpServletRequest request) throws IOException {
            super(request);
            body = HttpHelper.getBodyString(request).getBytes(Charset.forName("UTF-8"));
        }

        @Override
        public BufferedReader getReader() throws IOException {
            return new BufferedReader(new InputStreamReader(getInputStream()));
        }

        @Override
        public ServletInputStream getInputStream() throws IOException {

            final ByteArrayInputStream bais = new ByteArrayInputStream(body);

            return new ServletInputStream() {

                @Override
                public int read() throws IOException {
                    return bais.read();
                }

                @Override
                public boolean isFinished() {
                    return false;
                }

                @Override
                public boolean isReady() {
                    return false;
                }

                @Override
                public void setReadListener(ReadListener readListener) {

                }
            };
        }
    }
}
