package com.jdy.b2b.web.controll;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.util.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * Created by ASUS on 2017/6/26.
 */
@Controller
public class TestController extends BaseController
{
    @RequestMapping("/")
    public String index(Map<String,Object> map){

        map.put("index","from TemplateController.helloHtml");
        return"index";
    }

    @RequestMapping("/helloHtml")
    public String helloHtml(Map<String,Object> map){

        map.put("hello","from TemplateController.helloHtml");
        return"helloHtml";
    }

    @RequestMapping(value="/json")
    @ResponseBody
    public String json(Map<String,Object> map){
        User user = new User();
        user.setId(1l);
        user.setName("李康强");

        return JSON.toJSONString(user);
    }

    @RequestMapping("/writelog")
    @ResponseBody
    public Object writeLog()
    {
        logger.debug("This is a debug message");
        logger.info("This is an info message");
        logger.warn("This is a warn message");
        logger.error("This is an error message");
        return "OK";
    }
    class User{
        String name;
        Long id;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
    }
    @RequestMapping("/baidu")
    public String baidu(){

        return"baidu";
    }
    @RequestMapping("fileupload")
    public String a(){

        return"FileUpload";
    }
}
